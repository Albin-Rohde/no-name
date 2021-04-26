# SERVER

## Tech
The backend consists of two parts, a websocket server and an express rest server. The entry point for the backend is `app.ts`.
The entrypoint to the rest server is `src/rest/server.ts`. Currently the rest server has 2 routes, game and user, 
which can be located under `src/rest/game/route.ts` and `src/rest/user/route.ts`. Both directories have a `services.ts`
file handling some of the logic for each request.

The entrypoint to the socket server is `src/socket/server.ts`. The server instance will register event-handlers that
will listen for events sent by the client and respond accordingly. The events are registered in `src/socket/events/register.ts`
and the event handlers are located inside the `src/socket/events/event-handler` directory. Most events will send a 
response back to the client, these responses are normalized and typed in `src/socket/events/response.ts`.

The app relies heavy on postgres for storing of game data. Database related logic is located in `src/db`. 
Models are located in `src/db/<domain>/models/<model>.ts` for example `src/db/game/models/Game.ts`.
Each model is a class and will act as an instance of a row in db. The class also contains some custom database layer logic.
Other database logic that can not live on a row instance are located in the domains `service.ts` file. For example 
`src/db/game/service.ts`. These functions are mostly related to getting/querying for data.

Both the rest server and socket server are using sessions for authentication, authentication middlewares can be found in
`src/rest/authenticate.ts` and `src/socket/authenticate.ts`.

