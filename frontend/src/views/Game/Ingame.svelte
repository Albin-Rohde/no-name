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

  const playCard = (card: CardResponse) => {
    if(!socket.currentUser.cardWizz) {
      socket.playCard(card)
    }
  }
</script>

<div>
  <div class="content-grid">
    <div class="left-coll">
      <PlayerInfo gameData={gameData}/>
    </div>
    <div class="main-coll">
      <div class="top-cards">
        <BlackCard text="I am a black card, select a card to fill in the _ blank."/>
        {#each gameData.users as user}
          {#each user.cards as card}
            {#if card.state === CardState.PLAYED_HIDDEN || card.state === CardState.PLAYED_SHOW}
              <div class="white-card" on:click={() => socket.flipCard(card)}>
                <WhiteCard text={card.text} cardState={card.state}/>
              </div>
            {/if}
          {/each}
        {/each}
      </div>
    </div>
  </div>
  <div class="white-cards">
    {#each currentUser.cards as card}
      {#if card.state === CardState.HAND}
        <div class="white-card" on:click={() => playCard(card)}>
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