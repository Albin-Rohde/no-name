FROM node:14

WORKDIR /usr/src/frontend

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000
ENV HOST=0.0.0.0

CMD ["npm", "run", "start"]
