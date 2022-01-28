FROM node:14.16.1

WORKDIR /usr/src/server

COPY package*.json ./
RUN npm install

COPY . .
RUN chmod +x ./deploy.sh


EXPOSE 5000

## build app when container is created.
RUN npm run build

## From then on only run the node process, do not rebuild when container restarts
ENV NODE_ENV=production
CMD ["node", "/usr/src/server/build/src/app.js"]
