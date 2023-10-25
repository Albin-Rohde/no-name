# Stage 1: Install and build frontend
FROM node:14.16.1 AS frontend
WORKDIR /tmp/src/frontend
COPY ./frontend .
RUN npm ci
COPY ./frontend .
RUN npm run build

# Stage 2: Install and build backend
FROM node:14.16.1 AS server
WORKDIR /tmp/src/server
COPY ./server/package.json ./server/package-lock.json ./
RUN npm ci
COPY ./server .
RUN npm run build

# Stage 3: Final image
FROM node:14.16.1-alpine
WORKDIR /app
COPY --from=frontend /tmp/src/frontend/build ./frontend/build
COPY --from=server /tmp/src/server/ ./server/
WORKDIR /app/server
RUN npm i -g ts-node@9.1.1 typescript@4.2.4
RUN npm run copy-views
CMD ["npm", "run", "prod"]