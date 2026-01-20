FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json tsconfig.json ./
RUN npm ci --production
COPY . .
RUN npm run build
CMD ["node", "dist/server.js"]
