FROM node:14.16.1

## Set up frontend
WORKDIR /usr/src/frontend
COPY ./frontend .
RUN npm install
RUN npm run build

# Set up server
WORKDIR /usr/src/server
COPY ./server .
RUN npm install
RUN npm run build
## Copy hsb files
RUN cp -r ./src/admin/views ./build/src/admin/views

## run the node process
CMD ["npm", "run", "prod"]