<script lang="typescript">
  import { createEventDispatcher } from 'svelte'
  import type UserClientType from '../../clients/UserClient'
  import CreateGame from './CreateGame.svelte'
  import Dashboard from './Dashboard.svelte'
  import Lobby from './Lobby.svelte'
  import JoinGame from './JoinGame.svelte'
  import Navbar from '../../components/Navbar.svelte'
	import Ingame from './Ingame.svelte'
  import RestClient from '../../clients/RestClient'
  import SocketClient from '../../clients/SocketClient'
  const dispatch = createEventDispatcher()

  type views = 'dashboard' | 'ingame' | 'lobby' | 'join' | 'create'
  let view: views = 'dashboard'

  export let userClient: UserClientType
  let socket = new SocketClient(userClient.getData())


  const navigate = (location: views) => {
    view = location
  }

  const deleteGame = () => {
    const gameRestClient = new RestClient('/game')
    gameRestClient.makeRequest('delete')
    navigate('dashboard')
  }

  const rerender = (err: string | undefined = undefined) => {
    if(err) {
      console.log(err)
      view = 'dashboard'
      return
    }
    if (view !== 'ingame' && socket.game?.started) {
      view = 'ingame'
      return
    }
    if(view !== 'lobby' && socket.game?.key) {
      view = 'lobby'
    }
    socket = socket
  }

  const checkGameSession = async () => {
    try {
      await socket.connect(rerender)
      await socket.getGame()
    } catch (err) {
      console.error(err)
    }
  }

  if(!userClient.id) {
    dispatch('logout')
  } else {
    checkGameSession()
  }
  
  const onGameCreated = async (key: string) => {
    socket.joinGame(key)
  }

</script>

<div class="main-grid">
  <Navbar 
    username={socket.currentUser.username}
    gameActive={!!socket?.game?.key}
    on:logout={() => dispatch('logout')}
    on:delete-game={deleteGame}
  />
  {#if view === 'dashboard'}
    <Dashboard 
      on:logout={() => dispatch('logout')}
      on:create={() => navigate('create')}
      on:join={() => navigate('join')}
    />
  {/if}
  {#if view === 'create'}
    <CreateGame
      on:navigate-lobby={() => navigate('lobby')}
      onGameCreated={onGameCreated}
      on:abort={() => navigate('lobby')}
    />
  {/if}
    {#if view === 'lobby'}
    <Lobby 
      socket={socket}
      on:logout={() => dispatch('logout')}
      on:navigate-dashboard={() => navigate('dashboard')}
      on:abort={deleteGame}
    />
  {/if}
  {#if view === 'join'}
    <JoinGame 
      socket={socket}
      on:abort={deleteGame}
    />
  {/if}
  {#if view === 'ingame'}
    <Ingame socket={socket}/>
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