<script lang="typescript">
  import { createEventDispatcher } from 'svelte'
  import type UserClientType from '../../clients/UserClient'
  import CreateGame from './CreateGame.svelte'
  import Dashboard from './Dashboard.svelte'
  import GameClient from '../../clients/GameClient'
  
  export let userClient: UserClientType
  let view = 'dashboard'
  const gameClient = new GameClient(userClient)
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
        view = 'lobby'
      }
    } catch(err) {}
  }

  if(!userClient.id) {
    dispatch('logout')
  } else {
    checkGameSession()
  }

</script>

<div>
  {#if view === 'dashboard'}
    <Dashboard 
      gameClient={gameClient} 
      on:logout={() => dispatch('logout')}
      on:create={() => navigate('create')}
    />
  {/if}
  {#if view === 'create'}
    <CreateGame
    on:navigate-lobby={() => navigate('lobby')}
    on:navigate-dashboard={() => navigate('dashboard')} 
    gameClient={gameClient} />
  {/if}
  {#if view === 'lobby'}
    <div>
      <h1>Welcome to game lobby</h1>
      <h1>game key: {gameClient.key}</h1>
      <button class="btn btn-danger" on:click={deleteGame}>DELETE</button>
    </div>
  {/if}
</div>

<style>

</style>