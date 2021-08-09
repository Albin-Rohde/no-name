# NO-NAME

## What is no-name
No-name is a project centered around the popular card game _Cards Against Humanity_. 
The project intend to make it possible to play _Cards Against Humanity_ online with friends even in the times of 
covid-19 and self-isolation. 

The idea to the project began when me and some friends tried playing cards against humanity online. We discovered a lot
of bugs on the website we played on. The experience was less than perfect to say the least. My partner Dessi Korths suggested that we
would build our own solution. The possibilities would then be to create our own "card decks", including internal jokes
in our group.

This was a fascinating idea and something that started teasing my brain, is it possible to build something like that?

A bit of investigation, a poc and a full year later to this day, here we are. Closing in on the final product.
More ideas and inovation has been brought in along the way. The though of making it possible for ANYONE to create
their own deck to use with their friend group, is probably one of the key features.


## Authour
My name is Albin Rohde. Coding has always been close to my heart and i started already in highschool with my 
"_gymnasieprojekt_" or _Highschool exams project_. Since then i have done numourus project. I started working 
as a programming teacher in 2017, got my first job as a backend developer 2019, Mentored a 
team and competed in robotics world championship 2019; and since 2021 i am working as a Backend Developer at advinans.

I like to have hobby projects running outside of work to get the oppertunity to try out tech that i dont get to try out otherwise. I am always looking for new ways to learn.


## Tech stack
This project consists of two parts; A Frontend and a Backend. These are called [`frontend`](./frontend/README.md) and [`server`](./server/README.md) in the repo. 

The frontend is developed with typescript using svelte. The frontend aims to be very minimalistic using bootstrap and very simple html components with straight forward css.

The backend is also developed in typescript. The backend uses an `express` server along with a `socket.io` server 
to handle websockets. The backend server acts both as a rest api (`express`) and a websocket server (`socket.io`).
Read more about the server [here](./server/README.md).


## Run the app

### Requirements
- development
  - node 14.16.1
  - docker
  - docker-compose
- deployment/live
  - docker
  - docker-compose
  - certbot

### Environments
Both dev production and live require environments variables to run.
These are stored and accessed from a `.env` file. to create them run:
- `cp frontend/.env.schema frontend/.env` # for development only
- `cp server/.env.schema server/.env` # for development only
- `cp .env.schema .env`

To run in live, there are some changes needed to the `.env` file, more on
that further down.

### Dev
- Run the following commands:
  - From root
    - `docker-compose up -d db redis`
  - From frontend root:
    - `npm run dev`
  - From server root:
    - `npm run typeorm migration:run`
    - `npm run dev`

- frontend will start on `http://localhost:3000`
- backend will start on `http://localhost:5000`
- In dev mode, the app will reload changes, the app does not need to be restarted between changes to source code.

### Production
- Run `docker-compose up`
- The app will now run on `http://app.localhost`, running the app like this is as close to the live set up as possible.
- Backend can be accessed on `http://app.localhost/api/<endpoint>`
- Log server can be accessed on `http://admin.localhost`

### Deploy live
Latest master is always running in live. If a new commit/push/merge occurs on 
the master branch. The app will reload (up to 1min) and host the new version.

The live version can be accessed on app.yobotics.club

### Live configuration
- Alter these lines in `.env` located in the root (same directory as this readme).
  ```
  API_BASE_URL=https://app.yobotics.club/api
  CLIENT_URL=https://app.yobotics.club
  NGINX_CONF_FILE=nginx.live.conf
  NGINX_STAGE=0
  dns_cloudflare_api_token=super_secret_token
  ```
- Then run `docker-compose up`
Note. Deploying live like this is only possible from the public ip `81.170.195.205`.
And the local router must be forwarding port `443` and `80` to the machines local address.
The `dns_cloudflare_api_token` is needed to retrieve and renew tsl/ssl certificate.

## How to play
Begin by signing up or signing in. When logged in one is greeted by the "dashboard", from here the player can create a
game with desired settings. When the game is created, invite some friends and hit start.

A black card consiting of a sentence with a "blank" will appear, vissible to all players.
The players will receive a couple of "white cards" consisting of word(s) or a short sentences. 
The goal now is for the player to match a white card on their hand with the black card; creating the funniest sentence.

One player each round will be assigned to the role as "card wizz". This player will not get to play any card.
This player will instead be tasked of voting for the funniest card.

Once all players has played their cards, the card wizz will get to flip one card at a time, reading them out loud.
When the card wizz has read all cards, he/she should decide on the funniest combination.

The winner is awarded 1 point and the gamw will continue to the next round, a new card wizz will be assigned for the
new round.

## Report Issues
Issues should be created on the github page for this repo https://github.com/albinr99salt/no-name/issues. Issues can also be reported to albin.rohde@notifyme.se
