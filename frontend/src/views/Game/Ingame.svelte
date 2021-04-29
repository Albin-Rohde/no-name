<script lang="typescript">
  import type {CardResponse, GameSocketResponse, UserResponse} from '../../clients/ResponseTypes'
  import { CardState } from '../../clients/ResponseTypes'
  import BlackCard from '../../components/BlackCard.svelte'
  import PlayerInfo from '../../components/PlayerInfo.svelte'
  import WhiteCard from '../../components/WhiteCard.svelte'
  import type { SocketClient } from '../../clients/SocketClient'

  export let socket: SocketClient
  export let gameData: GameSocketResponse
  export let currentUser: UserResponse
  enum GameState {
    PLAYING = 'playing',
    FLIPPING = 'flipping',
    VOTING = 'voting',
    DISPLAY_WINNER = 'winner',
  }

  const getWinningPlayer = (game: GameSocketResponse): UserResponse => {
    const winningPlayer = getPlayers(game).find(user => user.cards.some(c => c.state === CardState.WINNER))
    if(!winningPlayer) {
      throw new Error('Could not find winning player')
    }
    return winningPlayer
  }

  const getPlayers = (game: GameSocketResponse): UserResponse[] => {
    return game.users.filter(user => !user.cardWizz)
  }

  const getPlayedCards = (game: GameSocketResponse): CardResponse[] => {
    let allPlayedCards: CardResponse[] = []
    for(const player of getPlayers(game)) {
      // todo: remember that !== CardState.HAND will also return card with state USED
      allPlayedCards = [...allPlayedCards, ...player.cards.filter(card => card.state !== CardState.HAND)]
    }
    return allPlayedCards
  }

  const cardsPlayed = (game: GameSocketResponse): number => {
    return getPlayedCards(game).length
  }

  const cardsHidden = (game: GameSocketResponse): number => {
    return getPlayedCards(game).filter(card => card.state === CardState.PLAYED_HIDDEN).length
  }

  const cardsShown = (game: GameSocketResponse): number => {
    return getPlayedCards(game).filter(card => card.state === CardState.PLAYED_SHOW).length
  }

  const getGameState = (game: GameSocketResponse): GameState  => {
    const players = getPlayers(game)
    const allHasPlayed = players.every(user => user.hasPlayed)
    if(!allHasPlayed) {
      return GameState.PLAYING
    }
    if(allHasPlayed) {
      let playedCards = getPlayedCards(gameData)
      if(playedCards.some(card => card.state === CardState.PLAYED_HIDDEN)) {
        return GameState.FLIPPING
      }
      if(playedCards.every(card => card.state === CardState.PLAYED_SHOW)) {
        return GameState.VOTING
      }
      if(playedCards.some(card => card.state === CardState.WINNER)) {
        return GameState.DISPLAY_WINNER
      }
    }
  }

  const handleCardClick = (card: CardResponse): void => {
    if(card.state === CardState.HAND) {
      if(!socket.currentUser.cardWizz) {
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
        {#if getGameState(gameData) === GameState.PLAYING}
          {cardsPlayed(gameData)}/{getPlayers(gameData).length} Played
        {/if}
        {#if getGameState(gameData) === GameState.FLIPPING}
          {cardsShown(gameData)}/{cardsPlayed(gameData)} Flipped
        {/if}
        {#if getGameState(gameData) === GameState.VOTING}
          {#if socket.currentUser.cardWizz}
            Select the winning card
            {:else}
            Waiting for card wizz to vote
          {/if}
        {/if}
        {#if getGameState(gameData) === GameState.DISPLAY_WINNER}
          {getWinningPlayer(gameData).username} won this round
        {/if}
      </p>
    </div>
    <div class="main-coll">
      <div class="top-cards">
        <BlackCard text={gameData.blackCard.text}/>
        {#each gameData.users as user}
          {#each user.cards as card}
            {#if getGameState(gameData) !== GameState.DISPLAY_WINNER}
              {#if card.state === CardState.PLAYED_HIDDEN || card.state === CardState.PLAYED_SHOW}
                <div class="white-card" on:click={() => handleCardClick(card)}>
                  <WhiteCard text={card.text} cardState={card.state}/>
                </div>
              {/if}
            {/if}
            {#if getGameState(gameData) === GameState.DISPLAY_WINNER}
              {#if card.state === CardState.WINNER}
                <div class="white-card" on:click={() => handleCardClick(card)}>
                  <WhiteCard text={card.text} cardState={card.state}/>

                </div>
              {/if}
            {/if}
          {/each}
        {/each}
      </div>
    </div>
  </div>
  <div class="white-cards">
    {#each currentUser.cards as card}
      {#if card.state === CardState.HAND}
        <div class="white-card" on:click={() => handleCardClick(card)}>
          <WhiteCard text={card.text} disabled={currentUser.cardWizz} cardState={card.state}/>
        </div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .game-state-info {
      grid-column-start: 2;
      grid-column-end: 3;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
  }
  .content-grid {
    display: grid;
    grid-template-columns: 15% 70% 15%;
    grid-template-rows: 15% 75% 10%;
    width: 100%;
    height: 70%;
  }
  .left-coll {
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 1;
    grid-row-end: 3;
  }
  .main-coll {
    grid-column-start: 2;
    grid-column-end: 4;
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
    width: 100%;
    display: flex;
  }
  .white-card {
    height: 220px;
    margin-right: 10px;
  }
</style>