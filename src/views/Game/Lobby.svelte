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

<div class="main-grid">
  <Navbar on:logout={() => dispatch('logout')} username={gameClient.user.username}/>
  <div class="content-grid">
    <div class="left-column">
      <div class="players-header">
        <p class="fs-4">Players</p>
        <hr>
      </div>
      <div class="players">
        {#each gameClient.users as user}
            <p class="fs-5">{user.username}</p>
          {/each}
      </div>
    </div>
    <div class="inner-grid">
      <div class="flex-center">
        <p class="fs-3">Waiting for players ({gameClient.users.length}/{gameClient.playerLimit})</p>
      </div>
      <!-- 
      <div>
          {#each gameClient.users as user}
            {user.username}
          {/each}
        </div>
        <button class="btn btn-danger" on:click={deleteGame}>DELETE</button>
      -->
    </div>
  </div>
</div>

<style>
  .main-grid {
    height: 100vh;
    width: 100vw;
    grid-template-rows: 45px auto;
    grid-template-columns: 100%;
  }
  .content-grid {
    display: grid;
    grid-template-columns: 20% 60% 20%;
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

  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  
  .left-column {
    display: grid;
    grid-template-rows: 10% auto;
    max-width: 250px;
    height: 60%;
    margin-top: 20%;
    grid-column-start: 1;
    background-color: rgb(226, 226, 226);
    box-shadow: 0px 2px 5px rgb(124, 124, 124);
  }
  .left-column p {
    margin-left: 5%;
  }
  .players-header {
    grid-row-start: 1;
  }
  .players-header p{
    margin-bottom: 0;
  }
  .players {
    grid-row-start: 2;
  }
  .players p {
    margin: 0;
    padding: 0;
    margin-left: 5%;
    margin-bottom: 2%;
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