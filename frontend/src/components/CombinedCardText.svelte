<script lang="ts">
  import {BlackCardResponse, CardResponse} from "../clients/ResponseTypes";

  export let blackCard: BlackCardResponse
  export let whiteCard: CardResponse

  const blackParts = blackCard.text.split('_')
  const cardParts = [blackParts[0], whiteCard.text, blackParts[1]]
</script>

<p>{cardParts[0]}</p> <p class="bold">{cardParts[1]}</p><p>{cardParts[2]}</p>

<style>
  p {
    display: inline;
    font-size: 1.8vh;
  }

  .bold {
    font-weight: 600;
  }
</style>
