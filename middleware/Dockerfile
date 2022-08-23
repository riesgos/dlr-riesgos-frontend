# Parent image
FROM node:16

WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build:all
EXPOSE 8008

CMD ["node", "./build/main.js"]