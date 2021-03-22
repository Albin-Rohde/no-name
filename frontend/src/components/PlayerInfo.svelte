<script lang="typescript">
  import type {GameResponse} from '../clients/ResponseTypes'
  export let gameData: GameResponse
</script>

<div class="column">
  <div class="players-header">
    <p class="fs-4">Players</p>
  </div>
  <div class="score-header">
    <p class="fs-4">Score</p>
  </div>
  <div class="divider">
    <hr>
  </div>
  <div class="players">
    <br>
    {#each gameData.users as user}
      <p class={user.cardWizz ? "fs-5 card-wizz" : "fs-5"}>{user.username}</p>
    {/each}
  </div>
  <div class="score">
    <br>
    {#each gameData.users as user}
      <p class="fs-5">0</p>
    {/each}
  </div>
</div>

<style>
  .column {
    display: grid;
    grid-template-rows: 5% 2% auto;
    grid-template-columns: 50% 50%;
    max-width: 250px;
    height: 60%;
    margin-top: 20%;
    grid-column-start: 1;
    background-color: rgb(226, 226, 226);
    box-shadow: 0px 2px 5px rgb(124, 124, 124);
  }
  .players-header {
    grid-row-start: 1;
    grid-column-start: 1;
  }
  
  .score-header {
    grid-row-start: 1;
    grid-column-start: 2;
  }

  .divider {
    grid-row-start: 2;
    grid-column-start: 1;
    grid-column-end: 3;
  }

  .players {
    grid-row-start: 3;
    grid-column-start: 1;
    grid-column-end: 2;
  }

  .score {
    grid-row-start: 3;
    grid-column-start: 2;
    grid-column-end: 3;
    margin-right: 40%;
    text-align: right;
  }

  .column p {
    margin-left: 5%;
  }
  .players-header p{
    margin-bottom: 0;
  }
  .players {
    grid-column-start: 1;
    grid-column-end: 2;
  }
	.card-wizz {
		font-weight: 600;
	}
</style>
