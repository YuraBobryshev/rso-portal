const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); 
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');
const { upload } = require('./s3Config'); 
const axios = require('axios'); 
const app = express();
const prisma = new PrismaClient();
const DOMAIN_URL = 'https://xn--b1af2ahcd.xn--p1ai';
const crypto = require('crypto');
const ExcelJS = require('exceljs');
const { startBot } = require('./vkBot');
const { sendSystemAlert, Keyboard } = require('./vkBot');
const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

app.use(cors());
app.use(express.json());
startBot();

const checkRole = (allowedRoles) => async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Доступ запрещен: недостаточно прав' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Ошибка проверки прав доступа' });
  }
};

// Вспомогательные функции для новой системы (PKCE и Куки)
function base64URLEncode(buffer) {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function parseCookies(req) {
  const list = {};
  const cookieHeader = req.headers?.cookie;
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    let [name, ...rest] = cookie.split('=');
    name = name?.trim();
    if (!name) return;
    list[name] = decodeURIComponent(rest.join('=').trim());
  });
  return list;
}


// =============================================================================
// 🔐 БЛОК 1: АВТОРИЗАЦИЯ И ПРОФИЛЬ
// =============================================================================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Этот Email уже занят' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName, vkUrl: "", tgUrl: "" }
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user: { id: user.id, email, firstName, lastName, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера при создании аккаунта' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Неверные данные' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
  } catch (error) { res.status(500).json({ message: 'Ошибка сервера' }); }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { 
        id: true, 
        email: true, 
        firstName: true, 
        lastName: true, 
        role: true, 
        createdAt: true, 
        brigade: true, 
        vkUrl: true, 
        tgUrl: true, 
        avatarUrl: true,
        password: true,   // Выбираем для проверки наличия
        vkId: true,       // Выбираем для проверки привязки
        googleId: true,   // Выбираем для проверки привязки
        yandexId: true,   // Выбираем для проверки привязки
        applications: {
          include: { brigade: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Формируем безопасный ответ с булевыми флагами
    const responseData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
      brigade: user.brigade,
      vkUrl: user.vkUrl,
      tgUrl: user.tgUrl,
      avatarUrl: user.avatarUrl,
      applications: user.applications,
      // Умные флаги для фронтенда:
      hasPassword: !!user.password,
      hasVk: !!user.vkId,
      hasGoogle: !!user.googleId,
      hasYandex: !!user.yandexId
    };

    res.json(responseData);
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    res.status(500).json({ message: "Ошибка сервера при получении профиля" });
  }
});

app.patch('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    const { vkUrl, tgUrl, firstName, lastName } = req.body;
    
    // Динамически формируем объект для обновления базы данных
    const updateData = {};
    
    if (vkUrl !== undefined) updateData.vkUrl = vkUrl || "";
    if (tgUrl !== undefined) updateData.tgUrl = tgUrl || "";
    
    // Валидируем имя, если оно передано
    if (firstName !== undefined) {
      if (!firstName.trim()) {
        return res.status(400).json({ message: 'Имя не может быть пустым' });
      }
      updateData.firstName = firstName.trim();
    }
    
    // Валидируем фамилию, если она передана
    if (lastName !== undefined) {
      if (!lastName.trim()) {
        return res.status(400).json({ message: 'Фамилия не может быть пустой' });
      }
      updateData.lastName = lastName.trim();
    }

    // Обновляем данные в Postgres через Prisma
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        vkUrl: true,
        tgUrl: true,
        avatarUrl: true
      }
    });

    res.json({ message: "Профиль успешно обновлен", user: updatedUser });
  } catch (error) { 
    console.error('Ошибка обновления профиля:', error);
    res.status(500).json({ message: "Ошибка сервера при обновлении профиля" }); 
  }
});

app.post('/api/auth/upload-avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Файл не получен" });
    const imageUrl = req.file.location;
    await prisma.user.update({ where: { id: req.user.userId }, data: { avatarUrl: imageUrl } });
    res.json({ message: "Avatar updated", avatarUrl: imageUrl });
  } catch (error) { res.status(500).json({ message: "Ошибка загрузки" }); }
});

app.post('/api/auth/set-password', authMiddleware, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Пароль должен быть не менее 6 символов' });
    }

    // 1. Проверяем, нет ли уже пароля у пользователя (защита от перезаписи без старого пароля)
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { password: true }
    });

    if (user && user.password) {
      return res.status(400).json({ message: 'Пароль уже установлен. Для изменения используйте роут смены пароля.' });
    }

    // 2. Хешируем новый пароль через bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Сохраняем в базу данных
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Пароль успешно установлен. Теперь вы можете входить по почте.' });
  } catch (error) {
    console.error('Ошибка установки пароля:', error);
    res.status(500).json({ message: 'Ошибка сервера при установке пароля' });
  }
});

// =============================================================================
// ⚙️ БЛОК 2: АДМИНИСТРИРОВАНИЕ
// =============================================================================

app.get('/api/admin/users', authMiddleware, checkRole(['REG_HQ']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { 
        id: true, email: true, firstName: true, lastName: true, role: true, brigadeId: true, avatarUrl: true,
        vkId: true, googleId: true, yandexId: true, // <-- ДОБАВИЛИ ЭТИ ПОЛЯ
        brigade: { select: { name: true } } 
      }
    });
    res.json(users);
  } catch (e) { res.status(500).json({ message: "Ошибка" }); }
});

app.patch('/api/admin/unlink-account', authMiddleware, checkRole(['REG_HQ']), async (req, res) => {
  try {
    const { userId, provider } = req.body;
    const data = {};
    
    if (provider === 'vk') data.vkId = null;
    if (provider === 'google') data.googleId = null;
    if (provider === 'yandex') data.yandexId = null;

    await prisma.user.update({ where: { id: userId }, data });
    res.json({ message: 'Аккаунт успешно отвязан' });
  } catch (e) { 
    res.status(500).json({ message: "Ошибка отвязки аккаунта" }); 
  }
});

app.patch('/api/admin/update-role', authMiddleware, checkRole(['REG_HQ']), async (req, res) => {
  const { userId, newRole } = req.body;
  await prisma.user.update({ where: { id: userId }, data: { role: newRole } });
  res.json({ message: 'Роль обновлена' });
});

