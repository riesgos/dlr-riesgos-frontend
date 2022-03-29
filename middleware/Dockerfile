# Parent image
FROM node
# All subsequent commands are executed here. May be called mutliple times.
WORKDIR /app
# Copy the current directory contents into the container at /app
COPY . /app
# Every run command creates another layer
RUN npm install
RUN npm run build:all
# Make port 80 available to the world outside this container
EXPOSE 8888
# Define environment variable
# ENV NAME World
# Cmd is called when the container launches. This command's stout goes directly into the docker logs.
CMD ["node", "./build/serverInterface.js"]