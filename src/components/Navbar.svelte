<script lang="typescript">
  import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle} from 'sveltestrap'
  import {createEventDispatcher} from 'svelte'
  export let username: string

  let dropdownOpen = false
  const dispatch = createEventDispatcher()
  const toggleDropdown = () => {
    dropdownOpen = !dropdownOpen
  }
</script>

<div class="top-grid">
  <div class="drop">
    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
      <DropdownToggle>
        Settings
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem on:click={() => dispatch('logout')}>
          <p class="text-danger">Logout</p>
        </DropdownItem>
        <DropdownItem class="disabled">
          User settings
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
  <div class="username">
    <p class="inline fs-5">{username}</p>
  </div>
</div>


<style>
  p {
    margin: 0
  }
  .top-grid {
    display: grid;
    grid-template-columns: 100px auto 50%;
    width: 100%;
    height: 45px;
    background-color: rgb(226, 226, 226);
    box-shadow: 0px 2px 5px rgb(124, 124, 124);
    z-index: 5;
  }
  .drop {
    grid-column-start: 1;
    grid-column-end: 2;
    padding-top: 0.3vh;
    padding-left: 8%;
  }
  .username {
    grid-column-start: 2;
    display: flex;
    align-items: center;
  }
</style>