// НОВЫЙ РОУТ: Верификация Кандидата до официального Бойца Региональным штабом
app.patch('/api/admin/verify-boets', authMiddleware, checkRole(['REG_HQ']), async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    if (user.role !== 'CANDIDATE') {
      return res.status(400).json({ message: 'Пользователь должен иметь статус Кандидата' });
    }
    await prisma.user.update({ where: { id: userId }, data: { role: 'BOETS' } });
    res.json({ message: 'Пользователь успешно верифицирован как официальный Боец!' });
  } catch (e) { res.status(500).json({ message: "Ошибка сервера" }); }
});

app.post('/api/admin/create-brigade', authMiddleware, checkRole(['REG_HQ']), upload.single('logo'), async (req, res) => {
  try {
    const { name, description, type, colorScheme } = req.body;
    const logoUrl = req.file ? req.file.location : null;
    const brigade = await prisma.brigade.create({
      data: { name, description, type, colorScheme: colorScheme || "#0052FF", logoUrl }
    });
    res.status(201).json({ message: 'Отряд успешно создан', brigade });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера при создании отряда' });
  }
});

app.patch('/api/admin/update-user-brigade', authMiddleware, checkRole(['REG_HQ']), async (req, res) => {
  const { userId, brigadeId } = req.body;
  await prisma.user.update({
    where: { id: userId },
    data: { brigadeId: brigadeId === 'none' ? null : brigadeId }
  });
  res.json({ message: 'Боец распределен' });
});

app.delete('/api/admin/users/:id', authMiddleware, checkRole(['REG_HQ']), async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user.userId) return res.status(400).json({ message: "Самоликвидация запрещена" });
    await prisma.user.delete({ where: { id } });
    res.json({ message: "Объект удален" });
  } catch (error) { res.status(500).json({ message: "Ошибка при удалении" }); }
});

app.delete('/api/events/:id/leave', authMiddleware, async (req, res) => {
  try {
    await prisma.eventParticipant.deleteMany({ where: { userId: req.user.userId, eventId: req.params.id } });
    res.json({ message: "Участие отменено" });
  } catch (error) { res.status(500).json({ message: "Ошибка" }); }
});

app.get('/api/admin/events', authMiddleware, checkRole(['REG_HQ']), async (req, res) => {
  try {
    const events = await prisma.event.findMany({ orderBy: { date: 'desc' } });
    const allParticipants = await prisma.eventParticipant.findMany();
    const users = await prisma.user.findMany({ select: { id: true, firstName: true, lastName: true, brigadeId: true } });
    const brigades = await prisma.brigade.findMany();

    const formattedEvents = events.map(event => {
      const eventParts = allParticipants.filter(p => p.eventId === event.id);
      const enrichedParticipants = eventParts.map(ep => {
        const user = users.find(u => u.id === ep.userId) || {};
        const brigade = brigades.find(b => b.id === user.brigadeId) || null;
        return { id: ep.id, user: { id: user.id || 'unknown', firstName: user.firstName || 'Удаленный', lastName: user.lastName || 'Пользователь', brigade: brigade } };
      });
      return { ...event, participants: enrichedParticipants };
    });
    res.json(formattedEvents);
  } catch (error) { res.status(500).json({ message: "Ошибка" }); }
});

// =============================================================================
// 🤝 БЛОК 3: ОТРЯДЫ И ЗАЯВКИ
// =============================================================================

// ОЧИЩЕННЫЙ И ИСПРАВЛЕННЫЙ РОУТ ОТРЯДОВ:
app.get('/api/brigades', async (req, res) => {
  try {
    const brigades = await prisma.brigade.findMany({
      include: { _count: { select: { users: true } } }
    });
    // Строку res.json(distributors); СТЕРЛИ НАВСЕГДА
    res.json(brigades);
  } catch (e) { 
    console.error(e);
    res.status(500).json({ message: "Ошибка при получении реестра отрядов" }); 
  }
});

