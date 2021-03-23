<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  let email
  let password
  let username

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
      <label for="username">Username</label>
      <input type="text" class="form-control" id="username" placeholder="Username" bind:value={username}>
    </div>
  </form>
  <button type="submit" class="btn-small btn-primary" on:click={() => dispatchAction('register', {email, password, username})}>Register</button>
  <br><p class="fs-5">Already have an account?</p>
  <p class="fs-5 login" on:click={() => dispatchAction('navigate-login')}>Login</p>
</div>

<style>
  label {
    margin-top: 4%;
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

  .login {
    color: rgb(61, 61, 255);
    text-decoration: underline;
    cursor: pointer;
  }
</style>