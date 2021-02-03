FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install\
    && npm install tsc -g\
    && npm install typescript

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