// ИСПРАВЛЕНО: Прием расширенной анкеты
app.post('/api/applications/apply', authMiddleware, async (req, res) => {
  try {
    const { brigadeId, phone, aboutMe, skills } = req.body;
    const userId = req.user.userId;

    // 1. Создаем заявку в базе (у тебя уже есть похожая логика)
    const newApplication = await prisma.application.create({
      data: { 
        userId, 
        brigadeId, 
        status: 'PENDING',
        phone,       // Если эти поля уже добавлены в схему
        aboutMe,
        skills
      }
    });

    // Получаем данные кандидата и отряда для текста сообщения
    const candidate = await prisma.user.findUnique({ where: { id: userId } });
    const brigade = await prisma.brigade.findUnique({ where: { id: brigadeId } });

    // Отправляем успешный ответ клиенту сразу, не заставляя его ждать отправку ВК
    res.json({ message: 'Заявка успешно отправлена!' });

    // =========================================================
    // 🤖 МАГИЯ ВК-БОТА: ОПОВЕЩАЕМ КОМАНДИРА
    // =========================================================
    const commander = await prisma.user.findFirst({
      where: { brigadeId: brigadeId, role: 'COMMANDER' }
    });

    // Важно: ВК разрешает боту писать юзеру только если юзер сам написал боту первым (кнопка "Начать")
    if (commander && commander.vkId) {
      // Собираем красивую клавиатуру
      const alertKeyboard = Keyboard.builder()
        .inline()
        .urlButton({ 
          label: 'Перейти в систему', 
          url: 'https://xn--b1af2ahcd.xn--p1ai/profile' // Ссылка на твой прод
        });

      // Формируем текст
      const msg = `🔥 Новая заявка в отряд «${brigade.name}»!\n\n` +
                  `Кандидат: ${candidate.lastName} ${candidate.firstName}\n` +
                  `О себе: ${aboutMe || 'Не указано'}\n` +
                  `Навыки: ${skills || 'Не указаны'}\n\n` +
                  `Зайди в цифровой профиль штаба, чтобы рассмотреть анкету.`;

      // Отправляем
      await sendSystemAlert(commander.vkId, msg, alertKeyboard);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при подаче заявки' });
  }
});

// ИСПРАВЛЕНО: Теперь сохраняет текстовый комментарий/причину отказа в базу данных
app.post('/api/commander/process-application', authMiddleware, checkRole(['COMMANDER', 'REG_HQ']), async (req, res) => {
  try {
    const { appId, status, comment } = req.body;
    const application = await prisma.application.update({ 
      where: { id: appId }, 
      data: { status, comment: comment || null } 
    });
    
    if (status === 'APPROVED') {
      await prisma.user.update({ 
        where: { id: application.userId }, 
        data: { role: 'CANDIDATE', brigadeId: application.brigadeId } 
      });
    }
    res.json({ message: 'Заявка обработана комсоставом' });
  } catch (e) { res.status(500).json({ message: 'Ошибка обработки заявки' }); }
});

// =============================================================================
// 📅 БЛОК 4: МЕРОПРИЯТИЯ И ПОСЕЩАЕМОСТЬ (Полная синхронизация и защита)
// =============================================================================

app.post('/api/events', authMiddleware, checkRole(['COMMANDER', 'COMMISSAR', 'MASTER', 'REG_HQ']), async (req, res) => {
  try {
    const { title, description, date, location, lat, lng, type } = req.body;
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    let targetBrigadeId = null;
    let eventType = "LOCAL";

    // Логика определения уровня мероприятия
    if (user.role === 'REG_HQ') {
      eventType = type || "REGIONAL";
      targetBrigadeId = eventType === 'REGIONAL' ? null : req.body.brigadeId;
    } else {
      if (!user.brigadeId) return res.status(403).json({ message: "Вы не привязаны к ЛСО" });
      targetBrigadeId = user.brigadeId;
    }

    // 1. СОЗДАЕМ СОБЫТИЕ В БАЗЕ (Теперь со всеми полями!)
    const newEvent = await prisma.event.create({
      data: {
        title,
        description: description || "Описание не указано",
        date: new Date(date),
        location: location || "Не указано",
        lat: lat || null,
        lng: lng || null,
        type: eventType,
        brigadeId: targetBrigadeId
      }
    });

    // 2. СРАЗУ отдаем успешный ответ фронтенду, чтобы модалка закрылась без красных ошибок
    res.status(201).json(newEvent);

    // =========================================================
    // 🤖 МАГИЯ ВК-БОТА: МАССОВАЯ РАССЫЛКА (Работает в фоне)
    // =========================================================
    console.log(`[VK Bot] Старт рассылки. Тип события: ${eventType}`);

    let targetUsers = [];
    if (eventType === 'REGIONAL') {
      targetUsers = await prisma.user.findMany({
        where: { vkId: { not: null } }
      });
    } else {
      console.log(`[VK Bot] ID отряда создателя: ${targetBrigadeId}`);
      if (targetBrigadeId) {
        targetUsers = await prisma.user.findMany({
          where: {
            brigadeId: targetBrigadeId,
            vkId: { not: null }
          }
        });
      }
    }

    console.log(`[VK Bot] Найдено получателей с привязанным ВК: ${targetUsers.length}`);

    if (targetUsers.length > 0) {
      const eventDateStr = new Date(date).toLocaleString('ru-RU', {
        day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
      });

      const msg = `📢 ${eventType === 'REGIONAL' ? '🔥 РЕГИОНАЛЬНОЕ СОБЫТИЕ' : '⚡ СБОР ОТРЯДА'}!\n\n` +
                  `Название: ${title}\n` +
                  `📅 Дата: ${eventDateStr}\n` +
                  `📍 Место: ${location}\n\n` +
                  `${description ? `📝 Инфо: ${description}\n\n` : ''}` +
                  `Зайди в систему, чтобы посмотреть детали и подтвердить участие!`;

      const alertKeyboard = Keyboard.builder()
        .inline()
        .urlButton({
          label: 'Открыть календарь',
          url: 'https://xn--b1af2ahcd.xn--p1ai/profile'
        });

      for (const u of targetUsers) {
         await sendSystemAlert(u.vkId, msg, alertKeyboard);
         await new Promise(resolve => setTimeout(resolve, 50));
      }
      console.log(`[VK Bot] Рассылка успешно завершена!`);
    }

  } catch (error) {
    console.error("Ошибка при создании события:", error);
    // Отдаем ошибку только если еще не отправили успешный ответ фронту
    if (!res.headersSent) {
      res.status(500).json({ message: "Ошибка создания мероприятия" });
    }
  }
});

// ИСПРАВЛЕНО: Умная фильтрация ленты. Обычные бойцы видят только СВОЙ отряд + РЕГИОНАЛЬНЫЕ
// ИСПРАВЛЕННЫЙ РОУТ ЛЕНТЫ СОБЫТИЙ С ПОДГРУЗКОЙ УЧАСТНИКОВ
app.get('/api/events', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    let queryConditions = {};
    if (user.role !== 'REG_HQ') {
      queryConditions = {
        OR: [
          { type: 'REGIONAL' },
          { brigadeId: user.brigadeId || undefined }
        ]
      };
    }

    const events = await prisma.event.findMany({
      where: queryConditions,
      orderBy: { date: 'asc' },
      // НАШ ПАТЧ: Принудительно забираем участников и их ФИО для ведомости Мастера
      include: {
        participations: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } }
          }
        }
      }
    });

    const userParticipations = await prisma.eventParticipant.findMany({ where: { userId } });
    const joinedEventIds = userParticipations.map(p => p.eventId);
    const formattedEvents = events.map(event => ({ ...event, isJoined: joinedEventIds.includes(event.id) }));
    res.json(formattedEvents);
  } catch (error) { res.status(500).json({ message: "Ошибка загрузки ленты" }); }
});

app.get('/api/events/my-nearest', authMiddleware, async (req, res) => {
  try {
    const nearest = await prisma.eventParticipant.findFirst({
      where: { userId: req.user.userId, event: { date: { gte: new Date() } } },
      include: { event: true },
      orderBy: { event: { date: 'asc' } }
    });
    res.json(nearest ? nearest.event : null);
  } catch (e) { res.status(500).json(null); }
});

// ИСПРАВЛЕНО: Защита от записи на закрытые мероприятия чужих отрядов
app.post('/api/events/:id/join', authMiddleware, checkRole(['USER', 'CANDIDATE', 'BOETS', 'COMMANDER', 'COMMISSAR', 'MASTER', 'MEDIA', 'REG_HQ']), async (req, res) => {  try {
    const userId = req.user.userId;
    const eventId = req.params.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ message: "Мероприятие не найдено" });

    if (event.type === 'LOCAL' && event.brigadeId !== user.brigadeId && user.role !== 'REG_HQ') {
      return res.status(403).json({ message: "Доступ запрещен: это закрытое событие чужого ЛСО" });
    }

    await prisma.eventParticipant.create({ data: { userId, eventId } });
    res.json({ message: "Вы успешно записаны" });
  } catch (error) { res.status(500).json({ message: "Ошибка записи" }); }
});

