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

app.use(cors());
app.use(express.json());

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
        // СВЕЖИЙ ПАТЧ: Подтягиваем последнюю поданную заявку юзера
        applications: {
          include: { brigade: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера при получении профиля" });
  }
});

app.patch('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    const { vkUrl, tgUrl } = req.body;
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { vkUrl: vkUrl || "", tgUrl: tgUrl || "" }
    });
    res.json({ message: "Успешно" });
  } catch (error) { res.status(500).json({ message: "Ошибка сервера" }); }
});

app.post('/api/auth/upload-avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Файл не получен" });
    const imageUrl = req.file.location;
    await prisma.user.update({ where: { id: req.user.userId }, data: { avatarUrl: imageUrl } });
    res.json({ message: "Avatar updated", avatarUrl: imageUrl });
  } catch (error) { res.status(500).json({ message: "Ошибка загрузки" }); }
});

// =============================================================================
// ⚙️ БЛОК 2: АДМИНИСТРИРОВАНИЕ
// =============================================================================

app.get('/api/admin/users', authMiddleware, checkRole(['REG_HQ']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { 
        id: true, 
        email: true, 
        firstName: true, 
        lastName: true, 
        role: true, 
        brigadeId: true, 
        avatarUrl: true,
        brigade: { select: { name: true } } 
      }
    });
    res.json(users);
  } catch (e) { res.status(500).json({ message: "Ошибка" }); }
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

// ИСПРАВЛЕНО: Добавлена антиспам защита (блокировка дублирования активных заявок)
app.post('/api/applications/apply', authMiddleware, async (req, res) => {
  try {
    const { brigadeId } = req.body;
    const userId = req.user.userId;
    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user.brigadeId) return res.status(400).json({ message: 'Вы уже состоите в отряде' });

    const existingPending = await prisma.application.findFirst({
      where: { userId, status: 'PENDING' }
    });
    if (existingPending) {
      return res.status(400).json({ message: 'У вас уже есть активная заявка на рассмотрении' });
    }

    await prisma.application.create({ data: { userId, brigadeId } });
    res.json({ message: 'Заявка успешно отправлена' });
  } catch (e) { res.status(500).json({ message: 'Ошибка сервера' }); }
});

