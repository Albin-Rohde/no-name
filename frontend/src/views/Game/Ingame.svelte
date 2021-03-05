<script lang="typescript">
  import type GameClientType from '../../clients/GameClient'
	import type { CardResponse } from '../../clients/ResponseTypes'
	import { CardState } from '../../clients/ResponseTypes'
	import BlackCard from '../../components/BlackCard.svelte'
  import PlayerInfo from '../../components/PlayerInfo.svelte'
	import WhiteCard from '../../components/WhiteCard.svelte'

  export let gameClient: GameClientType


	const playCard = (card: CardResponse) => {
		console.log('is cardwizz: ', gameClient.currentUser.cardWizz)
		if(!gameClient.currentUser.cardWizz) {
			gameClient.playCard(card)
		}
	}
</script>

<div>
	<div class="content-grid">
		<div class="left-coll">
			<PlayerInfo gameClient={gameClient}/>
		</div>
		<div class="main-coll">
			<div class="top-cards">
				<BlackCard text="I am a black card, select a card to fill in the _ blank."/>
				{#each gameClient.users as user}
					{#each user.cards as card}
						{#if card.state === CardState.PLAYED_HIDDEN}
						<div class="white-card">
							<WhiteCard text={card.text}/>
						</div>
						{/if}
					{/each}
				{/each}
			</div>
		</div>
	</div>
	<div class="white-cards">
		{#each gameClient.currentUser.cards as card}
			{#if card.state === CardState.HAND}
			<div class="white-card" on:click={() => playCard(card)}>
				<WhiteCard text={card.text} disabled={gameClient.currentUser.cardWizz}/>
			</div>
			{/if}
		{/each}
	</div>
</div>

<style>
  .content-grid {
    display: grid;
    grid-template-columns: 15% 85%;
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