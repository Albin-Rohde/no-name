# Set up project

## Init the project
Before starting the project, make sure npm, node, docker and docker-compose is installed.
requirements:
- node 14.16.1
- docker
- docker-compose 1.25^

copy and paset this into your terminal:
```shell
git clone git@github.com:Albin-Rohde/no-name.git
&& cd ./no-name
&& chmod +x init.sh
&& ./init.sh
```
This will install all dependencies and pull the required docker images.

---
## Starting in development mode
1. Start databases

    This app use redis and postgres as databases, these should be running before starting the app
    ```shell
    docker-compose up -d
    ```
2. Run migrations

    To create all tables in the postgres database this app uses migrations. 
    Run all migrations before starting the app.
    ```shell
    cd ./server && npm run migration:run
    ```
3. Start Frontend
    Start the frontend app in development mode will make it auto reload on changes
    ```shell
    cd ./frontedn && npm run dev
    ```
4. Start backend
    Start the backend in development mode will make it auto reload on changes.
    ```shell
    cd ./server && npm run dev
    ```

Frontend and backend can now be accessed on:
- Frontend - https://localhost:3000
- Backend - https://localhost:5000

---
### Creating new migration
To create new migration, first make the changes to the model(s). When you are happy with the alterations 
go to server root (`./server`) and run `npm run migration:generate`. This will create a migration in `server/src/migrations`. 
Check that it looks correct and make changes if needed. When happy apply the migrations by running either `make migrate` or
`npm run migration:run`.

### Reverting migration
To revert a migration run `npm run migration:revert` from server root (`./server`).

---
## Commands cheat sheet
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
