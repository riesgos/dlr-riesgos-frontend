FROM node:16

WORKDIR backend

# install and build
COPY . .
RUN npm ci
RUN npm run build:prod

# config
ENV maxStoreLifeTimeMinutes "1440"
# adminEmails: comma separated list
ENV adminEmails ""
ENV sourceEmail "info@test.com"
ENV port "8008"


# running
EXPOSE ${port}
CMD ["node",  "dist/main.js"]
