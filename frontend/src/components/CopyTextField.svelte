<script lang="typescript">
  export let value = ''

  const copy = () => {
    var input = document.body.appendChild(document.createElement("input"))
    input.value = value
    input.focus();
    input.select();
    document.execCommand('copy')
    input.parentNode.removeChild(input)
  }
</script>

<form>
  <div class="input-group">
    <input type="text" class="form-control"
        value={value} placeholder="Some path" id="copy-input">
    <span class="input-group-btn">
      <button 
        class="btn btn-default"
        id="copy-input-btn"
        type="button"
        on:click={copy}
      >
        Copy
      </button>
    </span>
  </div>
</form>

<style>
  input {
    border-radius: 5px;
  }
  button {
    border: 1px solid rgb(194, 194, 194);
    border-radius: 5px;
  }
</style>