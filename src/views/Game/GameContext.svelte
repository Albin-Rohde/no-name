<script lang="typescript">
  import { createEventDispatcher } from 'svelte'
  import type UserClientType from '../../clients/UserClient'
  import CreateGame from './CreateGame.svelte'
  import Dashboard from './Dashboard.svelte'
  import GameClient from '../../clients/GameClient'
  import Lobby from './Lobby.svelte'
  import JoinGame from './JoinGame.svelte'
  import Navbar from '../../components/Navbar.svelte'
  
  export let userClient: UserClientType
  let view = 'dashboard'
  let gameClient = new GameClient(userClient.getData())
  const dispatch = createEventDispatcher()
  
  const navigate = (location) => {
    view = location
  }
  
  const deleteGame = () => {
    gameClient.deleteGame()
    navigate('dashboard')
  }

  const checkGameSession = async () => {
    try {
      await gameClient.getSessionGame()
      if(gameClient.key) {
        if(!gameClient.socketConnected) {
          gameClient.connectToGameSession(rerender)
        }
        view = 'lobby'
      }
    } catch(err) {}
  }
  
  if(!userClient.id) {
    dispatch('logout')
  } else {
    checkGameSession()
  }
  
  const rerender = (err: string | undefined = undefined) => {
    if(err) {
      return navigate('dashboard')
    }
    gameClient = gameClient
  }
  
  const createGame = async () => {
    try {
      await gameClient.createGame()
      gameClient.connectToGameSession(rerender)
      navigate('lobby')
    } catch(err) {
      navigate('dashboard')
    }
  }

  const joinGame = async () => {
    gameClient.connectToGameSession(rerender)
    navigate('lobby')
  }
</script>

<div class="main-grid">
  <Navbar on:logout={() => dispatch('logout')} username={gameClient.currentUser.username}/>
  {#if view === 'dashboard'}
    <Dashboard 
      gameClient={gameClient} 
      on:logout={() => dispatch('logout')}
      on:create={() => navigate('create')}
      on:join={() => navigate('join')}
    />
  {/if}
  {#if view === 'create'}
    <CreateGame
      on:navigate-lobby={() => navigate('lobby')}
      on:create-game={() => createGame()}
      on:abort={deleteGame}
      gameClient={gameClient} />
    {/if}
    {#if view === 'lobby'}
    <Lobby 
      gameClient={gameClient}
      on:logout={() => dispatch('logout')}
      on:navigate-dashboard={() => navigate('dashboard')}
      on:abort={deleteGame}
			on:start-game={gameClient.startGame}
    />
  {/if}
  {#if view === 'join'}
    <JoinGame 
      gameClient={gameClient}
      on:join={joinGame}
      on:abort={deleteGame}
    />
  {/if}
</div>

<style>
  .main-grid {
      display: grid;
      grid-template-columns: auto;
      grid-template-rows: 5% auto;
      width: 100vw;
      height: 100vh
    }
</style>