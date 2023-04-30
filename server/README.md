# SERVER

## Tech
The backend consists of two parts, a websocket server and an express rest server. The entry point for the backend is [app.ts](./src/app.ts)
The entrypoint to the rest server is [`src/rest/server.ts`](./src/rest/server.ts). Currently, the rest server has 2 routers,
[game](./src/rest/game/route.ts) and [user](./src/rest/user/route.ts). Both directories have a `services.ts`
file handling some of the logic for each request. such as [`game/services.ts`](./src/rest/game/services.ts) 
or [`user/services.ts`](./src/rest/user/services.ts).

The entrypoint to the socket server is [`src/socket/server.ts`](./src/socket/server.ts). 
The server instance will register event-handlers that will listen for events sent by the client and 
respond accordingly. The events are registered in [register.ts](./src/socket/events/register.ts) and the event handlers are 
located inside the [event-handler](./src/socket/events/event-handler) directory. Most events will send a 
response back to the client, these responses are normalized and typed in [response.ts](./src/socket/events/response.ts).

The app relies heavy on postgres for storing of game data. Database related logic is located in [`src/db`](./src/db). 
Models are located in `src/db/<domain>/models/<model>.ts` for example the [Game](./src/db/game/models/Game.ts) model.
Each model is a class and will act as an instance of a row in db. The class also contains some custom database layer logic.
Other database logic that can not live on a row instance are located in the domains `service.ts` file, 
For example the Game [service.ts](./src/db/game/services.ts) file. These functions are mostly related to getting/querying for data.

Both the rest server and socket server are using sessions for authentication, authentication middlewares can be found in
`src/rest/authenticate.ts` and `src/socket/authenticate.ts`.


## Migrations
Run all migrations:
- `npm run migration:run`

Add new migration
- Alter Models in source code
- Build `npm run build`
- Create migration `npm run typeorm migration:generate -- -n <NameOfMigration>`
- Check/alter migration so that it looks correct
- Migrations are created in .ts, so we need to build `npm run build`
- Now we can run our new migration `npm run migration:run`
- Always test that the revert also works as expected `npm run migration:revert`

## Coding guidelines
This backend server is built with the MVC design pattern in mind. Read more about it here https://help.hcltechsw.com/commerce/9.1.0/developer/concepts/csdmvcdespat.html

#### Domain
Each domain should have its ORM-mapper models contained within the domains `models` folder. Only models bound
to the domain should live inside the domain.

In addition, the Domain should handle its rest-server logic within the domain, in a file called `controller.ts`
since it is the control interface for that specific domain. Events that can happen due to socket-events should
live int the `events.ts` file of the domain. The events and controller should only hold functionality directly 
affecting the domain or underlying Domain Models.

#### Models
Models are the link between the Domain and database. These should be contained in the `models` folder of the domain.
Models are mutable but as a principle the should only be manipulated or mutated within the domain, either via 
working directly on the domain, or via services methods. Models should not have methods that manipulate itself.
These should rather live as a service method. Models are however allowed to have hybrid properties, getters 
and setters if necessary.

#### Services
Services are where we put general handlers for a domain, or crud methods for the domains models.
