const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем генерацию тестовых данных...');

  // 1. Создаем Трудовые объекты
  const mriya = await prisma.laborObject.create({
    data: { name: 'Mriya Resort & SPA 5*', location: 'Ялта, Крым', task: 'Сервисное обслуживание премиум-класса' }
  });
  const bam = await prisma.laborObject.create({
    data: { name: 'ВСС «БАМ 2.0»', location: 'Дальний Восток', task: 'Реконструкция железнодорожной магистрали' }
  });

  // 2. Создаем Отряды и привязываем их к объектам
  const brigadesData = [
    { name: 'СПО «Пламя»', type: 'СПО', desc: 'Педагогический отряд', color: '#4DA6FF' },
    { name: 'ССО «Гандвик»', type: 'ССО', desc: 'Строительный отряд', color: '#0052FF', obj: bam.id },
    { name: 'ССервО «Атлант»', type: 'ССервО', desc: 'Сервисный отряд', color: '#66BB8A', obj: mriya.id },
    { name: 'СОП «Сапсан»', type: 'СОП', desc: 'Отряд проводников', color: '#FF4D39' },
    { name: 'СМО «Медик»', type: 'СМО', desc: 'Медицинский отряд', color: '#00E5FF' }
  ];

  const createdBrigades = [];
  for (const b of brigadesData) {
    const brigade = await prisma.brigade.create({
      data: {
        name: b.name, type: b.type, description: b.desc, colorScheme: b.color,
        laborObjects: b.obj ? { connect: { id: b.obj } } : undefined
      }
    });
    createdBrigades.push(brigade);
  }

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 3. Создаем Главного Админа (Штаб)
  await prisma.user.upsert({
    where: { email: 'admin@mail.ru' },
    update: {},
    create: { email: 'admin@mail.ru', password: hashedPassword, firstName: 'Иван', lastName: 'Штабов', role: 'REG_HQ' }
  });

  // 4. Генерируем 60 тестовых аккаунтов (по 12 на каждый отряд)
  console.log('👥 Генерируем 60 бойцов и командиров...');
  for (let i = 0; i < 5; i++) {
    const brigade = createdBrigades[i];
    
    // 1 Командир на отряд
    await prisma.user.create({
      data: { email: `commander${i}@mail.ru`, password: hashedPassword, firstName: 'Командир', lastName: `Отряда ${i}`, role: 'COMMANDER', brigadeId: brigade.id }
    });

    // 11 обычных бойцов на отряд
    for (let j = 1; j <= 11; j++) {
      await prisma.user.create({
        data: { email: `boets${i}_${j}@mail.ru`, password: hashedPassword, firstName: `Боец ${j}`, lastName: `Тестовый ${i}`, role: 'BOETS', brigadeId: brigade.id }
      });
    }
  }

  console.log('✅ База данных успешно заполнена тестовыми данными!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });