# Multi-stage NestJS Dockerfile — Phase 1.4
# Pattern mirrors d/D1/Dockerfile and d/D4/Dockerfile exactly.
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps
COPY --from=build /app/dist ./dist
EXPOSE 5005
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:5005/health || exit 1
CMD ["node", "dist/main.js"]