// ИСПРАВЛЕНО: Теперь роут доступен также Мастеру и учитывает ID из тела запроса
app.patch('/api/events/attendance', authMiddleware, checkRole(['MASTER', 'COMMANDER', 'REG_HQ']), async (req, res) => {
  try {
    const { participantId, attended } = req.body;
    await prisma.eventParticipant.update({ 
      where: { id: participantId }, 
      data: { attended } 
    });
    res.json({ message: "Статус посещаемости успешно обновлен" });
  } catch (e) { res.status(500).json({ message: "Ошибка обновления статуса" }); }
});

// =============================================================================
// 🛡️ БЛОК 5: ПАНЕЛЬ КОМАНДИРА И ЛЕНТА ПОСТОВ
// =============================================================================

app.get('/api/commander/export-members', authMiddleware, checkRole(['COMMANDER', 'REG_HQ']), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.brigadeId) {
      return res.status(400).json({ message: "Отряд не найден" });
    }
    
    // Получаем всех бойцов отряда
    const members = await prisma.user.findMany({ 
      where: { brigadeId: user.brigadeId },
      orderBy: { role: 'desc' }
    });

    const brigade = await prisma.brigade.findUnique({ where: { id: user.brigadeId } });
    const brigadeName = brigade ? brigade.name : 'Отряд';

    // Создаем новую книгу Excel
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'СевРО РСО';
    const worksheet = workbook.addWorksheet('Состав отряда');

    // Настраиваем колонки
    worksheet.columns = [
      { header: '№', key: 'index', width: 5 },
      { header: 'Фамилия', key: 'lastName', width: 20 },
      { header: 'Имя', key: 'firstName', width: 20 },
      { header: 'Роль', key: 'role', width: 20 },
      { header: 'Email', key: 'email', width: 30 }
    ];

    // Стилизация заголовка
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0052FF' } };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Заполнение данными
    members.forEach((member, index) => {
      worksheet.addRow({
        index: index + 1,
        lastName: member.lastName || '',
        firstName: member.firstName || '',
        role: member.role || '',
        email: member.email || ''
      });
    });

    // Безопасное формирование имени файла
    // Убираем спецсимволы, чтобы не было ошибки ERR_INVALID_CHAR
    const cleanBrigadeName = brigadeName.replace(/[^a-zA-Z0-9а-яА-ЯёЁ ]/g, '').trim();
    const fileName = `Sostav_${cleanBrigadeName}.xlsx`;

    // Настраиваем HTTP-заголовки
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`);

    // Отправляем файл
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Ошибка выгрузки Excel:', error);
    res.status(500).json({ message: "Ошибка генерации отчета" });
  }
});
app.get('/api/commander/dashboard', authMiddleware, checkRole(['COMMANDER', 'REG_HQ']), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    const brigade = await prisma.brigade.findUnique({ where: { id: user.brigadeId } });
    const members = await prisma.user.findMany({ where: { brigadeId: user.brigadeId }, select: { id: true, firstName: true, lastName: true, role: true, email: true }, orderBy: { role: 'desc' } });
    const applications = await prisma.application.findMany({ where: { brigadeId: user.brigadeId, status: 'PENDING' }, include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } });
    res.json({ brigade, members, applications });
  } catch (error) { res.status(500).json({ message: "Ошибка" }); }
});

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        comments: { include: { author: { select: { firstName: true, avatarUrl: true } } }, orderBy: { createdAt: 'asc' } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
  } catch (error) { res.status(500).json({ message: "Ошибка" }); }
});

app.post('/api/posts', authMiddleware, checkRole(['COMMANDER', 'REG_HQ']), upload.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const imageUrl = req.file ? req.file.location : null;
    const post = await prisma.post.create({
      data: { title, content, imageUrl, authorId: req.user.userId },
      include: { author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } }
    });
    res.status(201).json(post);
  } catch (error) { res.status(500).json({ message: "Ошибка" }); }
});

app.post('/api/posts/:id/comment', authMiddleware, async (req, res) => {
  try {
    const comment = await prisma.comment.create({
      data: { content: req.body.content, authorId: req.user.userId, postId: req.params.id },
      include: { author: { select: { firstName: true, lastName: true, avatarUrl: true } } }
    });
    res.json(comment);
  } catch (e) { res.status(500).json({ message: "Ошибка" }); }
});

app.delete('/api/posts/:id', authMiddleware, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.id } });
    if (post.authorId !== req.user.userId && req.user.role !== 'REG_HQ') return res.status(403).json({ message: "Нет прав" });
    await prisma.post.delete({ where: { id: req.params.id } });
    res.json({ message: "Новость удалена" });
  } catch (e) { res.status(500).json({ message: "Ошибка" }); }
});

app.get('/api/brigades/:id', async (req, res) => {
  try {
    const brigade = await prisma.brigade.findUnique({
      where: { id: req.params.id },
      include: { users: { select: { id: true, firstName: true, lastName: true, role: true, avatarUrl: true }, orderBy: { role: 'desc' } } }
    });
    if (!brigade) return res.status(404).json({ message: "Отряд не найден" });
    res.json(brigade);
  } catch (error) { res.status(500).json({ message: "Ошибка" }); }
});

// Получение конкретной новости (для отдельной SEO-страницы)
app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        comments: { 
          include: { author: { select: { firstName: true, lastName: true, avatarUrl: true } } }, 
          orderBy: { createdAt: 'asc' } 
        }
      }
    });
    if (!post) return res.status(404).json({ message: "Новость не найдена" });
    res.json(post);
  } catch (error) { 
    res.status(500).json({ message: "Ошибка сервера при загрузке новости" }); 
  }
});

// ГЛОБАЛЬНЫЙ АНАЛИТИЧЕСКИЙ ЭНДПОИНТ: ПОДСЧЕТ РЕЙТИНГА И СТАТИСТИКИ ГОРОДА
app.get('/api/admin/rating-stats', authMiddleware, checkRole(['REG_HQ']), async (req, res) => {
  try {
    // 1. Выкачиваем все отряды вместе с их бойцами и наградами
    const brigades = await prisma.brigade.findMany({
      include: {
        users: true,
        achievements: true
      }
    });

    // 2. Запускаем цикл агрегации данных по каждому отряду
    const rankedBrigades = await Promise.all(brigades.map(async (brigade) => {
      const totalMembers = brigade.users.length;
      
      // Считаем баллы за прямые награды отряда
      const achievementPoints = brigade.achievements.reduce((sum, ach) => sum + ach.value, 0);

      // Ищем все отметки присутствия пользователей этого отряда
      const userIds = brigade.users.map(u => u.id);
      const attendedParticipations = await prisma.eventParticipant.findMany({
        where: {
          userId: { in: userIds },
          attended: true
        },
        include: { event: true }
      });

      let eventPoints = 0;
      let regionalAttendedCount = 0;

      // Раскладываем баллы согласно нашей утвержденной формуле
      attendedParticipations.forEach(p => {
        if (p.event.type === 'REGIONAL') {
          eventPoints += 10;
          regionalAttendedCount++;
        } else if (p.event.type === 'LOCAL') {
          eventPoints += 2;
        }
      });

      const totalPoints = achievementPoints + eventPoints;

      return {
        id: brigade.id,
        name: brigade.name,
        type: brigade.type,
        logoUrl: brigade.logoUrl,
        colorScheme: brigade.colorScheme,
        memberCount: totalMembers,
        totalPoints,
        regionalAttendedCount
      };
    }));

    // Сортируем отряды по убыванию общего количества баллов (Лидерборд)
    rankedBrigades.sort((a, b) => b.totalPoints - a.totalPoints);

    // Собираем глобальные системные метрики для верхних Bento-карточек
    const totalUsersCount = await prisma.user.count();
    const totalBrigadesCount = brigades.length;
    const leaderBrigade = rankedBrigades[0] ? rankedBrigades[0].name : 'Отряды отсутствуют';

    res.json({
      stats: {
        totalUsers: totalUsersCount,
        totalBrigades: totalBrigadesCount,
        leader: leaderBrigade
      },
      ranking: rankedBrigades
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера при калькуляции рейтинга штаба" });
  }
});

// =============================================================================
// 📊 БЛОК: ОТЧЕТЫ МАСТЕРА И КОМИССАРА
// =============================================================================

// 1. ОТЧЕТ МАСТЕРА (Посещаемость бойцов отряда)
app.get('/api/master/export-attendance', authMiddleware, checkRole(['MASTER', 'REG_HQ']), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.brigadeId) return res.status(400).json({ message: "Отряд не найден" });

    const brigade = await prisma.brigade.findUnique({ where: { id: user.brigadeId } });

    // Достаем всех бойцов отряда вместе с их записями на мероприятия
    const members = await prisma.user.findMany({
      where: { brigadeId: user.brigadeId },
      include: {
        participations: {
          include: { event: true }
        }
      },
      orderBy: { role: 'desc' }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Посещаемость');

    worksheet.columns = [
      { header: '№', key: 'index', width: 5 },
      { header: 'ФИО бойца', key: 'name', width: 30 },
      { header: 'Роль', key: 'role', width: 15 },
      { header: 'Записан (шт)', key: 'total', width: 15 },
      { header: 'Посетил (шт)', key: 'attended', width: 15 },
      { header: 'Пропустил (шт)', key: 'missed', width: 15 },
      { header: '% Посещаемости', key: 'percent', width: 18 }
    ];

    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF66BB8A' } }; // Зеленый акцент
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    members.forEach((m, idx) => {
      const total = m.participations.length;
      const attended = m.participations.filter(p => p.attended).length;
      const missed = total - attended;
      const percent = total > 0 ? Math.round((attended / total) * 100) + '%' : '0%';

      worksheet.addRow({
        index: idx + 1,
        name: `${m.lastName || ''} ${m.firstName || ''}`.trim(),
        role: m.role,
        total,
        attended,
        missed,
        percent
      });
    });

    const cleanBrigadeName = brigade.name.replace(/[^a-zA-Z0-9а-яА-ЯёЁ ]/g, '').trim();
    const fileName = `Attendance_${cleanBrigadeName}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Ошибка выгрузки Мастера:', error);
    res.status(500).json({ message: "Ошибка генерации отчета" });
  }
});

