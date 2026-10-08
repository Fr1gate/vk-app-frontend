# syntax=docker/dockerfile:1

FROM node:22-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# npm не сохраняет в lock-файл платформенные бинарники чужих ОС (npm/cli#4828):
# доставляем linux-бинарники нативных зависимостей сборки — rolldown (бандлер)
# и lightningcss (минификатор CSS); версии берём из lock-файла
RUN RLD_VERSION="$(node -p "require('./package-lock.json').packages['node_modules/rolldown'].version")" \
 && LCS_VERSION="$(node -p "require('./package-lock.json').packages['node_modules/lightningcss'].version")" \
 && npm install --no-save \
      "@rolldown/binding-linux-x64-gnu@${RLD_VERSION}" \
      "lightningcss-linux-x64-gnu@${LCS_VERSION}"

COPY . .

ARG VITE_API_URL=http://localhost:3000
ARG VITE_DEV_MODE=false

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_DEV_MODE=$VITE_DEV_MODE

RUN npm run build

FROM nginx:1.27-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
