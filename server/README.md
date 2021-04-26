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

