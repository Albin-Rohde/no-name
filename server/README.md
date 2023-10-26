# Server

## File structure
The backend consists of two parts, a websocket server and an express rest
server. The entry point for the backend is [index.ts](./src/index.ts).
Routing, both for rest endpoints and websocket listeners are registered
in [routing.ts](./src/routing.ts).

Custom middlewares are defined in [middlewares.ts](./src/middlewares.ts).
In this file both express rest middlewares and socket.io middlewares are defined.

### Domains
The source code is divided into different domains such as `user`, `game` etc.
Each of these domains define their own endpoints, database models and business
logic. Endpoints are defined in `controllers.ts`, business logic in `services.ts`,
database models in `models/<model-name>.ts`, websocket event-listeners in `events.ts`.
The files in the `game` domain are described bellow
```
├── game
│   ├── controller.ts // rest endpoints
│   ├── schema.ts // schema validation for rest payload
│   ├── events.ts // websocket listeners
│   ├── services.ts // business logic for game
│   ├── models
│   │   ├── Game.ts // Database model for Game entity
```

## Examples
### Create new domain
Let's say we'd want to store users high score from different games. This would
be a suitable feature to have in a new domain. To create a new domain we need
to create a few files and folder. first we'll create a new folder under `/src`
called `high-score`. Then we'll create a models folder to store our database
model definitions.
```
src/
├── high-score/
│   ├── models/
```
### Models
To keep track of users high-score we'll need a new database model/table.

1. Define the new model
    
    We'll create a new file `src/high-score/models/HighScore.ts`. In this file
    we'll define the HighScore table which will store some data.
    ```typescript
    @Entity({name: 'high_score'})
    @Index(['id', 'user_id_fk'], {unique: true})

    export class HighScore extends BaseEntity {
      @PrimaryGeneratedColumn()
      id: string

      @OneToOne(type => User, user => user.highScore)
      @JoinColumn({name: 'user_id_fk'})
      user: User

      @Column()
      score: number
    }
    ```
2. Update referenced models
    since we added a relation from highScore to user, and described the
    relationship back from user to highScore as `user.highScore` we'll need to
    update the `User` model as well before we can create any migrations.
    ```typescript
    export class User extends BaseEntity {
        ...
        @OneToOne(type => HighScore, highScore => highScore.user)
        highScore: HighScore
        ...
    }
    ```
3. Create and run migrations

    now we can create a migration for this new table
    `npm run typeorm migration:generate -- -n AddHighScoreTable`. Next we can
    run the migration to update the database `npm run migration:run`. The
    database will now have a new table called `high_score`.

### Register new rest route
Let's say we want to retrieve high score data based from an endpoint based on
a users id.
1. Define a method the retrieve the highScore model in `src/high-score/services.ts`
    ```typescript
   export const getHighScoreByUserId = async (id: number): HighScore => {
      const highScore = await HighScore.findOneOrFail({where: {user_id_fk: id}})
      return highScore;
   }
    ```
2. Define a schema to validate the rest payload/query in `src/high-score/schema.ts`
    ```typescript
    export const getByUserSchema = yup.object({
      userId: yup.number().required(),
    });
    export interface getByUserInput extends yup.Asserts<typeof getByUserSchema> {}
    ```
    With this we can validate the payload or query that express receives,
    Additionally we'll get a validation error if it fails, that we can
    send back to the requester.
3. Create the endpoint in `src/high-score/controller.ts`

    First we'll need a new router for this domains rest handlers,
   then we can define our first endpoint
    ```typescript
    const highScoreRouter = Router()
    highScoreRouter.use(loginRequired) // will require the requester to be logged in to use this router
    router.get('/user/:userId', (req: Request, res: Response) => {
      try { // we need to try catch this in case anything would fail
        const { userId } = getByUserSchema.validateSync(req.params);
        const highScore = getHighScoreByUserId(userId);
        const response: RestResponse<HighScore> = {
          ok: true,
          err: null,
          data: highScore,
        };
        return res.json(response)
      } catch (err) {
        handleRestError(req, res, err) // takes care of logging and sending error response to requester
      }
    })
    export default highScoreRouter
    ```
4. Register the router

    In order for the express server to route traffic to this new endpoint we'll
    need to register the `highScoreRouter` on the express app. This is done in
    `/src/routing.ts`
    ```typescript
    function registerRoutes(app: Application): void {
    ...
    const apiRouter = Router();
    apiRouter.use('/user', userRoute);
    ...
    apiRouter.use('/highscore', highScoreRouter);
    ...
    app.use('/api', apiRouter)
    }
    ```
    Our new endpoint will now be routed on `/api/highscore/user/<id>`.

dummy test