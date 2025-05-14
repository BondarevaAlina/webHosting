# ---------- stage 1: сборка статических файлов ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build          # → dist/

# ---------- stage 2: лёгкий nginx для отдачи SPA ----------
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# SPA-fallback: если файла нет — отдаём index.html,
# чтобы react-router работал по прямым ссылкам
RUN sed -i 's/try_files $uri $uri\/ =404;/try_files $uri \/index.html;/g' /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
