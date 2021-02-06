<script lang="typescript">
  import { createEventDispatcher } from 'svelte'
  import type UserClientType from '../../clients/UserClient'
  import CreateGame from './CreateGame.svelte'
  import Dashboard from './Dashboard.svelte'
  import GameClient from '../../clients/GameClient'
import Lobby from './Lobby.svelte'
  
  export let userClient: UserClientType
  let view = 'dashboard'
  let gameClient = new GameClient(userClient)
  const dispatch = createEventDispatcher()
  
  const navigate = (location) => {
    view = location
  }
  
  const deleteGame = async () => {
    await gameClient.deleteGame()
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
  
  const rerender = () => {
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

<div>
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
    gameClient={gameClient} />
  {/if}
  {#if view === 'lobby'}
    <Lobby 
      gameClient={gameClient}
      on:logout={() => dispatch('logout')}
      on:navigate-dashboard={() => navigate('dashboard')}
    />
  {/if}
  {#if view === 'join'}
    <div class="form-container">
      <form>
        <div class="form-group">
          <label class="form-label" for="customRange2">Enter game Key</label>
          <input type="text" class="form-control" placeholder="Enter game key" bind:value={gameClient.key}>
        </div>
      </form>
      <button class="btn btn-danger" on:click={joinGame}>Join game</button>
    </div>
  {/if}
</div>

<style>

</style>