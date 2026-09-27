FROM node:20-alpine

WORKDIR /app

COPY contributors/naisarg/backend_extra_clean/package*.json ./

RUN npm ci

COPY contributors/naisarg/backend_extra_clean/ ./

RUN npm run build

EXPOSE 3005

ENV PORT=3005
ENV NODE_ENV=production

CMD ["node", "dist/src/main.js"]
