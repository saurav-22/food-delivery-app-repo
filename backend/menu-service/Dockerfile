FROM node:20-alpine AS base

ENV NODE_ENV=production
WORKDIR /app

# Install deps
COPY package.json ./
RUN npm install --only=production

# Copy source
COPY . .

EXPOSE 8082
CMD ["node", "index.js"]
