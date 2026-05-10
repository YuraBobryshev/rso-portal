const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt'); 
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// --- ВСПОМОГАТЕЛЬНЫЙ MIDDLEWARE ДЛЯ ПРОВЕРКИ РОЛЕЙ ---
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

// =============================================================================
// 🔐 БЛОК 1: АВТОРИЗАЦИЯ И ПРОФИЛЬ
// =============================================================================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email уже занят' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName }
    });

    res.status(201).json({ message: 'Успешно!', user: { id: user.id, email, firstName, lastName, role: user.role } });
  } catch (error) { res.status(500).json({ message: 'Ошибка сервера' }); }
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
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true, brigade: true, vkUrl: true, tgUrl: true }
  });
  res.json(user);
});

// Роут для обновления ссылок профиля (ВК и ТГ)
app.patch('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    const { vkUrl, tgUrl } = req.body;
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { 
        vkUrl: vkUrl || "", 
        tgUrl: tgUrl || "" 
      }
    });
    res.json({ message: "Успешно" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// =============================================================================
// ⚙️ БЛОК 2: АДМИНИСТРИРОВАНИЕ (Только для REG_HQ)
// =============================================================================

// Список всех пользователей для админки
app.get('/api/admin/users', authMiddleware, checkRole(['REG_HQ']), async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, firstName: true, lastName: true, role: true, brigadeId: true }
  });
  res.json(users);
});

// Смена роли бойца
app.patch('/api/admin/update-role', authMiddleware, checkRole(['REG_HQ']), async (req, res) => {
  const { userId, newRole } = req.body;
  await prisma.user.update({ where: { id: userId }, data: { role: newRole } });
  res.json({ message: 'Роль обновлена' });
});

// Создание нового отряда (ЛСО)
app.post('/api/admin/create-brigade', authMiddleware, checkRole(['REG_HQ']), async (req, res) => {
  const { name, description } = req.body;
  const brigade = await prisma.brigade.create({ data: { name, description } });
  res.json({ message: 'Отряд создан', brigade });
});

// Прямое распределение бойца в отряд
app.patch('/api/admin/update-user-brigade', authMiddleware, checkRole(['REG_HQ']), async (req, res) => {
  const { userId, brigadeId } = req.body;
  await prisma.user.update({
    where: { id: userId },
    data: { brigadeId: brigadeId === 'none' ? null : brigadeId }
  });
  res.json({ message: 'Боец распределен' });
});

// --- ДОПОЛНЕНИЯ В БЛОК 2: АДМИНИСТРИРОВАНИЕ ---

// Удаление пользователя (полная терминация)
app.delete('/api/admin/users/:id', authMiddleware, checkRole(['REG_HQ']), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Защита: нельзя удалить самого себя
    if (id === req.user.userId) {
      return res.status(400).json({ message: "Самоликвидация запрещена" });
    }

    await prisma.user.delete({ where: { id } });
    res.json({ message: "Объект успешно удален из системы" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при удалении" });
  }
});

// Отмена участия в мероприятии
app.delete('/api/events/:id/leave', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params; // Получаем ID мероприятия из URL
    const userId = req.user.userId; // Получаем ID пользователя из токена

    // Удаляем талон участника из базы
    await prisma.eventParticipant.deleteMany({
      where: {
        userId: userId,
        eventId: id
      }
    });

    res.json({ message: "Участие успешно отменено" });
  } catch (error) {
    console.error("Ошибка при выходе из мероприятия:", error);
    res.status(500).json({ message: "Ошибка сервера при удалении записи" });
  }
});

