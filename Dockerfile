FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev || npm i --omit=dev
COPY . .
ENV NODE_ENV=production
EXPOSE 8080
CMD ["sh", "-lc", "node server/index.js || node backend/index.js || node index.js"]

