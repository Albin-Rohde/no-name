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
`make init` will copy all .env files to correct directories and pull/build all docker images.

## Starting in development mode
Development mode will spin up backend(server) and frontend with autoreload to make development as easy as possible.
easiest way to start project in development mode is to run `make dev`.
- Frontend will start on localhost:3000
- Backend will start on localhost:5000
- postgres will start on localhost:5432

After starting the app for the first time you will want to run the migrations
`make migrate`

## Starting in production mode
Production mode spins up everything behind nginx, this is the exact same setup as the live server.
Spinning up in production mode is a great way to test that everything works as expected locally before merge to master.

Easiest way to start in production mode is with the make command `make prod`.
- Frontend will start on localhost
- Backend will start on localhost/api
- graylog will start on logs.localhost
- grafana will start on grafana.localhost
if db is not up to date, one can run migrations with `make prod-migrate`.

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

## Running app outside docker
It is possible to run the app outside of docker, however the database is easiest ran through docker.
To start the server on host go to server root (`./server`) and run `npm run dev`.
To start the frontend on host go to frontend root (`./frontend`) and run `npm run dev`


## Commands cheat sheet
| Make command                | Description                                        |
|-----------------------------|----------------------------------------------------|
| `make init`                 | Set ups the project                                |
| `make dev`                  | Starts the app in development mode                 |
| `make dev-stop`             | Stops the app from dev mode (compose stop)         |
| `make migrate`              | Runs migration from ts source                      |
| `make prod-build`           | Build the production images                        |
| `make prod-up`              | Starts the app in production mode                  |
| `make prod-migrate`         | Migrates from within production container          |
| `make prod`                 | prod-build + prod-up + prod-migrate, in that order |

| Server commans              | Description                         |
|---|-------------------------------------|
| `npm run migration:run`     | Runs migration from ts source       |
| `npm run migration:revert`  | Revert last migration               |
| `npm run migration:generate` | Creates a new migration             |
| `npm run migration-prod:run` | Runs migration from build js source |