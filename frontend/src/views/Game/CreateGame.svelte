<script lang="typescript">
  import { createEventDispatcher } from 'svelte'
  import RestClient from "../../clients/RestClient";
  import type {CardDeckResponse, GameResponse} from '../../clients/ResponseTypes'

  const dispatch = createEventDispatcher()
  const rest = new RestClient()

  export let onGameCreated
  let cardDecks: CardDeckResponse[]

  const fetchCardDecks = async () => {
    cardDecks = await rest.makeRequest<CardDeckResponse[]>({
      method: 'get',
      route: 'card',
      action: 'decks'
    })
  }

  interface gameSettingsType  {
    playCards: number,
    rounds: number,
    playerLimit: number,
    private: boolean,
    cardDeck: number,
  }

  const gameSettings: gameSettingsType = {
    playCards: 5,
    rounds: 3,
    playerLimit: 2,
    private: true,
    cardDeck: 1
  }

  fetchCardDecks()
  const createGame = async () => {
    const rest = new RestClient()
    const gameData = await rest.makeRequest<GameResponse>({
      method: 'post',
      route: 'game',
      data: gameSettings,
    })
    onGameCreated(gameData.key)
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
            <input type="range" class="form-range" min="5" max="10" id="customRange1" bind:value={gameSettings.playCards}/>
          </div>
          {gameSettings.playCards}
        </div>
        <div class="form-group">
          <label class="form-label" for="customRange2">Rounds</label>
          <div class="range">
            <input type="range" class="form-range" min="3" max="20" id="customRange2" bind:value={gameSettings.rounds}/>
          </div>
          {gameSettings.rounds}
        </div>
        <div class="form-group">
          <label class="form-label" for="customRange2">Player limit</label>
          <div class="range">
            <input type="range" class="form-range" min="2" max="10" id="customRange3" bind:value={gameSettings.playerLimit}/>
          </div>
          {gameSettings.playerLimit}
        </div>
        <div class="select-field">
          {#if cardDecks}
            <label class="form-label" for="customRange2">Card deck</label>
            <select class="form-select" aria-label="Default select example" bind:value={gameSettings.cardDeck}>
              {#each cardDecks as cardDeck}
                <option value={cardDeck.id}>{cardDeck.name}</option>
              {/each}
            </select>
          {:else}
            <select class="form-select" aria-label="Default select example">
              <option></option>
            </select>
          {/if}
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="private" checked={gameSettings.private}>
          <label class="form-check-label" for="gridRadios1">
            Private
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="public" checked={!gameSettings.private}>
          <label class="form-check-label" for="gridRadios2">
            Public
          </label>
        </div>
      </form>
      <div class="btn-container">
        <button class="btn btn-danger" on:click={() => dispatch('abort')}>Abort</button>
        <button class="btn btn-success" on:click={createGame}>Create</button>
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
  .select-field {
    margin-bottom: 4vh;
  }
</style>
