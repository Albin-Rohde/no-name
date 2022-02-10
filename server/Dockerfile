FROM node:14.16.1

WORKDIR /usr/src/server

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 5000

## build app when container is created.
RUN npm run build

## run the node process
CMD ["npm", "run", "prod"]
