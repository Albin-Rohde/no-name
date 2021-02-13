<script lang="typescript">
  export let text = ''
</script>


<div class="card">
	<p>{text}</p>
</div>


<style>
	.card {
		width: 8.9vw;
		height: 220px;
		background-color: rgb(226, 226, 226);
    box-shadow: 0px 2px 5px rgb(124, 124, 124);
		padding: 10px;
		transition: background-color 0.5s;
	}
	.card:hover {
		margin-bottom: 20px;
		background-color: rgb(170, 170, 170);
	}
	p {
		color:rgb(53, 53, 53);
		font-weight: 600;
	}


</style>