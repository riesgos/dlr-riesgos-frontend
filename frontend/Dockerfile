FROM node as build
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build

FROM nginx as host
WORKDIR /app
COPY --from=build /app/dist/riesgos /usr/share/nginx/html
COPY ./nginx.conf  /etc/nginx/conf.d/default.conf
EXPOSE 80