// Обновление отряда (уже был, но проверим/обновим логику)
app.patch('/api/admin/update-user-brigade', authMiddleware, checkRole(['REG_HQ']), async (req, res) => {
  try {
    const { userId, brigadeId } = req.body;
    await prisma.user.update({
      where: { id: userId },
      data: { brigadeId: brigadeId === 'none' ? null : brigadeId }
    });
    res.json({ message: "Дислокация изменена" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка распределения" });
  }
});

// Получение всех мероприятий для админки со списком участников (Бронебойный вариант)
app.get('/api/admin/events', authMiddleware, checkRole(['REG_HQ']), async (req, res) => {
  try {
    // 1. Берем все мероприятия
    const events = await prisma.event.findMany({
      orderBy: { date: 'desc' }
    });

    // 2. Берем все записи об участии (талоны)
    const allParticipants = await prisma.eventParticipant.findMany();

    // 3. Берем всех пользователей (чтобы знать их имена)
    const users = await prisma.user.findMany({
      select: { id: true, firstName: true, lastName: true, brigadeId: true }
    });

    // 4. Берем все отряды (чтобы знать их названия)
    const brigades = await prisma.brigade.findMany();

    // 5. Вручную склеиваем данные, как конструктор
    const formattedEvents = events.map(event => {
      // Ищем, кто записался именно на это мероприятие
      const eventParts = allParticipants.filter(p => p.eventId === event.id);

      // Обогащаем записи именами и названиями отрядов
      const enrichedParticipants = eventParts.map(ep => {
        const user = users.find(u => u.id === ep.userId) || {};
        const brigade = brigades.find(b => b.id === user.brigadeId) || null;

        return {
          id: ep.id,
          user: {
            id: user.id || 'unknown',
            firstName: user.firstName || 'Удаленный',
            lastName: user.lastName || 'Пользователь',
            brigade: brigade
          }
        };
      });

      return {
        ...event,
        participants: enrichedParticipants
      };
    });

    res.json(formattedEvents);
  } catch (error) {
    console.error("ОШИБКА ЗАГРУЗКИ АДМИНКИ МЕРОПРИЯТИЙ:", error);
    res.status(500).json({ message: "Ошибка сервера при загрузке мероприятий" });
  }
});

// =============================================================================
// 🤝 БЛОК 3: ОТРЯДЫ И ЗАЯВКИ
// =============================================================================

app.get('/api/brigades', async (req, res) => {
  const brigades = await prisma.brigade.findMany();
  res.json(brigades);
});

app.post('/api/applications/apply', authMiddleware, async (req, res) => {
  const { brigadeId } = req.body;
  const userId = req.user.userId;
  
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user.brigadeId) return res.status(400).json({ message: 'Вы уже в отряде' });

  await prisma.application.create({ data: { userId, brigadeId } });
  res.json({ message: 'Заявка отправлена' });
});

// Обработка заявок Командиром
app.post('/api/commander/process-application', authMiddleware, checkRole(['COMMANDER']), async (req, res) => {
  const { appId, status, comment } = req.body;
  const application = await prisma.application.update({ where: { id: appId }, data: { status, comment } });
  
  if (status === 'APPROVED') {
    await prisma.user.update({
      where: { id: application.userId },
      data: { role: 'CANDIDATE', brigadeId: application.brigadeId }
    });
  }
  res.json({ message: 'Заявка обработана' });
});

// =============================================================================
// 📅 БЛОК 4: МЕРОПРИЯТИЯ И ПОСЕЩАЕМОСТЬ
// =============================================================================

// Создание мероприятия
// Создание мероприятия
app.post('/api/events', authMiddleware, checkRole(['COMMANDER', 'COMMISSAR', 'REG_HQ']), async (req, res) => {
  console.log("=== ПОПЫТКА СОЗДАНИЯ МЕРОПРИЯТИЯ ===");
  console.log("Полученные данные:", req.body);
  
  try {
    const { title, description, date, type } = req.body;
    
    // Получаем юзера, чтобы знать его отряд (если мероприятие отрядное)
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });

    const event = await prisma.event.create({
      data: { 
        title: title, 
        description: description || "Описание не указано", 
        date: new Date(date), 
        type: type || "REGIONAL", 
        brigadeId: type === 'REGIONAL' ? null : user.brigadeId 
      }
    });
    
    console.log("Успешно сохранено:", event.title);
    res.status(201).json(event);
  } catch (error) {
    console.error("КРИТИЧЕСКАЯ ОШИБКА PRISMA:", error);
    res.status(500).json({ message: "Ошибка сохранения в базу данных" });
  }
});

