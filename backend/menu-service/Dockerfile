FROM node:20-alpine

WORKDIR /app

# Install dependencies first for caching
COPY package.json .
RUN npm install --only=production

# Copy source code
COPY . .

EXPOSE 8082

CMD ["node", "index.js"]
