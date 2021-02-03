<script lang="typescript">
  import { createEventDispatcher } from 'svelte'
  import type gameClientType from '../../clients/GameClient'
  import Navbar from '../../components/Navbar.svelte'
  
  export let gameClient: gameClientType
  const dispatch = createEventDispatcher()

</script>

<div class="main-grid">
  <Navbar on:logout={() => dispatch('logout')} username={gameClient.user.username}/>
  <div class="middle">
    <h1>No name-game</h1>
  </div>
  <div class="bottom">
    <div class="button-conatiner start">
      <button class="btn btn-primary" on:click={() => dispatch('create')}>Create Game</button>
    </div>
    <div class="button-conatiner join">
      <button class="btn btn-success" on:click={() => dispatch('join')}>Join Game</button>
    </div>
  </div>
</div>

<style>
  .main-grid {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 5% 65% 30%;
    width: 100vw;
    height: 100vh
  }
  .middle {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .bottom {
    display: grid;
    grid-template-columns: 35% 15% 15% 35%;
    grid-template-rows: 30% 70%;
  }
  .button-conatiner {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .start{
    grid-row-start: 1;
    grid-column-start: 2;
  }
  .join {
    grid-row-start: 1;
    grid-column-start: 3;
  }
</style>