// 1. УМНЫЙ СПИСОК (Бронебойный вариант без include)
app.get('/api/events', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    // Получаем сами мероприятия
    const events = await prisma.event.findMany({
      where: {
        OR: [{ brigadeId: user.brigadeId || undefined }, { type: 'REGIONAL' }]
      },
      orderBy: { date: 'asc' }
    });

    // Отдельно получаем список ID мероприятий, на которые записан юзер
    const userParticipations = await prisma.eventParticipant.findMany({
      where: { userId: userId }
    });
    
    // Создаем массив ID для быстрой проверки
    const joinedEventIds = userParticipations.map(p => p.eventId);

    // Склеиваем данные для фронтенда
    const formattedEvents = events.map(event => ({
      ...event,
      isJoined: joinedEventIds.includes(event.id)
    }));

    res.json(formattedEvents);
  } catch (error) { 
    console.error("ОШИБКА ЗАГРУЗКИ МЕРОПРИЯТИЙ:", error);
    res.status(500).json({ message: "Ошибка загрузки мероприятий" }); 
  }
});

// 2. НАПОМИНАНИЕ ДЛЯ ПРОФИЛЯ (Ближайшее мероприятие)
app.get('/api/events/my-nearest', authMiddleware, async (req, res) => {
  try {
    const nearest = await prisma.eventParticipant.findFirst({
      where: { 
        userId: req.user.userId,
        event: { date: { gte: new Date() } } // Только будущие
      },
      include: { event: true },
      orderBy: { event: { date: 'asc' } }
    });
    res.json(nearest ? nearest.event : null);
  } catch (e) { res.status(500).json(null); }
});

// Запись на мероприятие
app.post('/api/events/:id/join', authMiddleware, async (req, res) => {
  try {
    await prisma.eventParticipant.create({ data: { userId: req.user.userId, eventId: req.params.id } });
    res.json({ message: "Вы записаны" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка записи" });
  }
});

// Отметка посещаемости командиром
app.patch('/api/events/attendance', authMiddleware, checkRole(['MASTER', 'COMMANDER']), async (req, res) => {
  await prisma.eventParticipant.update({
    where: { id: req.body.participantId },
    data: { attended: req.body.attended }
  });
  res.json({ message: "Статус обновлен" });
});

// =============================================================================
// 🛡️ БЛОК 5: ПАНЕЛЬ КОМАНДИРА (Управление отрядом)
// =============================================================================

// Получение дашборда командира (состав + заявки)
app.get('/api/commander/dashboard', authMiddleware, checkRole(['COMMANDER']), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user.brigadeId) return res.status(400).json({ message: "Вы не привязаны к отряду" });

    const brigade = await prisma.brigade.findUnique({ where: { id: user.brigadeId } });
    
    // Получаем всех бойцов этого отряда
    const members = await prisma.user.findMany({
      where: { brigadeId: user.brigadeId },
      select: { id: true, firstName: true, lastName: true, role: true, email: true },
      orderBy: { role: 'desc' }
    });

    // Получаем заявки, которые ждут ответа (PENDING)
    const applications = await prisma.application.findMany({
      where: { brigadeId: user.brigadeId, status: 'PENDING' },
      include: { 
        user: { select: { id: true, firstName: true, lastName: true, email: true } } 
      }
    });

    res.json({ brigade, members, applications });
  } catch (error) {
    console.error("Ошибка загрузки панели командира:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// =============================================================================
// 🚀 ЗАПУСК
// =============================================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер на порту ${PORT}`));