<script lang="typescript">
  import { createEventDispatcher } from 'svelte'
  import type GameClientType from '../../clients/GameClient'
	import BlackCard from '../../components/BlackCard.svelte'
  import PlayerInfo from '../../components/PlayerInfo.svelte'
	import WhiteCard from '../../components/WhiteCard.svelte'

  export let gameClient: GameClientType

</script>

<div>
	<div class="content-grid">
		<div class="left-coll">
			<PlayerInfo gameClient={gameClient}/>
		</div>
		<div class="main-coll">
			<div class="black-card">
				<BlackCard text="I am a black card, select a card to fill in the _ blank."/>
			</div>
		</div>
	</div>
	<div class="white-cards">
		{#each gameClient.currentUser.cards as card}
			<div class="white-card">
				<WhiteCard text={card.text}/>
			</div>
		{/each}
	</div>
</div>

<style>
  .content-grid {
    display: grid;
    grid-template-columns: 15% auto 15%;
    width: 100%;
    height: 70%;
  }
	.left-coll {
		grid-column-start: 1;
		grid-column-end: 2;
	}
	.main-coll {
		grid-column-start: 2;
		grid-column-end: 3;
		display: grid;
		grid-template-rows: 15% 85%;
	}
	.black-card {
		margin-left: 2%;
		grid-row-start: 2;
		grid-row-end: 3;
	}
	.white-cards {
		width: 100%;
		display: flex;
	}
	.white-card {
		margin: 10px;
	}
</style>