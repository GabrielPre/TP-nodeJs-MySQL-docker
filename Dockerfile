FROM node:16

# Create app directory
WORKDIR /app

# Install app dependencies

RUN npm install express mysql2

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]