// 2. ОТЧЕТ КОМИССАРА (Мероприятия за квартал)
app.get('/api/commissar/export-events', authMiddleware, checkRole(['COMMISSAR', 'REG_HQ']), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.brigadeId) return res.status(400).json({ message: "Отряд не найден" });

    const brigade = await prisma.brigade.findUnique({ where: { id: user.brigadeId } });

    // Вычисляем дату ровно 3 месяца назад
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // Достаем все мероприятия за последние 3 месяца
    const events = await prisma.event.findMany({
      where: {
        date: { gte: threeMonthsAgo }
      },
      include: {
        participations: {
          include: { user: true }
        }
      },
      orderBy: { date: 'desc' }
    });

    // Фильтруем только те мероприятия, где БЫЛ хотя бы один боец этого отряда
    const brigadeEvents = events.map(e => {
      // Считаем только тех, кто реально пришел (attended: true)
      const brigadeParticipants = e.participations.filter(p => p.user.brigadeId === user.brigadeId && p.attended);
      return {
        ...e,
        brigadeParticipantsCount: brigadeParticipants.length
      };
    }).filter(e => e.brigadeParticipantsCount > 0);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Квартальный отчет');

    worksheet.columns = [
      { header: '№', key: 'index', width: 5 },
      { header: 'Дата', key: 'date', width: 15 },
      { header: 'Уровень', key: 'type', width: 15 },
      { header: 'Мероприятие', key: 'title', width: 30 },
      { header: 'Бойцов от ЛСО', key: 'count', width: 15 },
      { header: 'Описание деятельности', key: 'description', width: 60 }
    ];

    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF4D39' } }; // Оранжевый акцент
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    brigadeEvents.forEach((e, idx) => {
      worksheet.addRow({
        index: idx + 1,
        date: new Date(e.date).toLocaleDateString('ru-RU'),
        type: e.type === 'REGIONAL' ? 'Региональное' : 'Локальное',
        title: e.title,
        count: e.brigadeParticipantsCount,
        description: e.description || 'Нет описания'
      });
    });

    const cleanBrigadeName = brigade.name.replace(/[^a-zA-Z0-9а-яА-ЯёЁ ]/g, '').trim();
    const fileName = `Events_Quarter_${cleanBrigadeName}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Ошибка выгрузки Комиссара:', error);
    res.status(500).json({ message: "Ошибка генерации отчета" });
  }
});


// ==========================================
// GOOGLE OAUTH: Инициация входа / Привязки
// ==========================================
app.get('/api/auth/google', (req, res) => {
  const { link_token } = req.query; // Ловим токен привязки от фронтенда
  const redirectUri = `${DOMAIN_URL}/api/auth/google/callback`;
  
  // Упаковываем link_token в OAuth параметр state
  const stateObj = { link_token: link_token || null };
  const stateString = Buffer.from(JSON.stringify(stateObj)).toString('base64');
  
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email%20profile&state=${stateString}`;
  
  res.redirect(googleAuthUrl);
});

