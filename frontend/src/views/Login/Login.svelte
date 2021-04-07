<script lang="typescript">
  import { createEventDispatcher } from 'svelte'
  export let msg
  let email = ''
  let password = ''
  const dispatch = createEventDispatcher()

  const dispatchAction = (action: string, details: Object = {}) => {
    dispatch(action, details)
  }
</script>

<div>
  <form>
    <div class="form-group">
      <label for="exampleInputEmail1">Email</label>
      <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" bind:value={email}>
      <label for="exampleInputPassword1">Password</label>
      <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" bind:value={password}>
    </div>
  </form>
  <button type="submit" class="btn-small btn-primary" on:click={() => dispatchAction('login', {email, password})}>Login</button>
  {#if msg}
    <p class="fs-5 error-msg">{msg}</p>
  {/if}
  <br><p class="fs-5">Don't have an account?</p>
  <p class="fs-5 register" on:click={() => dispatchAction('navigate-register')}>Register today.</p>
</div>

<style>
  label {
    margin-top: 4%;
  }

  .error-msg{
    margin-left: 2%;
    margin-top: 1%;
    color: rgb(168, 40, 40);
  }

  .form-group {
    margin-top: 5%;
  }
  button {
    margin-top: 3%;
    border-radius: 10%;
  }
  p {
    display: inline;
    margin-top: 3%;
  }

  .register {
    color: rgb(61, 61, 255);
    text-decoration: underline;
    cursor: pointer;
  }
</style>