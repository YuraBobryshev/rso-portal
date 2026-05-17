# Используем легкий образ Node.js
FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app

# Сначала копируем только файлы зависимостей (для кэширования)
COPY package*.json ./
RUN npm install

# Копируем схему Prisma и генерируем клиент
COPY prisma ./prisma/
RUN npx prisma generate

# Копируем остальной код
COPY . .

EXPOSE 5000

CMD ["node", "index.js"]