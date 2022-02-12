FROM node:14.16.1

WORKDIR /usr/src/server

COPY package*.json ./

RUN npm install

EXPOSE 5000

## run the node process
CMD ["npm", "run", "dev"]