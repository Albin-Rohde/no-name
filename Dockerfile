FROM node:14.16.1 AS install-frontend
WORKDIR /usr/src/frontend
COPY ./frontend .
RUN npm install

FROM install-frontend AS build-frontend
WORKDIR /usr/src/frontend
RUN npm run build

FROM node:14.16.1 AS install-server
WORKDIR /usr/src/server
COPY ./server .
RUN npm install

FROM install-server AS build-server
WORKDIR /usr/src/server
RUN npm run build
RUN cp -r ./src/admin/views ./build/src/admin/views


FROM install-server AS collector
WORKDIR /app
COPY --from=build-frontend /usr/src/frontend/build /app/frontend/build
COPY --from=build-frontend /usr/src/frontend/build/static /app/frontend/build/static
COPY --from=build-server /usr/src/server/build /app/server/build

FROM collector AS runner
WORKDIR /app/server
CMD ["npm", "run", "prod"]