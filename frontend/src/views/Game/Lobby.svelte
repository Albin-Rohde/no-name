<script lang="typescript">
  import { createEventDispatcher } from 'svelte'
  import CopyTextField from '../../components/CopyTextField.svelte'
  import PlayerInfo from '../../components/PlayerInfo.svelte'
  import type SocketClient from '../../clients/SocketClient'
  import type {GameSocketResponse} from "../../clients/ResponseTypes";

  export let socket: SocketClient
  export let gameData: GameSocketResponse
  const dispatch = createEventDispatcher()

</script>

<div class="content-grid">
  <PlayerInfo gameData={gameData} />
  <div class="inner-grid">
    <div class="flex-center">
      <p class="fs-3">Waiting for players ({gameData.users.length}/{gameData.gameOptions.playerLimit})</p>
    </div>
    <div class="flex-center">
      <p class="fs-4">Invite players with the following key</p><br>
    </div>
    <div class="flex-center">
      <CopyTextField value={gameData.key} />
    </div>
    <div class="button-grid">
      <div class="form-container">
        <div class="btn-container">
          <button class="btn btn-danger" on:click={() => dispatch('abort')}>Delete</button>
          <button class="btn btn-success" on:click={socket.startGame}> Start </button>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .content-grid {
    display: grid;
    grid-template-columns: 20% 60% 20%;
    width: 100%;
    height: 80%;
  }
  .inner-grid {
    display: grid;
    grid-column-start: 2;
    grid-template-rows: 15% 5% 5% 75%;
    width: 100%;
    height: 100%;
  }

  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .btn {
    margin-top: 4%;
  }
  .button-grid {
    display: grid;
    width: 100%;
    height: 80%;
    grid-template-columns: 30% 40% 30%;
  }
  .form-container {
    grid-column-start: 2;
  }
  .btn-container {
    display: flex;
    justify-content: space-around;
    grid-column-start: 2;
    margin-top: 25%;
  }
</style>