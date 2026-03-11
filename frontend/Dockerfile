# Сборка
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Раздача статики через простой http-сервер
FROM node:20-alpine AS production
RUN npm install -g serve
COPY --from=builder /app/dist /app/dist
EXPOSE 3000
CMD ["serve", "-s", "/app/dist", "-l", "3000"]
