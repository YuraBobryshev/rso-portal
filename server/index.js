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
app.post('/api/events', authMiddleware, checkRole(['COMMANDER', 'COMMISSAR', 'REG_HQ']), async (req, res) => {
  const { title, description, date, type } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
  
  const event = await prisma.event.create({
    data: { 
      title, 
      description, 
      date: new Date(date), 
      type, 
      brigadeId: type === 'REGIONAL' ? null : user.brigadeId 
    }
  });
  res.json(event);
});

// 1. УМНЫЙ СПИСОК (С проверкой участия текущего юзера)
app.get('/api/events', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    const events = await prisma.event.findMany({
      where: {
        OR: [{ brigadeId: user.brigadeId }, { type: 'REGIONAL' }]
      },
      include: {
        participants: {
          where: { userId: userId } // Ищем запись именно этого юзера
        }
      },
      orderBy: { date: 'asc' }
    });

    // Добавляем флаг isJoined для фронтенда
    const formattedEvents = events.map(event => ({
      ...event,
      isJoined: event.participants.length > 0
    }));

    res.json(formattedEvents);
  } catch (error) { res.status(500).json({ message: "Ошибка загрузки мероприятий" }); }
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
// 🚀 ЗАПУСК
// =============================================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер на порту ${PORT}`));