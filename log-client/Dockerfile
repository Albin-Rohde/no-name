FROM node:14.16.1

WORKDIR /usr/src/log-client

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start"]
