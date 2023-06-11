FROM node:16

WORKDIR /monitor

# install and build
COPY . .
RUN npm ci
RUN npm run build:prod

# config
# sendMailTo: comma separated list
ENV backendUrl "http://localhost"
ENV backendPort "8008"
ENV sendMailTo ""
ENV sourceEmail "info@test.com"
ENV testServiceEveryMinutes "120"


# running
CMD ["node",  "dist/runall.js"]
