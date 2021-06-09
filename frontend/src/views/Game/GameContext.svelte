<script lang="typescript">
  import { createEventDispatcher } from 'svelte'
  import type userType from '../../clients/User'
  import CreateGame from './CreateGame.svelte'
  import Dashboard from './Dashboard.svelte'
  import Lobby from './Lobby.svelte'
  import JoinGame from './JoinGame.svelte'
  import Navbar from '../../components/Navbar.svelte'
  import Ingame from './Ingame.svelte'
  import { SocketClient } from '../../clients/SocketClient'
  import type {UserResponse} from "../../clients/ResponseTypes";
  import Game from "../../clients/Game";
  const dispatch = createEventDispatcher()

  type views = 'dashboard' | 'ingame' | 'lobby' | 'join' | 'create'
  let view: views = 'dashboard'

  export let user: userType
  let socket = new SocketClient(user.getData())

  let gameData: Game
  let currentUser: UserResponse = user.getData()

  const navigate = (location: views) => {
    view = location
  }

  const deleteGame = () => {
    socket.deleteGame()
    navigate('dashboard')
  }

  const leaveGame = () => {
    socket.leaveGame()
    navigate('dashboard')
  }

  const rerender = async (disconnect: boolean = false): Promise<void> => {
    if (disconnect) {
      gameData = undefined
      socket = new SocketClient(user.getData())
      await socket.connect(rerender)
      view = 'dashboard'
      return
    }
    gameData = socket.gameData
    if (view !== 'ingame' && gameData.started) {
      view = 'ingame'
    }
    else if(view !== 'lobby' && gameData.key && !gameData.started) {
      view = 'lobby'
    }
    currentUser = gameData.currentUser
  }

  const checkGameSession = async () => {
    try {
      await socket.connect(rerender)
      await socket.getGame()
    } catch (err) {
      console.error(err)
    }
  }

  if(!user.id) {
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
    currentRound={gameData?.currentRound}
    totalRounds={gameData?.gameOptions.rounds}
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
