<script lang="typescript">
  import { createEventDispatcher } from 'svelte'
  import type GameClientType from '../../clients/GameClient'
  import Navbar from '../../components/Navbar.svelte'

  export let gameClient: GameClientType
  const dispatch = createEventDispatcher()
  const deleteGame = () => {
    gameClient.deleteGame()
    dispatch('navigate-dashboard')
  }

</script>

<div class="content-grid">
  <div class="inner-grid">
    <div class="header">
      <h1>Create Game</h1>
    </div>
    <div class="form-container">
      <form>
        <div class="form-group">
          <label class="form-label" for="customRange2">Play cards</label>
          <div class="range">
            <input type="range" class="form-range" min="5" max="10" id="customRange2" bind:value={gameClient.playCards}/>
          </div>
          {gameClient.playCards}
        </div>
        <div class="form-group">
          <label class="form-label" for="customRange2">Rounds</label>
          <div class="range">
            <input type="range" class="form-range" min="3" max="20" id="customRange2" bind:value={gameClient.rounds}/>
          </div>
          {gameClient.rounds}
        </div>
        <div class="form-group">
          <label class="form-label" for="customRange2">Player limit</label>
          <div class="range">
            <input type="range" class="form-range" min="2" max="10" id="customRange2" bind:value={gameClient.playerLimit}/>
          </div>
          {gameClient.playerLimit}
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="private" checked={gameClient.private}>
          <label class="form-check-label" for="gridRadios1">
            Private
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="public" checked={!gameClient.private}>
          <label class="form-check-label" for="gridRadios2">
            Public
          </label>
        </div>
      </form>
      <div class="btn-container">
        <button class="btn btn-danger" on:click={deleteGame}>Abort</button>
        <button class="btn btn-success" on:click={() => dispatch('create-game')}>Create</button>
      </div>
    </div>
  </div>
</div>

<style>
  .content-grid {
    display: grid;
    grid-template-columns: auto 350px auto;
    width: 100%;
    height: 100%;
  }
  .inner-grid {
    display: grid;
    grid-column-start: 2;
    grid-template-rows: 15% 60% 25%;
    width: 100%;
    height: 100%;
  }
  .form-container {
    grid-row-start: 2;
    grid-row-end: 3;
    width: 100%;
    height: 100%;
  }
  .form-group {
    margin-top: 5%;
  }
  .btn {
    margin-top: 4%;
  }
  .btn-container {
    display: flex;
    justify-content: space-around;
  }
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
</style>