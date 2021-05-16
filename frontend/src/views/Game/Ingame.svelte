<script lang="typescript">
  import type {CardResponse} from '../../clients/ResponseTypes'
  import { CardState } from '../../clients/ResponseTypes'
  import BlackCard from '../../components/BlackCard.svelte'
  import PlayerInfo from '../../components/PlayerInfo.svelte'
  import WhiteCard from '../../components/WhiteCard.svelte'
  import type { SocketClient } from '../../clients/SocketClient'
  import Game, { GameState } from "../../clients/Game";

  export let socket: SocketClient
  export let gameData: Game

  const handleCardClick = (card: CardResponse): void => {
    if(card.state === CardState.HAND) {
      if(!gameData.currentUser.cardWizz) {
        return socket.playCard(card)
      }
    }
    if(card.state === CardState.PLAYED_HIDDEN) {
      return socket.flipCard(card)
    }
    if(card.state === CardState.PLAYED_SHOW) {
      return socket.voteCard(card)
    }
  }
</script>

<div>
  <div class="content-grid">
    <div class="left-coll">
      <PlayerInfo gameData={gameData}/>
    </div>
    <div class="game-state-info">
      <p class="fs-3">
        {#if gameData.state === GameState.PLAYING}
          {gameData.playedCards}/{gameData.players.length} Played
        {/if}
        {#if gameData.state === GameState.FLIPPING}
          {gameData.shownCards}/{gameData.playedCards} Flipped
        {/if}
        {#if gameData.state === GameState.VOTING}
          {#if gameData.currentUser.cardWizz}
            Select the winning card
            {:else}
            Waiting for card wizz to vote
          {/if}
        {/if}
        {#if gameData.state === GameState.DISPLAY_WINNER}
          {gameData.winningPlayer.username} won this round
        {/if}
      </p>
    </div>
    <div class="main-coll">
      <div class="top-cards">
        <BlackCard text={gameData.blackCard.text}/>
        {#each gameData.users as user}
          {#each user.cards as card}
            {#if gameData.state !== GameState.DISPLAY_WINNER}
              {#if card.state === CardState.PLAYED_HIDDEN || card.state === CardState.PLAYED_SHOW}
                <div class="white-card" on:click={() => handleCardClick(card)}>
                  <WhiteCard
                    text={card.text}
                    blackCardText={gameData.blackCard.text}
                    cardState={card.state}/>
                </div>
              {/if}
            {/if}
            {#if gameData.state === GameState.DISPLAY_WINNER}
              {#if card.state === CardState.WINNER}
                <div class="white-card" on:click={() => handleCardClick(card)}>
                  <WhiteCard
                    text={card.text}
                    blackCardText={gameData.blackCard.text}
                    cardState={card.state}/>
                </div>
              {/if}
            {/if}
          {/each}
        {/each}
      </div>
    </div>
  </div>
  <div class="white-cards">
    {#each gameData.currentUser.cards as card}
      {#if card.state === CardState.HAND}
        <div class="white-card" on:click={() => handleCardClick(card)}>
          <WhiteCard text={card.text} disabled={gameData.currentUser.cardWizz} cardState={card.state}/>
        </div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .content-grid {
    display: grid;
    grid-template-columns: 2.5% 15% 65% 15% 2.5%;
    grid-template-rows: 15% 75% 10%;
    width: 100%;
    height: 70%;
  }
  .game-state-info {
    grid-column-start: 3;
    grid-column-end: 4;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .left-coll {
    grid-column-start: 2;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 3;
  }
  .main-coll {
    grid-column-start: 3;
    grid-column-end: 5;
    grid-row-start: 2;
    grid-row-end: 3;
    display: grid;
    grid-template-rows: 15% 85%;
  }
  .top-cards {
    display: flex;
    flex-wrap: wrap;
    margin-left: 2%;
    grid-row-start: 2;
    grid-row-end: 3;
  }
  .white-cards {
    width: 97.5%;
    margin-left: 2.5%;
    display: flex;
  }
  .white-card {
    height: 220px;
    margin-right: 10px;
  }
</style>
