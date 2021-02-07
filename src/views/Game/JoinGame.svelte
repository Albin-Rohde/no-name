<script lang="typescript">
  import { createEventDispatcher } from 'svelte'
  import type GameClientType from '../../clients/GameClient'
  
  export let gameClient: GameClientType
  const dispatch = createEventDispatcher()

</script>

<div class="form-container">
  <form>
    <div class="form-group">
      <label class="form-label" for="customRange2">Enter game Key</label>
      <input type="text" class="form-control" placeholder="Enter game key" bind:value={gameClient.key}>
    </div>
  </form>
  <button class="btn btn-danger" on:click={() => dispatch('join')}>Join game</button>
</div>

<style>

</style>