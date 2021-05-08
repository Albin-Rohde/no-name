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
- git clone <rep_url> - clones the repo
- run `docker-compose up` - builds and starts the containers
- will start app in production mode on port 80
- run docker-compose up -d redis db followed by npm run dev in both server and frontend
to run app in dev mode.

The server will be started on localhost:5000, the frontend on localhost:3000 and postgres can be accessed at localhost:5432


## How to play
The game is not yet in a stage where it can be played, this section of the redme will be filled out later.


## Report Issues
Issues should be created on the github page for this repo https://github.com/albinr99salt/no-name/issues. Issues can also be reported to albin.rohde@notifyme.se


