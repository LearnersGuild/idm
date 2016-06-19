FROM node:5.10
MAINTAINER jeffrey@learnersguild.org

# INSTALL any further tools you need here so they are cached in the docker build

# Set the WORKDIR to /app so all following commands run in /app
WORKDIR /app

# COPY the package.json and if you use npm shrinkwrap the npm-shrinkwrap.json and
# install npm dependencies before copying the whole code into the container.
COPY package.json ./
RUN npm install

# After installing dependencies copy the whole codebase into the Container to not invalidate the cache before
COPY . ./
