FROM node:16 as buildLayer

WORKDIR /app

COPY . /app


# settings for slower network connections
RUN npm config set fetch-retries 3
RUN npm config set fetch-retry-mintimeout 60000
RUN npm config set fetch-retry-maxtimeout 120000
# more memory for faster build
ENV NODE_OPTIONS=--max-old-space-size=8192

# building
RUN npm ci
RUN npx ng build --configuration=production --base-href=BaseHrefPlaceholder



# hosting
FROM nginx as host

WORKDIR /app

ARG sourceDir=/usr/share/nginx/html
ENV sourceDir=${sourceDir}

COPY --from=buildLayer /app/dist/riesgos /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./containerInit.sh /app
RUN chmod +x ./containerInit.sh

EXPOSE 80

CMD [ "/app/containerInit.sh" ]