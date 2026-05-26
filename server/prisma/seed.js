const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Начинаем полную очистку базы данных...');
  
  // Удаляем всё в строгом порядке, чтобы не сломать связи (foreign keys)
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.eventParticipant.deleteMany();
  await prisma.event.deleteMany();
  await prisma.application.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.user.deleteMany();
  await prisma.brigade.deleteMany();
  await prisma.laborObject.deleteMany();

  console.log('🌱 Создаем тестовый полигон (Объект и Отряд)...');
  
  const testObject = await prisma.laborObject.create({
    data: { name: 'Тестовый Объект', location: 'Севастополь', task: 'Полигон для тестирования системы' }
  });

  const brigade = await prisma.brigade.create({
    data: {
      name: 'ССО «Тест»',
      type: 'ССО',
      description: 'Отряд для тестирования функционала комсостава.',
      colorScheme: '#0052FF',
      laborObjects: { connect: { id: testObject.id } }
    }
  });

  const hashedPassword = await bcrypt.hash('password123', 10);

  console.log('👥 Генерируем 5 ролевых аккаунтов (Пароль: password123)...');

  // 1. АДМИН (Региональный штаб) — Вне отряда
  await prisma.user.create({
    data: { email: 'admin@mail.ru', password: hashedPassword, firstName: 'Главный', lastName: 'Штаб', role: 'REG_HQ' }
  });

  // 2. КОМАНДИР (Управляет заявками и отчетами)
  await prisma.user.create({
    data: { email: 'commander@mail.ru', password: hashedPassword, firstName: 'Иван', lastName: 'Командир', role: 'COMMANDER', brigadeId: brigade.id }
  });

  // 3. КОМИССАР (Управляет мероприятиями)
  await prisma.user.create({
    data: { email: 'commissar@mail.ru', password: hashedPassword, firstName: 'Анна', lastName: 'Комиссар', role: 'COMMISSAR', brigadeId: brigade.id }
  });

  // 4. МАСТЕР (Отвечает за посещаемость)
  await prisma.user.create({
    data: { email: 'master@mail.ru', password: hashedPassword, firstName: 'Алексей', lastName: 'Мастер', role: 'MASTER', brigadeId: brigade.id }
  });

  // 5. БОЕЦ (Обычный пользователь в отряде)
  await prisma.user.create({
    data: { email: 'boets@mail.ru', password: hashedPassword, firstName: 'Тестовый', lastName: 'Боец', role: 'BOETS', brigadeId: brigade.id }
  });

  console.log('✅ База успешно очищена и заполнена тестовыми данными!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });