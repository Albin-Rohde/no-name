<script lang="typescript">
  import WhiteCard from "./WhiteCard.svelte";
  import {BlackCardResponse, CardResponse} from "../clients/ResponseTypes";
  export let disabled: boolean
  export let whiteCards: CardResponse[]
  export let blackCard: BlackCardResponse
  export let handleCardClick: (card: CardResponse) => void
</script>

{#each whiteCards as card}
  <div class="white-card" on:click={() => handleCardClick(card)}>
    <WhiteCard
      disabled={disabled}
      whiteCard={card}
      blackCard={blackCard}
    />
  </div>
{/each}
<style>
  .white-card {
    height: 22vh;
    margin-right: 10px;
  }
</style>
