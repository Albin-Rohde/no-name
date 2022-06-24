# Set up project

## Init the project
Before starting the project, make sure npm, node, docker and docker-compose is installed.
requirements:
- node 14.16.1
- docker
- docker-compose 1.25^

Along with this project is a Makefile. The most common commands are located in the makefile to make it easier to 
getting started.
When requirements are met run `make init` from root.
This will prepare everything that's needed in order to run the project.
`make init` will copy all .env files to correct directories and pull/build all docker images for the dev environment.

---
## Starting in development mode
Development mode will spin up backend(server) and frontend with autoreload to make development as easy as possible.
easiest way to start project in development mode is to run `make dev`.
Frontend and backend are started behind a nginx layer and can be accessed on:
- Frontend - https://localhost
- Backend - https://api.localhost
- postgres will start on localhost:5432

---
## Starting in production mode
Production mode spins up everything, including grafana graylog etc.
Spinning up in production mode is a great way to test that everything works as expected locally before merge to master.

Easiest way to start in production mode is with make commands. First run `make prod-build` to build production 
docker images, followed by `make prod` to start everything.
- Frontend will start on https://localhost
- Backend will start on https://api.localhost
- Admin will start on https://admin.localhost
- graylog will start on https://logs.localhost
- grafana will start on https://grafana.localhost

if db is not up to date, one can run migrations with `make prod-migrate`.
Note that in order to trust the self signed certificate it is recomended to visit https://api.localhost once and "accepting" the site in browser before using the frontend to login etc. It is likely that the browser will block trafic from frontend to backend until this is done.

---
## Starting app for live enviroment
Some additional steps are required to start app for live environment.
- Get the `.env` file for live from 1password and put it in the root of this repo.
- Make sure to set up correct port forwarding.
- Make sure the cloudlfare DNS it pointing towards your public IP.
- Build the live version of docker images with `make live-build`.
- Generate SSL certificates with certbot with `make cert`
- When certbot is done and images are built run `make prod` to start everything.

---
## Migration
### Running migrations
Whenever there are changes to the database schema/tables one will need to run the migrations.
Easiest way to run the migrations are yet again through make command. `make migrate`.
`make migrate` will use `.ts` migrations from `./server/src/migrations`.

### Creating new migration
To create new migration, first make the changes to the model(s). When you are happy with the alterations 
go to server root (`./server`) and run `npm run migration:generate`. This will create a migration in `server/src/migrations`. 
Check that it looks correct and make changes if needed. When happy apply the migrations by running either `make migrate` or
`npm run migration:run`.

### Reverting migration
To revert a migration run `npm run migration:revert` from server root (`./server`).

---
## Running app outside docker
It is possible to run the app outside of docker, however the database and redis is easier to run through docker.
First you need to alter the db and redis host in the `.env` file in the server root (`./server`).
Replace `redis` and `db` with `localhost` respectively. Additionally the url the app expects to find frontend 
and backend on will have to be updated since they won't be running behind nginx. 
```
POSTGRES_HOST=localhost
REDIS_HOST=localhost
CLIENT_URL=localhost:3000
REACT_APP_API_BASE_URL=localhost:5000
REACT_APP_SOCKET_BASE_URL=localhost:5000
REACT_APP_CLIENT_URL=localhost:3000
```
Start the db and redis with docker `docker-compose up db redis`.
Start the server on host go to server root (`./server`) and run `npm run dev`.
Start the frontend on host go to frontend root (`./frontend`) and run `npm run dev`.

---
## Commands cheat sheet
| Make command        | Description                                           |
|---------------------|-------------------------------------------------------|
| `make init`         | Set ups the project                                   |
| `make dev`          | Starts the app in development mode                    |
| `make stop`         | Stops the app from dev mode (compose stop)            |
| `make migrate`      | Runs migration in dev container (dev must be running) |
| `make prod-build`   | Build the production images                           |
| `make prod`         | Starts the app in production mode                     |
| `make prod-migrate` | Migrates from within production container             |

| Server commans                                    | Description                   |
|---------------------------------------------------|-------------------------------|
| `npm run dev`                                     | Run server in dev mode        |
| `npm run prod`                                    | Run server in prod mode       |
| `npm run migration:run`                           | Runs migration from ts source |
| `npm run migration:revert`                        | Revert last migration         |
| `npm run migration-prod:run`                      | Runs migration from build js  |
| `npm run typeorm migration:generate -- -n <name>` | Creates a new migration       |

| Frontend commans | Description                                 |
|------------------|---------------------------------------------|
| `npm run dev`    | Run frontend in dev mode                    |
| `npm run build`  | Builds a build bundle to serve in prod mdoe |
| `npm run prod`   | Run frontend in prod mode                   |