// ==========================================
// GOOGLE OAUTH: Callback
// ==========================================
app.get('/api/auth/google/callback', async (req, res) => {
  const { code, state } = req.query;
  const redirectUri = `${DOMAIN_URL}/api/auth/google/callback`;

  if (!code) {
    return res.redirect(`${DOMAIN_URL}/login?error=no_code`);
  }

  try {
    // Распаковываем state и извлекаем токен привязки
    let link_token = null;
    if (state) {
      try {
        const decodedState = JSON.parse(Buffer.from(state, 'base64').toString('utf8'));
        link_token = decodedState.link_token;
      } catch (e) {
        console.error("Ошибка парсинга state Google:", e);
      }
    }

    // Обмениваем code на access_token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    });

    const { access_token } = tokenResponse.data;

    // Запрашиваем данные профиля
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${access_token}` }
    });
    
    const { id: googleId, email, given_name, family_name, picture } = userResponse.data;
    const googleIdStr = String(googleId);

    if (!googleId) {
        return res.redirect(`${DOMAIN_URL}/login?error=no_google_id`);
    }

    // ==========================================
    // СЦЕНАРИЙ А: ПРИВЯЗКА К СУЩЕСТВУЮЩЕМУ АККАУНТУ
    // ==========================================
    if (link_token) {
      try {
        const decoded = jwt.verify(link_token, process.env.JWT_SECRET);
        
        // Проверяем, не занят ли этот Google аккаунт кем-то другим
        const existingGoogleUser = await prisma.user.findUnique({ where: { googleId: googleIdStr } });
        if (existingGoogleUser && existingGoogleUser.id !== decoded.userId) {
          return res.redirect(`${DOMAIN_URL}/profile?error=google_already_taken`);
        }

        // Привязываем ТОЛЬКО googleId (личные данные профиля НЕ МЕНЯЮТСЯ)
        await prisma.user.update({
          where: { id: decoded.userId },
          data: { googleId: googleIdStr }
        });

        return res.redirect(`${DOMAIN_URL}/profile?success=google_linked`);
      } catch (err) {
        return res.redirect(`${DOMAIN_URL}/profile?error=link_failed`);
      }
    }

    // ==========================================
    // СЦЕНАРИЙ Б: ОБЫЧНАЯ АВТОРИЗАЦИЯ / РЕГИСТРАЦИЯ
    // ==========================================
    let user = await prisma.user.findUnique({ where: { googleId: googleIdStr } });

    if (!user) {
      if (email) {
        user = await prisma.user.findUnique({ where: { email } });
      }

      if (user) {
        // Если нашли по почте, просто связываем аккаунты
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId: googleIdStr }
        });
      } else {
        // Если юзера нет — регистрируем с нуля
        user = await prisma.user.create({
          data: {
            googleId: googleIdStr,
            email,
            firstName: given_name || 'Боец',
            lastName: family_name || 'РСО',
            avatarUrl: picture,
          }
        });
      }
    }

    const sysToken = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`${DOMAIN_URL}/login?token=${sysToken}`);

  } catch (error) {
    console.error('Ошибка Google OAuth:', error.response?.data || error.message);
    res.redirect(`${DOMAIN_URL}/login?error=auth_failed`);
  }
});

// ==========================================
// YANDEX OAUTH: Инициация входа / Привязки
// ==========================================
app.get('/api/auth/yandex', (req, res) => {
  const { link_token } = req.query;
  const redirectUri = `${DOMAIN_URL}/api/auth/yandex/callback`;
  
  // Упаковываем link_token в параметр state
  const stateObj = { link_token: link_token || null };
  const stateString = Buffer.from(JSON.stringify(stateObj)).toString('base64');
  
  const yandexAuthUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${process.env.YANDEX_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${stateString}`;
  
  res.redirect(yandexAuthUrl);
});

// ==========================================
// YANDEX OAUTH: Callback
// ==========================================
app.get('/api/auth/yandex/callback', async (req, res) => {
  const { code, state } = req.query;
  const redirectUri = `${DOMAIN_URL}/api/auth/yandex/callback`;

  if (!code) {
    return res.redirect(`${DOMAIN_URL}/login?error=no_code`);
  }

  try {
    // Извлекаем токен из state
    let link_token = null;
    if (state) {
      try {
        const decodedState = JSON.parse(Buffer.from(state, 'base64').toString('utf8'));
        link_token = decodedState.link_token;
      } catch (e) {
        console.error("Ошибка парсинга state Yandex:", e);
      }
    }

    // Обмениваем code на access_token
    const tokenResponse = await axios.post('https://oauth.yandex.ru/token', 
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.YANDEX_CLIENT_ID,
        client_secret: process.env.YANDEX_CLIENT_SECRET,
        redirect_uri: redirectUri
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token } = tokenResponse.data;

    // Запрашиваем данные профиля Яндекс
    const userResponse = await axios.get('https://login.yandex.ru/info', {
      headers: { Authorization: `OAuth ${access_token}` }
    });

    const { id: yandexId, default_email: email, first_name, last_name, default_avatar_id } = userResponse.data;
    const yandexIdStr = String(yandexId);
    const avatarUrl = default_avatar_id ? `https://avatars.yandex.net/get-yapic/${default_avatar_id}/islands-200` : null;

    // ==========================================
    // СЦЕНАРИЙ А: ПРИВЯЗКА К СУЩЕСТВУЮЩЕМУ АККАУНТУ
    // ==========================================
    if (link_token) {
      try {
        const decoded = jwt.verify(link_token, process.env.JWT_SECRET);
        
        const existingYandexUser = await prisma.user.findUnique({ where: { yandexId: yandexIdStr } });
        if (existingYandexUser && existingYandexUser.id !== decoded.userId) {
          return res.redirect(`${DOMAIN_URL}/profile?error=yandex_already_taken`);
        }

        // Привязываем ТОЛЬКО yandexId (данные профиля НЕ меняются)
        await prisma.user.update({
          where: { id: decoded.userId },
          data: { yandexId: yandexIdStr }
        });

        return res.redirect(`${DOMAIN_URL}/profile?success=yandex_linked`);
      } catch (err) {
        return res.redirect(`${DOMAIN_URL}/profile?error=link_failed`);
      }
    }

    // ==========================================
    // СЦЕНАРИЙ Б: ОБЫЧНАЯ АВТОРИЗАЦИЯ / РЕГИСТРАЦИЯ
    // ==========================================
    let user = await prisma.user.findUnique({ where: { yandexId: yandexIdStr } });

    if (!user) {
      if (email) {
        user = await prisma.user.findUnique({ where: { email } });
      }

      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { yandexId: yandexIdStr }
        });
      } else {
        user = await prisma.user.create({
          data: {
            yandexId: yandexIdStr,
            email,
            firstName: first_name || 'Боец',
            lastName: last_name || 'РСО',
            avatarUrl: avatarUrl,
          }
        });
      }
    }

    const sysToken = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`${DOMAIN_URL}/login?token=${sysToken}`);

  } catch (error) {
    console.error('Ошибка Yandex OAuth:', error.response?.data || error.message);
    res.redirect(`${DOMAIN_URL}/login?error=auth_failed`);
  }
});


