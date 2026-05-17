# Этап 1: Сборка
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Этап 2: Раздача через Nginx
FROM nginx:stable-alpine
# Копируем билд из первого этапа
COPY --from=build /app/dist /usr/share/nginx/html
# Копируем конфиг для роутинга React
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]