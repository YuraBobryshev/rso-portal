const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 1. Достаем токен из заголовка запроса (обычно это 'Bearer <token>')
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Доступ запрещен. Вы не авторизованы.' });
    }

    // 2. Проверяем подлинность токена нашим секретным ключом
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Добавляем данные пользователя в объект запроса, чтобы они были доступны в роуте
    req.user = decoded;

    // 4. Пропускаем запрос дальше
    next();
  } catch (error) {
    res.status(401).json({ message: 'Неверный или просроченный токен' });
  }
};