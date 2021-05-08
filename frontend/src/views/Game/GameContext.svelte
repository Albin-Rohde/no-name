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
  import { SocketClient } from '../../clients/SocketClient'
  import type {GameSocketResponse, UserResponse} from "../../clients/ResponseTypes";
  const dispatch = createEventDispatcher()

  type views = 'dashboard' | 'ingame' | 'lobby' | 'join' | 'create'
  let view: views = 'dashboard'

  export let userClient: UserClientType
  const socket = new SocketClient(process.env.API_URL, userClient.getData())

  let gameData: GameSocketResponse
  let currentUser: UserResponse = userClient.getData()

  const navigate = (location: views) => {
    view = location
  }

  const deleteGame = () => {
    console.log('del game', process.env.API_URL)
    const gameRestClient = new RestClient(process.env.API_URL, '/game')
    gameRestClient.makeRequest('delete')
    navigate('dashboard')
  }

  const leaveGame = () => {
    socket.leaveGame()
    navigate('dashboard')
  }

  const rerender = (err: string | undefined = undefined) => {
    if(err) {
      console.error(err)
      view = 'dashboard'
      return
    }
    if (view !== 'ingame' && socket.game?.started) {
      view = 'ingame'
    }
    else if(view !== 'lobby' && socket.game?.key && !socket.game.started) {
      view = 'lobby'
    }
    gameData = socket.game
    currentUser = socket.currentUser
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
    username={currentUser.username}
    isHost={currentUser.isHost}
    gameActive={!!gameData?.key}
    on:logout={() => dispatch('logout')}
    on:delete-game={deleteGame}
    on:leave-game={leaveGame}
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
      on:abort={() => navigate('dashboard')}
    />
  {/if}
    {#if view === 'lobby' && gameData?.key}
    <Lobby
      gameData={gameData}
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
  {#if view === 'ingame' && gameData?.key}
    <Ingame
      socket={socket}
      gameData={gameData}
      currentUser={currentUser}
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
