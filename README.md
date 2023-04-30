# NO-NAME

### What is no-name
No-name is a project centered around the popular card game _Cards Against Humanity_. 
The project intend to make it possible to play _Cards Against Humanity_ online with friends.


### Developing this project
To contribute to this project follow the instructing in [Development.md](./Development.md)
to get started.


### Key features
- Playing _Cards Against Humanity_ online
- Easy to get going
- Easy to invite friends

### Features coming up
- Creating your own card deck

### Running
This project has a Docker image that can be used to run the app in production environment.
Easiest is to use docker-compose. A compose file could look something like this:
```yaml
networks:
  local:
    driver: bridge

services:
  no-name:
    container_name: no-name
    image: ghcr.io/albin-rohde/no-name_app:latest
    ports:
      - 5000:5000
    restart: unless-stopped
    networks:
      - local
    depends_on:
      - pg_db
      - redis
    environment:
      - PORT=5000
      - COOKIE_SECRET="some-secret"
      - CLIENT_URL="https://example.com"
      - POSTGRES_HOST=pg_db
      - POSTGRES_PORT=5432
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=no_name_db

  pg_db:
    container_name: pg_db
    image: postgres
    restart: unless-stopped
    networks:
      - local
    ports:
      - 5432:5432
    environment:
      - POSTGRES_PORT=5432
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=no_name_db

  redis:
    container_name: redis
    image: "redis:alpine"
    command: redis-server
    networks:
      - local
    ports:
      - 6379:6379
    environment:
      - REDIS_REPLICATION_MODE=master
```

### How to play
Begin by signing up or signing in. When logged in one is greeted by the "dashboard", from here the player can create a
game with desired settings. When the game is created, invite some friends and hit start.

A black card consisting of a sentence with a "blank" will appear, visible to all players.
The players will receive a couple of "white cards" consisting of word(s) or a short sentences. 
The goal now is for the player to match a white card on their hand with the black card; creating the funniest sentence.

One player each round will be assigned to the role as "card wizz". This player will not get to play any card.
This player will instead be tasked of voting for the funniest card.

Once all players has played their cards, the card wizz will get to flip one card at a time, reading them out loud.
When the card wizz has read all cards, he/she should decide on the funniest combination.

The winner is awarded 1 point and the gamw will continue to the next round, a new card wizz will be assigned for the
new round.
