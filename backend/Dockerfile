FROM node:16

# install and build
COPY . .
RUN npm ci
RUN npm run build:prod

# config
ENV maxStoreLifeTimeMinutes "1440"
ENV sendMail "true"
ENV adminEmail 
ENV sourceEmail "info@test.com"
ENV port "8080"

# running
CMD ['npm', 'run', 'run']
