# NO-NAME

### What is no-name
No-name is a project centered around the popular card game _Cards Against Humanity_. 
The project intend to make it possible to play _Cards Against Humanity_ online with friends.


### Getting started
Clone this repo and follow the steps in [set-up-project](./set-up-project.md) to get started with development.


### Key features
- Playing _Cards Against Humanity_ online
- Easy to get going
- Easy to invite friends

### Features coming up
- Creating your own card deck

### Tech stack
This project consists of two parts; A Frontend and a Backend. These are called [`frontend`](./frontend/README.md) and [`server`](./server/README.md) in the repo.

The frontend is a react typescript project with material ui for most of the components. 
It uses redux as store for state management. Read more about the frontend [here](./frontend/README.md)

The backend is developed in typescript using `express` and `socket-io` as rest and socket frameworks/lib.
Read more about the server [here](./server/README.md).


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