// ИСПРАВЛЕНО: Теперь сохраняет текстовый комментарий/причину отказа в базу данных
app.post('/api/commander/process-application', authMiddleware, checkRole(['COMMANDER']), async (req, res) => {
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

// ИСПРАВЛЕНО: Расширены права создания и добавлена четкая сегментация типов
app.post('/api/events', authMiddleware, checkRole(['COMMANDER', 'COMMISSAR', 'MASTER', 'REG_HQ']), async (req, res) => {
  try {
    const { title, description, date, location, type } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    
    let targetBrigadeId = null;
    let eventType = "LOCAL";

    if (user.role === 'REG_HQ') {
      eventType = type || "REGIONAL";
      targetBrigadeId = eventType === 'REGIONAL' ? null : req.body.brigadeId;
    } else {
      if (!user.brigadeId) return res.status(403).json({ message: "Вы не привязаны к ЛСО" });
      targetBrigadeId = user.brigadeId;
    }

    const event = await prisma.event.create({
      data: { 
        title, 
        description: description || "Описание не указано", 
        date: new Date(date), 
        location: location || "Не указано",
        type: eventType, 
        brigadeId: targetBrigadeId 
      }
    });
    res.status(201).json(event);
  } catch (error) { res.status(500).json({ message: "Ошибка создания мероприятия" }); }
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

app.get('/api/commander/dashboard', authMiddleware, checkRole(['COMMANDER']), async (req, res) => {
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


// ==========================================
// 1. Инициация входа: редирект юзера в Google
// ==========================================
app.get('/api/auth/google', (req, res) => {
  // Ссылка, куда Google вернет пользователя с кодом. 
  // Caddy поймает /api/... и отдаст этот запрос твоему Node.js
  const redirectUri = `${DOMAIN_URL}/api/auth/google/callback`;
  
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email%20profile`;
  
  res.redirect(googleAuthUrl);
});

// ==========================================
// 2. Callback: Google возвращает code сюда
// ==========================================
app.get('/api/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  const redirectUri = `${DOMAIN_URL}/api/auth/google/callback`;

  if (!code) {
    return res.redirect(`${DOMAIN_URL}/login?error=no_code`);
  }

  try {
    // 2.1 Обмениваем code на access_token напрямую через сервера Google
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    });

    const { access_token } = tokenResponse.data;

    // 2.2 Используя access_token, запрашиваем данные профиля (email, имя, аватарку)
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { id: googleId, email, given_name, family_name, picture } = userResponse.data;

    // 2.3 Ищем пользователя по googleId
    let user = await prisma.user.findUnique({ where: { googleId } });

    if (!user) {
      // Если по googleId не нашли, проверяем, нет ли пользователя с таким email
      if (email) {
        user = await prisma.user.findUnique({ where: { email } });
      }

      if (user) {
        // Если пользователь с такой почтой уже есть, привязываем к нему GoogleId
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId, avatarUrl: user.avatarUrl || picture }
        });
      } else {
        // Если вообще нет такого пользователя — создаем новую учетку бойца
        user = await prisma.user.create({
          data: {
            googleId,
            email,
            firstName: given_name || 'Боец',
            lastName: family_name || 'РСО',
            avatarUrl: picture,
          }
        });
      }
    }

    // 2.4 Генерируем твой стандартный системный JWT-токен СевРО для авторизации
    const sysToken = jwt.sign(
          { userId: user.id, role: user.role }, 
          process.env.JWT_SECRET, 
          { expiresIn: '7d' }
        );

    // 2.5 Редиректим пользователя обратно на страницу входа фронтенда, 
    // передавая наш сгенерированный JWT-токен в параметрах URL
    res.redirect(`${DOMAIN_URL}/login?token=${sysToken}`);

  } catch (error) {
    console.error('Ошибка Google OAuth:', error.response?.data || error.message);
    res.redirect(`${DOMAIN_URL}/login?error=auth_failed`);
  }
});

// ==========================================
// YANDEX OAUTH: Инициация входа
// ==========================================
app.get('/api/auth/yandex', (req, res) => {
  const redirectUri = `${DOMAIN_URL}/api/auth/yandex/callback`;
  
  const yandexAuthUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${process.env.YANDEX_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  
  res.redirect(yandexAuthUrl);
});

// ==========================================
// YANDEX OAUTH: Callback (обработка ответа от Яндекса)
// ==========================================
app.get('/api/auth/yandex/callback', async (req, res) => {
  const { code } = req.query;
  const redirectUri = `${DOMAIN_URL}/api/auth/yandex/callback`;

  if (!code) {
    return res.redirect(`${DOMAIN_URL}/login?error=no_code`);
  }

  try {
    // 1. Обмениваем временный code на access_token
    // Яндекс строго требует передачу параметров в формате x-www-form-urlencoded
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

    // 2. Используя access_token, запрашиваем данные профиля пользователя
    const userResponse = await axios.get('https://login.yandex.ru/info', {
      headers: { Authorization: `OAuth ${access_token}` }
    });

    const { id: yandexId, default_email: email, first_name, last_name, default_avatar_id } = userResponse.data;
    
    // Если у пользователя есть аватарка, Яндекс возвращает её ID, собираем полноценную ссылку
    const avatarUrl = default_avatar_id ? `https://avatars.yandex.net/get-yapic/${default_avatar_id}/islands-200` : null;

    // 3. Ищем пользователя в БД по yandexId
    let user = await prisma.user.findUnique({ where: { yandexId } });

    if (!user) {
      // Если по yandexId не нашли, проверяем совпадение по email
      if (email) {
        user = await prisma.user.findUnique({ where: { email } });
      }

      if (user) {
        // Если аккаунт с такой почтой уже есть, привязываем к нему yandexId
        user = await prisma.user.update({
          where: { id: user.id },
          data: { yandexId, avatarUrl: user.avatarUrl || avatarUrl }
        });
      } else {
        // Если пользователя нет — создаем новую учетную запись бойца
        user = await prisma.user.create({
          data: {
            yandexId,
            email,
            firstName: first_name || 'Боец',
            lastName: last_name || 'РСО',
            avatarUrl: avatarUrl,
          }
        });
      }
    }

    // 4. Генерируем наш системный JWT-токен СевРО (используем строго userId)
    const sysToken = jwt.sign(
      { userId: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // 5. Перенаправляем пользователя на фронтенд, передавая токен в URL
    res.redirect(`${DOMAIN_URL}/login?token=${sysToken}`);

  } catch (error) {
    console.error('Ошибка Yandex OAuth:', error.response?.data || error.message);
    res.redirect(`${DOMAIN_URL}/login?error=auth_failed`);
  }
});

// ==========================================
// YANDEX OAUTH: Инициация входа
// ==========================================
app.get('/api/auth/yandex', (req, res) => {
  const redirectUri = `${DOMAIN_URL}/api/auth/yandex/callback`;
  
  const yandexAuthUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${process.env.YANDEX_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  
  res.redirect(yandexAuthUrl);
});


// ==========================================
// VK OAUTH: Инициация входа
// ==========================================
app.get('/api/auth/vk', (req, res) => {
  const vkRedirectUri = 'https://севрсо.рф/api/auth/vk/callback';
  const vkClientId = '54608627'; // Твой 100% правильный ID
  
  const vkAuthUrl = `https://oauth.vk.com/authorize?client_id=${vkClientId}&display=page&redirect_uri=${encodeURIComponent(vkRedirectUri)}&scope=email&response_type=code&v=5.131`;
  
  res.redirect(vkAuthUrl);
});

// ==========================================
// VK OAUTH: Callback
// ==========================================
app.get('/api/auth/vk/callback', async (req, res) => {
  const { code } = req.query;
  const vkRedirectUri = 'https://севрсо.рф/api/auth/vk/callback';
  
  const vkClientId = '54608627'; // Твой 100% правильный ID
  const vkClientSecret = '9fYVPkQyX5IGZ0IIR2R5'; // Вставь ключ именно от 54608627

  if (!code) {
    return res.redirect(`${DOMAIN_URL}/login?error=no_code`);
  }

  try {
    const tokenResponse = await axios.get('https://oauth.vk.com/access_token', {
      params: {
        client_id: vkClientId,
        client_secret: vkClientSecret,
        redirect_uri: vkRedirectUri, 
        code
      }
    });

    const { access_token, user_id, email } = tokenResponse.data;

    const userResponse = await axios.get('https://api.vk.com/method/users.get', {
      params: { user_ids: user_id, fields: 'photo_200', access_token, v: '5.131' }
    });

    const vkUser = userResponse.data.response[0];
    const vkIdString = String(user_id);

    let user = await prisma.user.findUnique({ where: { vkId: vkIdString } });

    if (!user) {
      if (email) user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { vkId: vkIdString, avatarUrl: user.avatarUrl || vkUser.photo_200 }
        });
      } else {
        user = await prisma.user.create({
          data: {
            vkId: vkIdString,
            email: email || null,
            firstName: vkUser.first_name || 'Боец',
            lastName: vkUser.last_name || 'РСО',
            avatarUrl: vkUser.photo_200,
          }
        });
      }
    }

    const sysToken = jwt.sign(
      { userId: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.redirect(`${DOMAIN_URL}/login?token=${sysToken}`);

  } catch (error) {
    console.error('Ошибка VK OAuth:', error.response?.data || error.message);
    res.redirect(`${DOMAIN_URL}/login?error=auth_failed`);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер на порту ${PORT}`));