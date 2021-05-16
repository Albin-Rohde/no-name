<script lang="typescript">
  import { createEventDispatcher } from 'svelte'
  import type {SocketClient} from '../../clients/SocketClient'

  export let socket: SocketClient
  const dispatch = createEventDispatcher()
  let gameKey: string
</script>

<div class="content-grid">
  <div class="header">
    <p class="fs-2">Join Game</p>
  </div>
  <div class="form-container">
    <form>
      <div class="form-group">
        <label class="form-label" for="customRange2">Enter game Key</label>
        <input type="text" class="form-control" placeholder="Enter game key" bind:value={gameKey}>
      </div>
    </form>
    <div class="btn-wrapper">
      <div class="btn-container">
        <button class="btn btn-danger" on:click={() => dispatch('abort')}>Abort</button>
        <button class="btn btn-success" on:click={() => socket.joinGame(gameKey)}>Join game</button>
      </div>
    </div>
  </div>
</div>

<style>
  .content-grid {
    display: grid;
    grid-template-columns: 30% 40% 30%;
    grid-template-rows: 50% auto;
    width: 100%;
    height: 90%;
  }
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    grid-column-start: 2;
  }
  .form-container {
    grid-column-start: 2;
    grid-row-start: 2;
  }
  .btn-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .btn-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 60%;
  }
</style>
