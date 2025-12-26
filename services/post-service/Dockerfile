FROM node:25.2.1-alpine3.23

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5002

CMD ["node", "server.js"]