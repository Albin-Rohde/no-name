<script lang="typescript">
  export let text: string = ''
  export let disabled: boolean = false
</script>


<div class={disabled ? "card-disabled" : "card"}>
  <p class={disabled ? "disabled" : "active"}>{text}</p>
</div>


<style>
  .card {
    width: 8.9vw;
    height: 220px;
    background-color: rgb(226, 226, 226);
    box-shadow: 0px 2px 5px rgb(124, 124, 124);
    padding: 10px;
    transition: background-color 0.5s;
    cursor: pointer;
  }

  .card-disabled {
    width: 8.9vw;
    height: 220px;
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
    font-weight: 600;
  }

  .disabled {
    color:rgba(138, 138, 138, 0.479);
    font-weight: 600;
  }
</style>