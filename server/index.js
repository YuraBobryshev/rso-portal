const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); 
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');
const { upload } = require('./s3Config'); 

const app = express();
const prisma = new PrismaClient();

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
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true, brigade: true, vkUrl: true, tgUrl: true, avatarUrl: true }
  });
  res.json(user);
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

// ИСПРАВЛЕНО: Теперь роут отдает аватарку и подгружает имя связанного отряда
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

// Роут создания отряда
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

// ИСПРАВЛЕНО: Теперь при выгрузке отрядов бэкенд считает количество привязанных бойцов
app.get('/api/brigades', async (req, res) => {
  try {
    const brigades = await prisma.brigade.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      }
    });
    res.json(brigades);
  } catch (e) { res.status(500).json([]); }
});

app.post('/api/applications/apply', authMiddleware, async (req, res) => {
  const { brigadeId } = req.body;
  const userId = req.user.userId;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user.brigadeId) return res.status(400).json({ message: 'Вы уже в отряде' });

  await prisma.application.create({ data: { userId, brigadeId } });
  res.json({ message: 'Заявка отправлена' });
});

app.post('/api/commander/process-application', authMiddleware, checkRole(['COMMANDER']), async (req, res) => {
  const { appId, status } = req.body;
  const application = await prisma.application.update({ where: { id: appId }, data: { status } });
  if (status === 'APPROVED') {
    await prisma.user.update({ where: { id: application.userId }, data: { role: 'CANDIDATE', brigadeId: application.brigadeId } });
  }
  res.json({ message: 'Заявка обработана' });
});

// =============================================================================
// 📅 БЛОК 4: МЕРОПРИЯТИЯ И ПОСЕЩАЕМОСТЬ
// =============================================================================

app.post('/api/events', authMiddleware, checkRole(['COMMANDER', 'COMMISSAR', 'REG_HQ']), async (req, res) => {
  try {
    const { title, description, date, type } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    const event = await prisma.event.create({
      data: { title, description: description || "Описание не указано", date: new Date(date), type: type || "REGIONAL", brigadeId: type === 'REGIONAL' ? null : user.brigadeId }
    });
    res.status(201).json(event);
  } catch (error) { res.status(500).json({ message: "Ошибка" }); }
});

app.get('/api/events', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const events = await prisma.event.findMany({
      where: { OR: [{ brigadeId: user.brigadeId || undefined }, { type: 'REGIONAL' }] },
      orderBy: { date: 'asc' }
    });
    const userParticipations = await prisma.eventParticipant.findMany({ where: { userId } });
    const joinedEventIds = userParticipations.map(p => p.eventId);
    const formattedEvents = events.map(event => ({ ...event, isJoined: joinedEventIds.includes(event.id) }));
    res.json(formattedEvents);
  } catch (error) { res.status(500).json({ message: "Ошибка" }); }
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

app.post('/api/events/:id/join', authMiddleware, async (req, res) => {
  try {
    await prisma.eventParticipant.create({ data: { userId: req.user.userId, eventId: req.params.id } });
    res.json({ message: "Вы записаны" });
  } catch (error) { res.status(500).json({ message: "Ошибка" }); }
});

app.patch('/api/events/attendance', authMiddleware, checkRole(['MASTER', 'COMMANDER']), async (req, res) => {
  await prisma.eventParticipant.update({ where: { id: req.body.participantId }, data: { attended: req.body.attended } });
  res.json({ message: "Статус обновлен" });
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер на порту ${PORT}`));