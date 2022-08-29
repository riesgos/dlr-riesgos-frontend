FROM node:16 as buildLayer
WORKDIR /app
COPY . /app

# settings for slower network connections
RUN npm config set fetch-retries 3
RUN npm config set fetch-retry-mintimeout 60000
RUN npm config set fetch-retry-maxtimeout 120000
# more memory for faster build
ARG MAX_OLD_SPACE_SIZE=8192
ENV NODE_OPTIONS=--max-old-space-size=${MAX_OLD_SPACE_SIZE}


# building
ARG LOCAL_ARTIFACTS
# re-use old node_modules if already present on host-machine
RUN if [ "$LOCAL_ARTIFACTS" = "TRUE" ] && [ -d /app/node_modules ]; then \
    echo "node_modules already copied from host-machine. no need for npm ci"; \
  else \
    npm ci --no-progress --loglevel=error --audit=false; \
  fi
# re-use old dist/riesgos if already present on host-machine
RUN if [ "$LOCAL_ARTIFACTS" = "TRUE" ] && [ -d /app/dist/riesgos ]; then \
    echo "dist/riesgos already copied from host-machine. no need for npm run build:prod"; \
  else \
    npm run build:prod; \
    rm -rf node_modules; \
  fi



FROM nginx as host
WORKDIR /app
COPY --from=buildLayer /app/dist/riesgos /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
