<script lang="typescript">
  import { createEventDispatcher } from 'svelte'
  import type GameClient from '../../clients/GameClient'
  import Navbar from '../../components/Navbar.svelte'
  export let gameClient: 

  const dispatch = createEventDispatcher()

</script>

<div class="main-grid">
  <Navbar on:logout={() => dispatch('logout')}/>
  
</div>

<style>
  .main-grid {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 5% 65% 30%;
    width: 100vw;
    height: 100vh
  }
</style>