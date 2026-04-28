// Импортируем нужные библиотеки
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Библиотека для шифрования паролей
const { PrismaClient } = require('@prisma/client'); // Наш клиент для работы с БД
const jwt = require('jsonwebtoken'); // Библиотека для создания токенов

// Инициализируем сервер и Prisma
const app = express();
const prisma = new PrismaClient();

// Настраиваем middleware
app.use(cors()); // Разрешаем фронтенду обращаться к нашему бэкенду
app.use(express.json()); // Учим сервер понимать JSON из тела запроса

// ==========================================
// РОУТ 1: РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ
// ==========================================
app.post('/api/auth/register', async (req, res) => {
  try {
    // 1. Получаем данные от пользователя
    const { email, password, firstName, lastName } = req.body;

    // 2. Проверяем, нет ли уже такого email в базе
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // 3. БЕЗОПАСНОСТЬ: Шифруем (хэшируем) пароль
    // '10' — это так называемая "соль" (salt rounds), определяющая сложность шифрования
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Сохраняем пользователя в базу данных (с зашифрованным паролем!)
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        // Роль 'CANDIDATE' присвоится автоматически, как мы указали в схеме
      }
    });

    // 5. Отвечаем фронтенду об успехе (пароль в ответ НЕ отдаем ради безопасности)
    res.status(201).json({
      message: 'Регистрация прошла успешно!',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});


// ==========================================
// РОУТ 2: ВХОД (АВТОРИЗАЦИЯ)
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Ищем пользователя по email
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    // Если такого email нет
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // 2. БЕЗОПАСНОСТЬ: Проверяем пароль
    // bcrypt сам берет обычный пароль, шифрует его солью из базы и сравнивает хэши
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      // Сообщение об ошибке всегда одинаковое, чтобы хакер не понял, угадал он почту или нет
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // 3. СОЗДАЕМ ПРОПУСК (JWT ТОКЕН)
    // Вшиваем внутрь токена ID и Роль, чтобы сервер всегда знал, кто делает запрос
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET, // Подписываем нашим секретным ключом из .env
      { expiresIn: '24h' }    // Срок годности "браслета" — 24 часа
    );

    // 4. Отдаем токен фронтенду
    res.json({
      message: 'Вход выполнен успешно!',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Ошибка при входе:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

// Запускаем сервер на порту 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер успешно запущен на порту ${PORT}`);
});