// ==========================================
// VK ID OAUTH 2.1: Инициация входа / Привязки
// ==========================================
app.get('/api/auth/vk', (req, res) => {
  const { link_token } = req.query; // Ловим токен привязки
  const vkClientId = '54608627'; 
  const vkRedirectUri = 'https://xn--b1af2ahcd.xn--p1ai/api/auth/vk/callback';

  const codeVerifier = base64URLEncode(crypto.randomBytes(32));
  const codeChallenge = base64URLEncode(crypto.createHash('sha256').update(codeVerifier).digest());
  const state = crypto.randomBytes(16).toString('hex');

  // Упаковываем верификаторы и link_token во временную сессионную куку куку vk_auth
  const cookieData = JSON.stringify({ codeVerifier, state, link_token: link_token || null });
  res.setHeader('Set-Cookie', `vk_auth=${encodeURIComponent(cookieData)}; Path=/; HttpOnly; Max-Age=300; SameSite=Lax`);

  const authUrl = new URL('https://id.vk.ru/authorize');
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('client_id', vkClientId);
  authUrl.searchParams.append('redirect_uri', vkRedirectUri);
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('code_challenge', codeChallenge);
  authUrl.searchParams.append('code_challenge_method', 's256');
  authUrl.searchParams.append('scope', 'vkid.personal_info'); 

  res.redirect(authUrl.toString());
});

