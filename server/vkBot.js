const { VK, Keyboard } = require('vk-io');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Инициализация бота с токеном из переменных окружения
const vk = new VK({
    token: process.env.VK_GROUP_TOKEN
});

// Прослушка входящих сообщений (ответ на кнопку "Начать")
vk.updates.on('message_new', async (context) => {
    if (context.isOutbox) return;

    if (context.text === 'Начать' || context.text === '/start') {
        await context.send('Привет! Я системный бот СевРО РСО. Буду присылать тебе важные уведомления о заявках и мероприятиях.');
    }
});

/**
 * Функция для отправки системных алертов (уведомлений)
 * @param {string} vkId - ID пользователя ВКонтакте
 * @param {string} message - Текст сообщения
 * @param {object} keyboard - (Опционально) Клавиатура с кнопками vk-io
 */
const sendSystemAlert = async (vkId, message, keyboard = null) => {
    if (!vkId) return; // Если у бойца нет привязки ВК — просто игнорим
    
    try {
        await vk.api.messages.send({
            user_id: vkId,
            message: message,
            random_id: Math.floor(Math.random() * 1000000), // Защита от дублей сообщений
            keyboard: keyboard ? keyboard : undefined
        });
        console.log(`[VK Bot] Уведомление успешно отправлено пользователю ${vkId}`);
    } catch (error) {
        console.error(`[VK Bot] Ошибка отправки пользователю ${vkId}:`, error.message);
    }
};

// Функция запуска Long Poll (чтобы бот "висел" и слушал сервер ВК)
const startBot = () => {
    vk.updates.start()
        .then(() => console.log('[VK Bot] Бот успешно запущен и слушает события'))
        .catch(console.error);
};

module.exports = { startBot, sendSystemAlert, Keyboard };