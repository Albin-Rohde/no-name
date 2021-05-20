# NO-NAME

## What is no-name
No-name is an open source project centered around the popular card game _Cards Against Humanity_. This intend to make it possible to play _Cards Against Humanity_ online with friends even in the times ov covid-19 and isolation. 

No-name sprung to life almost a full year ago where a poc where developed. The poc was built with nodejs and mongodb as its database. It became clear that a project like this would benefit a lot more from a sequal databse. I also decided to go with typescript as supose to regular node. 

The goal of this project is to make it easy to understand and start playing the game with friends, so far the project is in very early stages and it is not possible to play it.


## Authour
My name is Albin Rohde. Coding has always been close to my heart and i started already in highschool with my "_gymnasieprojekt_" or _Highschool exams project_. Since then i have done numourus project. I started working as a programming teacher in 2017, got my first job as a backend developer 2019, Mentored a team and competed in robotics world championship 2019; and since 2021 i am working as a Backend Developer at advinans.

I like to have hobby projects running outside of work to get the oppertunity to try out tech that i dont get to try out otherwise. I am always looking for new ways to learn.


## Tech stack
This project consists of two parts; A Frontend and a Backend. These are called [`frontend`](./frontend/README.md) and [`server`](./server/README.md) in the repo. 

The frontend is developed with typescript using svelte. The frontend aims to be very minimalistic using bootstrap and very simple html components with straigh forward css.

The backend is also developed in typescript. The backend uses an `express` server along with a `socket.io` server 
to handle websockets. The backend server acts both as a rest api (`express`) and a websocket server (`socket.io`). 
Since the game relies on live actions between multiple players, websocket where the obvious desicion. 
The backend use `postgres` as its database, and `typeorm` as orm mapper. Read more about the server [here](./server/README.md).


## How to start the app
### Production mode
- First, make sure the file `.env.docker` contains the content of `.env.docker.schema`.

- Then run the following from root directory.
  - `docker-compose up db redis frontend server`
- frontend will start on `http://localhost:3000`
- backend will start on `http://localhost:5000`

### Dev mode
- First make sure the file `/frontend/.env` contains the content of `/frontend/.env.schema`
- and that the file `server/.env` contains the content of `/server/.env.schema`.

- Then run the following commands:
  - From root
    - `docker-compose up -d db redis`
  - From frontend root:
    - `npm run dev`
  - From server root:
    - `npm run typeorm migration:run`
    - `npm run dev`

- frontend will start on `localhost:3000`
- backend will start on `localhost:5000`
- In dev mode, the app will reload changes, the app does not need to be restarted between changes.

### Deploy live
- First, make sure the file `.env.docker` contains the content of `.env.docker.schema`.
- Alter these lines in `.env.docker`
  ```
  API_EXTENSION=/api
  API_BASE_URL=https://yobotics.club
  PORT=5000
  CLIENT_URL=https://yobotics.club
  ```
- Then run following command from root:
  - `docker-compose up`
- Provided that port forwarding is enabled, the server will be reached on `yobotics.club`


## How to play
The game is not yet in a stage where it can be played, this section of the readme will be filled out later.


## Report Issues
Issues should be created on the github page for this repo https://github.com/albinr99salt/no-name/issues. Issues can also be reported to albin.rohde@notifyme.se


