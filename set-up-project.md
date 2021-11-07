# Set up project

### Requirements
- development
  - node 14.16.1
  - docker
  - docker-compose
- production
  - docker
  - docker-compose
  - certbot
  - certbot plugin dns_cloudflare


### Step 1 - Set up .env files
Both dev production and live require environments variables to run.
These are stored and accessed from a `.env` file. to create them run:
- `cp frontend/.env.schema frontend/.env` # for development only
- `cp server/.env.schema server/.env` # for development only
- `cp .env.schema .env`

### Step 2 - install dependencies
To run the app both frontend and server dependencies need 
to be installed.
- from `./frontned` run `npm install`
- from `./server` run `npm install`

### Step 3 - init db and run migrations
In this project the db is always intended to run in docker.
Start by starting the pg instance and then run the migrations
from server.
- `docker-compose up -d db`
- from server root `npm run build && npm run migrate:latest`

### Step 4 - start the app
Running the app in development mode in not done through docker.
The database and redis instance will run in docker, but the actual
services themselves will run on the host system.
- Make sure postgresql and redis is running `docker-compose up -d db redis`
- Start frontend by running `npm run start` from frontend root.
- Start server by running `npm run dev` from server root.

frontend will start on `http://localhost:3000`\
backend will start on `http://localhost:5000`\
In dev mode, the app will reload changes, the app does not need to be restarted between changes to source code.


### Step 5 - start the app in production mode
- Run `docker-compose build && docker-compose up`
- The app will now run on `http://app.localhost`, running the app like this is as close to the live set up as possible.
- Backend can be accessed on `http://app.localhost/api/<endpoint>`
