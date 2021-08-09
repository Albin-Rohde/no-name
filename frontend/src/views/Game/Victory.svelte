<script lang="typescript">
  import { createEventDispatcher } from 'svelte'
  import type { SocketClient } from '../../clients/SocketClient'
  import Game from "../../clients/Game";

  export let socket: SocketClient
  export let gameData: Game
  const dispatch = createEventDispatcher()

  let i = 1
  const sortedPlayer = gameData.users.sort((a,b) => b.score - a.score)
  const top3 = sortedPlayer.slice(0,3)
  const bellow3 = sortedPlayer.slice(3)
</script>

<div class="content-grid">
  <div class="inner-grid">
    <div class="flex-center game-over">
      <h1 class="game-over-text">Score</h1>
    </div>
    <div class="ranking">
      {#each top3 as player}
        <div class="flex-center">
          <p class={`fs-${i}`}><b>{i++}.</b> {player.username} {player.score}pts.</p>
        </div>
      {/each}
      {#each bellow3 as player}
        <div class="flex-center">
          <p class="fs-4"><b>{i++}.</b> {player.username} {player.score}pts.</p>
        </div>
      {/each}
    </div>
    <div class="button-grid">
      <div class="form-container">
        <div class="btn-container">
          <button class="btn btn-danger" on:click={() => dispatch('leave-game')}>Leave game</button>
          {#if gameData.currentUser.isHost}
            <button class='btn btn-success' on:click={socket.playAgain}> Play again </button>
          {/if}
          {#if gameData.nextGameKey}
            <button class='btn btn-success' on:click={() => socket.joinGame(gameData.nextGameKey)}> Play again </button>
          {/if}
          {#if !gameData.currentUser.isHost && !gameData.nextGameKey}
            <button class='btn btn-success disabled'> Play again </button>
          {/if}
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
        grid-template-rows: 10% 10% 50% 30%;
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
        grid-row-start: 4;
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
    .ranking {
        grid-row-start: 3;
        margin-top: 4vh;
    }
    .game-over {
        grid-row-start: 2;
    }
    .game-over-text {
        font-size: 8vh;
    }
</style>
