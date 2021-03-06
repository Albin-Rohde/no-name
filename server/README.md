# SERVER

## Tech
The server is using express as its rest api and socket.io as websocket server. app.ts is the entrypoint where these two instances are created. The stages before a game is created and started is mainly handeled by express in restfull endpoints. These can be found in each domains `route` file. E.g `src/user/route.ts`. The actual logic mostly lives in the domains `services` file i.e `src/user/service.ts`.

The server is using `express-session` to keep track of sessions and who is doing each request. On top of that there are a few middlewares localted in `src/authenticate.ts` responisble of checking if the user is properly logged in; before allowing them to continue with there action. In the authenticate middleware we also make sure to replace the json representation of a user with a typeorm instance of the user, making it possible to to database actions on the user later on in the request.

All responses from the websocket events are normalized in `src/game/normalieResponse.ts`. Making it easy for frontend to understand the data.

The server uses `typeorm` as orm mapper, each data model can be found in each domains `models` dir. i.e `/src/user/models/User.ts`.

