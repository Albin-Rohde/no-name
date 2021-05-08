<script lang="ts">
  import Register from './views/Login/Register.svelte'
  import Login from './views/Login/Login.svelte'
  import UserClient from './clients/UserClient';
  import GameContext from './views/Game/GameContext.svelte';
  import type {UserData} from './clients/ResponseTypes'
  import * as process from "process";

  let view = 'login'
  let errorMsg = ''
  console.log(process.env.API_URL)
  const userClient: UserClient = new UserClient(process.env.API_URL)
  const navigate = location => {
    errorMsg = ''
    view = location
  }

  const register = async (detail: UserData) => {
    try {
      userClient.email = detail.email
      userClient.password = detail.password
      userClient.username = detail.username
      await userClient.register()
      if(userClient.isActive) {
        navigate('game')
      }
    } catch(error) {}
  }

  const login = async detail => {
    errorMsg = ''
    try {
      await userClient.login(detail.email, detail.password)
      navigate('game')
    } catch(error) {
      if(error.message == 'AUTHENTICATION_FAILED') {
        errorMsg = 'Wrong password or email.'
      }
    }
  }

  const checkSession = async () => {
    try {
      await userClient.getSessionUser()
      if(userClient.isActive) {
        navigate('game')
      } else {
        navigate('login')
      }
    } catch(error) {}
  }

  const logout = async () => {
    try {
      await userClient.logout()
      navigate('login')
    } catch(error) {}
  }

  checkSession()
</script>

<main>
  {#if view === 'game'}
    <GameContext on:logout={logout} userClient={userClient}/>
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
