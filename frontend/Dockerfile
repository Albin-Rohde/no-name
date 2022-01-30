FROM node:14.16.1

WORKDIR /usr/src/frontend

## Collect build arguments
ARG REACT_APP_API_BASE_URL=http://localhost/api
ARG REACT_APP_SOCKET_BASE_URL=http://localhost
ARG REACT_APP_CLIENT_URL=http://localhost

COPY package*.json ./
RUN npm -g install typescript
RUN npm install -g serve
RUN npm install

EXPOSE 3000
COPY . .

RUN npm run build
ENV NODE_ENV=production
CMD ["npm", "run", "production"]
