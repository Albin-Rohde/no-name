FROM node:14.16.1

WORKDIR /usr/src/frontend

COPY package*.json ./
RUN npm -g install typescript
RUN npm install

EXPOSE 3000
ENV NODE_ENV=development
CMD ["npm","run","dev"]
