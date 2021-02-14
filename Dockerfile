FROM node:15

# Copy everything from this project to docker image
COPY ./ ./

# install dependencies from package.json
RUN npm install

# build project to dist folder
RUN npm run build

# install server to serve the dist folder
RUN npm install -g http-server

# Open docker's port
EXPOSE 8080

# start command to boot up a container
CMD [ "http-server", "dist" ]