FROM node:16

# dependencies (early in file so mostly cached)
COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .

# config
ARG maxStoreLifeTimeMinutes
ARG sendMail
ARG adminEmail
ARG sourceEmail
ARG port

RUN test -n "maxStoreLifeTimeMinutes"
RUN test -n "sendMail"
RUN test -n "adminEmail"
RUN test -n "sourceEmail"
RUN test -n "port"

RUN rm ./src/config.json
RUN mv ./src/config.template.json ./src/config.json

RUN sed -i "s|maxStoreLifeTimeMinutesPlaceholder|${maxStoreLifeTimeMinutes}|" ./src/config.json
RUN sed -i "s|sendMailPlaceholder|${sendMail}|" ./src/config.json
RUN sed -i "s|adminEmailPlaceholder|${adminEmail}|" ./src/config.json
RUN sed -i "s|sourceEmailPlaceholder|${sourceEmail}|" ./src/config.json
RUN sed -i "s|portPlaceholder|${port}|" ./src/config.json


# building
RUN npm run build:prod

# running
CMD ['npm', 'run', 'run']
