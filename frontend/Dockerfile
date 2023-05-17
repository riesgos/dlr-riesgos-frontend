FROM node:16 as buildLayer
WORKDIR /app
COPY . /app

# config (ARG, not ENV: is done once at build-time.)
ARG subPath "/"
ARG backendUrl "http://localhost"
ARG backendPort "8008"
RUN sed -i "s|backendUrlPlaceholder|${backendUrl}|" ./src/assets/config/config.prod.template.json
RUN sed -i "s|backendPortPlaceholder|${backendPort}|" ./src/assets/config/config.prod.template.json
RUN rm ./src/assets/config/config.prod.json
RUN mv ./src/assets/config/config.prod.template.json ./src/assets/config/config.prod.json


# settings for slower network connections
RUN npm config set fetch-retries 3
RUN npm config set fetch-retry-mintimeout 60000
RUN npm config set fetch-retry-maxtimeout 120000
# more memory for faster build
ENV NODE_OPTIONS=--max-old-space-size=8192

# building
RUN npm ci
RUN ng build --configuration production --baseHref=${subPath}


# hosting
FROM nginx as host
WORKDIR /app
COPY --from=buildLayer /app/dist/riesgos /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
