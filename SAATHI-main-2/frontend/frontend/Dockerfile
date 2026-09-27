FROM node:22-alpine AS build
WORKDIR /app

# Copy dependency files and install
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the frontend code and build
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Production image
FROM node:22-alpine
WORKDIR /app

# Copy the standard TanStack/Nitro output folder instead of "dist"
COPY --from=build --chown=1000:1000 /app/.output ./.output
COPY --from=build --chown=1000:1000 /app/node_modules ./node_modules
COPY --from=build --chown=1000:1000 /app/package.json ./

ENV PORT=8080
ENV HOST=0.0.0.0
ENV NODE_ENV=production
EXPOSE 8080

USER node

# Start the compiled Nitro Node server
CMD ["node", ".output/server/index.mjs"]
