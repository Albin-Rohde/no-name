FROM node:14.16.1

WORKDIR /usr/src/server

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "deploy"]
