<script lang="typescript">
  import { CardState } from "../clients/ResponseTypes";

  export let text: string = ''
  export let blackCardText: string = ''
  export let disabled: boolean = false
  export let cardState: CardState

  const combinedCardText = (whiteText: string, blackText: string): string[] => {
    whiteText = `${whiteText}`
    const blackParts = blackText.split('_')
    return [blackParts[0], whiteText, blackParts[1]]
  }
  const cardParts = combinedCardText(text, blackCardText)
</script>


<div class={disabled ? "card-disabled" : "card"}>
  <p class={disabled ? "disabled" : "active"}>
    {#if cardState !== CardState.PLAYED_HIDDEN}
      {#if blackCardText}
        {cardParts[0]} <p class="bold">{cardParts[1]}</p> {cardParts[2]}
        {:else }
          {text}
      {/if}
    {/if}
  </p>
</div>


<style>
  .card {
    width: 8.9vw;
    height: 22vh;
    background-color: rgb(226, 226, 226);
    box-shadow: 0px 2px 5px rgb(124, 124, 124);
    padding: 10px;
    transition: background-color 0.5s;
    cursor: pointer;
  }

  .bold {
    font-weight: 600;
  }

  .card-disabled {
    width: 8.9vw;
    height: 22vh;
    background-color: rgba(189, 189, 189, 0.315);
    box-shadow: 0px 2px 5px rgb(124, 124, 124);
    padding: 10px;
  }

  .card:hover {
    margin-bottom: 20px;
    background-color: rgb(170, 170, 170);
  }

  .active {
    color:rgb(53, 53, 53);
    font-weight: 100;
  }

  .disabled {
    color:rgba(138, 138, 138, 0.479);
    font-weight: 100;
  }
  p {
    font-size: 1.8vh;
  }
</style>
