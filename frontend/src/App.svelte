<script lang="ts">
  import Register from './views/Login/Register.svelte'
  import Login from './views/Login/Login.svelte'
  import User from './clients/User';
  import GameContext from './views/Game/GameContext.svelte';
  import type {UserData} from './clients/ResponseTypes'
  import {AuthenticationError} from "./clients/error";

  let view = 'login'
  let errorMsg = ''
  const user: User = new User()
  const navigate = location => {
    errorMsg = ''
    view = location
  }

  const register = async (detail: UserData) => {
    try {
      user.email = detail.email
      user.password = detail.password
      user.username = detail.username
      await user.register()
      if(user.isActive) {
        navigate('game')
      }
    } catch(error) {}
  }

  const login = async detail => {
    errorMsg = ''
    try {
      await user.login(detail.email, detail.password)
      navigate('game')
    } catch(error) {
      if(error instanceof AuthenticationError) {
        errorMsg = 'Wrong password or email.'
      }
    }
  }

  const checkSession = async () => {
    try {
      await user.getSessionUser()
      if(user.isActive) {
        navigate('game')
      } else {
        navigate('login')
      }
    } catch(error) {}
  }

  const logout = async () => {
    try {
      await user.logout()
      navigate('login')
    } catch(error) {}
  }

  checkSession()
</script>

<main>
  {#if view === 'game'}
    <GameContext on:logout={logout} user={user}/>
  {:else}
    <div class="grid">
      <div class="title">
        <h1 class="title">No-Name Game</h1>
      </div>
      <div class="flex-center">
        <div class="wrap-form">
          {#if view === "login"}
            <Login
              on:navigate-register={() => navigate('register')}
              on:login={event => login(event.detail)}
              msg={errorMsg}
            />
          {/if}
          {#if view === "register"}
            <Register
              on:navigate-login={() => navigate('login')}
              on:register={event => register(event.detail)}
            />
          {/if}
        </div>
      </div>
    </div>
  {/if}
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW" crossorigin="anonymous"></script>
</main>

<style>
  .grid {
      display: grid;
      grid-template-columns: auto auto auto;
      grid-template-rows: 30% 60% 10%;
      height: 85vh;
      align-items: center;
  }

  .flex-center {
      display: flex;
      align-items: center;
      justify-content: center;
      grid-column-start: 2;
      grid-column-end: 3;
      grid-row-start: 2;
      grid-row-end: 3;
  }

  .wrap-form {
      min-width: 375px;
  }

  .title{
      text-align: center;
      margin-top: 10%;
      font-size: 3rem;
  }

  .title {
      grid-column-start: 2;
  }
</style>
