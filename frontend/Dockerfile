# Issue with node:16 getting SOCKET TIMEOUT
FROM node:14 as build
WORKDIR /app
COPY . /app
# settings for slower network connections
RUN npm config set fetch-retries 3
RUN npm config set fetch-retry-mintimeout 60000
RUN npm config set fetch-retry-maxtimeout 120000
# building
RUN npm install
RUN npm run build:prod

FROM nginx as host
WORKDIR /app
COPY --from=build /app/dist/riesgos /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80