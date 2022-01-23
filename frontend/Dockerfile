FROM node:14.16.1

WORKDIR /usr/src/frontend

COPY package*.json ./
RUN npm -g install typescript
RUN npm install -g serve
RUN npm install

EXPOSE 3000
COPY . .
RUN chmod +x ./deploy.sh

CMD ["npm", "run", "deploy"]