// ==========================================
// VK ID OAUTH 2.1: Callback
// ==========================================
app.get('/api/auth/vk/callback', async (req, res) => {
  const { code, state, device_id } = req.query; 

  const vkRedirectUri = 'https://xn--b1af2ahcd.xn--p1ai/api/auth/vk/callback';
  const vkClientId = '54608627';
  const vkClientSecret = '9fYVPkQyX5IGZ0IIR2R5'; 

  if (!code) return res.redirect(`${DOMAIN_URL}/login?error=no_code`);

  const cookies = parseCookies(req);
  if (!cookies.vk_auth) return res.redirect(`${DOMAIN_URL}/login?error=session_expired`);

  let sessionData;
  try {
    sessionData = JSON.parse(decodeURIComponent(cookies.vk_auth));
  } catch (e) {
    return res.redirect(`${DOMAIN_URL}/login?error=session_invalid`);
  }

  if (state !== sessionData.state) return res.redirect(`${DOMAIN_URL}/login?error=invalid_state`);

  try {
    // Запрашиваем токен у ВК
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: vkClientId,
      client_secret: vkClientSecret,
      code: code,
      code_verifier: sessionData.codeVerifier,
      redirect_uri: vkRedirectUri,
      device_id: device_id
    });

    const tokenResponse = await axios.post('https://id.vk.ru/oauth2/auth', tokenParams.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const finalToken = tokenResponse.data.access_token || tokenResponse.data.id_token;
    if (!finalToken) return res.redirect(`${DOMAIN_URL}/login?error=no_token_received`);

    // Запрашиваем информацию профиля
    const userResponse = await axios.post('https://id.vk.ru/oauth2/user_info', 
      new URLSearchParams({
        client_id: vkClientId,
        access_token: finalToken
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const vkUser = userResponse.data.user || userResponse.data;
    const vkIdString = String(vkUser.id || vkUser.user_id || 'unknown');
    const email = vkUser.email || null;

    // ==========================================
    // СЦЕНАРИЙ А: ПРИВЯЗКА К СУЩЕСТВУЮЩЕМУ АККАУНТУ
    // ==========================================
    if (sessionData.link_token) {
      try {
        const decoded = jwt.verify(sessionData.link_token, process.env.JWT_SECRET);
        
        // Проверяем, не привязан ли этот ВК к кому-то другому
        const existingVkUser = await prisma.user.findUnique({ where: { vkId: vkIdString } });
        if (existingVkUser && existingVkUser.id !== decoded.userId) {
          return res.redirect(`${DOMAIN_URL}/profile?error=vk_already_taken`);
        }

        // Привязываем ТОЛЬКО vkId (личные данные профиля НЕ МЕНЯЮТСЯ)
        await prisma.user.update({
          where: { id: decoded.userId },
          data: { vkId: vkIdString }
        });

        res.setHeader('Set-Cookie', `vk_auth=; Path=/; HttpOnly; Max-Age=0`);
        return res.redirect(`${DOMAIN_URL}/profile?success=vk_linked`);
      } catch (err) {
        return res.redirect(`${DOMAIN_URL}/profile?error=link_failed`);
      }
    }

    // ==========================================
    // СЦЕНАРИЙ Б: ОБЫЧНАЯ АВТОРИЗАЦИЯ / РЕГИСТРАЦИЯ
    // ==========================================
    let user = await prisma.user.findUnique({ where: { vkId: vkIdString } });
    if (!user && email) user = await prisma.user.findUnique({ where: { email } });

    if (user) {
        user = await prisma.user.update({ where: { id: user.id }, data: { vkId: vkIdString } });
    } else {
        user = await prisma.user.create({
            data: {
                vkId: vkIdString,
                email: email || `vk_${vkIdString}@sevro.ru`,
                firstName: vkUser.first_name || 'Боец',
                lastName: vkUser.last_name || 'РСО'
            }
        });
    }

    const sysToken = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.setHeader('Set-Cookie', `vk_auth=; Path=/; HttpOnly; Max-Age=0`);
    res.redirect(`${DOMAIN_URL}/login?token=${sysToken}`);

  } catch (error) {
    console.error('Ошибка VK:', error.response?.data || error.message);
    res.redirect(`${DOMAIN_URL}/login?error=auth_failed`);
  }
});

// =============================================================================
// 📸 БЛОК: ГАЛЕРЕЯ И S3
// =============================================================================

// Получить все альбомы
app.get('/api/albums', async (req, res) => {
  try {
    const albums = await prisma.album.findMany({
      include: {
        _count: { select: { photos: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки альбомов' });
  }
});

// Создать новый альбом (Только для Комсостава, Медиа и Штаба)
app.post('/api/albums', authMiddleware, checkRole(['COMMANDER', 'COMMISSAR', 'MEDIA', 'REG_HQ']), upload.single('cover'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const coverUrl = req.file ? req.file.location : null;

    const album = await prisma.album.create({
      data: { title, description, coverUrl }
    });
    res.status(201).json(album);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка создания альбома' });
  }
});

// Получить конкретный альбом с фотографиями
app.get('/api/albums/:id', async (req, res) => {
  try {
    const album = await prisma.album.findUnique({
      where: { id: req.params.id },
      include: {
        photos: {
          include: { uploader: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    if (!album) return res.status(404).json({ message: 'Альбом не найден' });
    res.json(album);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки альбома' });
  }
});

// Загрузить пачку фото в альбом (до 10 штук за раз)
app.post('/api/albums/:id/photos', authMiddleware, upload.array('photos', 10), async (req, res) => {
  try {
    const albumId = req.params.id;
    const uploaderId = req.user.userId;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Файлы не найдены' });
    }

    // Сохраняем ссылки на загруженные в S3 файлы в БД
    const photoPromises = req.files.map(file => 
      prisma.photo.create({
        data: {
          url: file.location,
          albumId,
          uploaderId
        }
      })
    );

    await Promise.all(photoPromises);
    res.json({ message: 'Фотографии успешно загружены' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка загрузки фотографий' });
  }
});

// ==========================================
// ГЕНЕРАТОР ДОКУМЕНТОВ (БАЗА ЗНАНИЙ)
// ==========================================
app.get('/api/documents/generate/:type', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const documentType = req.params.type; // В нашем случае придет 'statement'

    // 1. Получаем профиль бойца и его отряд (если есть)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { brigade: true }
    });

    if (!user) return res.status(404).json({ message: "Пользователь не найден" });

    // 2. Ищем шаблон на сервере
    const templatePath = path.resolve(__dirname, 'templates', `${documentType}.docx`);
    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({ message: "Шаблон документа не найден" });
    }

    // 3. Читаем .docx архив
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // 4. Подставляем реальные данные вместо тегов
    doc.render({
      firstName: user.firstName || 'Имя',
      lastName: user.lastName || 'Фамилия',
      brigadeName: user.brigade ? `«${user.brigade.name}»` : '_________________',
      date: new Date().toLocaleDateString('ru-RU')
    });

    // 5. Генерируем финальный файл в памяти
    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    // 6. Отдаем файл клиенту на скачивание (исправляем кодировку для кириллицы)
    const fileName = encodeURIComponent(`Заявление_${user.lastName}.docx`);
    
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${fileName}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buf);

  } catch (error) {
    console.error("Ошибка при генерации документа:", error);
    res.status(500).json({ message: 'Ошибка генерации документа' });
  }
});

// ==========================================
// ГЕНЕРАТОР ДОКУМЕНТОВ (БАЗА ЗНАНИЙ)
// ==========================================
app.post('/api/documents/generate/statement', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    // Ловим данные из модального окна фронтенда
    const formData = req.body; 

    // 1. Получаем профиль бойца и его отряд из БД
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { brigade: true }
    });

    if (!user) return res.status(404).json({ message: "Пользователь не найден" });

    // 2. Ищем шаблон на сервере
    const templatePath = path.resolve(__dirname, 'templates', 'statement.docx');
    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({ message: "Шаблон документа не найден" });
    }

    // 3. Читаем архив
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // 4. Подставляем реальные данные (Микс из БД и Формы)
    doc.render({
      // Из базы:
      lastName: user.lastName || '',
      firstName: user.firstName || '',
      email: user.email || '',
      phone: formData.phone || '', // Телефон может быть в форме
      vkUrl: user.vkUrl || '',
      brigadeName: user.brigade ? user.brigade.name : '_________________',
      
      // Из формы модального окна:
      birthDate: formData.birthDate || '',
      studyPlace: formData.studyPlace || '',
      address: formData.address || '',
      citizenship: formData.citizenship || '',
      passportSeries: formData.passportSeries || '',
      passportNumber: formData.passportNumber || '',
      passportCode: formData.passportCode || '',
      passportIssueDate: formData.passportIssueDate || '',
      passportIssuedBy: formData.passportIssuedBy || '',
      inn: formData.inn || '',
      snils: formData.snils || '',
      currentDate: new Date().toLocaleDateString('ru-RU')
    });

    // 5. Генерируем финальный буфер
    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    // 6. Отправляем файл
    const fileName = encodeURIComponent(`Заявление_${user.lastName}.docx`);
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${fileName}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buf);

  } catch (error) {
    console.error("Ошибка при генерации документа:", error);
    res.status(500).json({ message: 'Ошибка генерации документа' });
  }
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const DOMAIN = 'https://xn--b1af2ahcd.xn--p1ai';
    
    // Получаем динамические данные
    const posts = await prisma.post.findMany({ select: { id: true, createdAt: true } });
    const brigades = await prisma.brigade.findMany({ select: { id: true, createdAt: true } });

    // Статичные страницы
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${DOMAIN}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${DOMAIN}/news</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${DOMAIN}/brigades</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${DOMAIN}/documents</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

    // Добавляем новости
    posts.forEach(post => {
      xml += `
  <url>
    <loc>${DOMAIN}/news/${post.id}</loc>
    <lastmod>${post.createdAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // Добавляем отряды
    brigades.forEach(brigade => {
      xml += `
  <url>
    <loc>${DOMAIN}/brigades/${brigade.id}</loc>
    <lastmod>${brigade.createdAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    xml += '\n</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Ошибка генерации sitemap:', error);
    res.status(500).end();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер на порту ${PORT}`));