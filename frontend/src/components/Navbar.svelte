<script lang="ts">
</script>

<nav>
	<a href="/"><img src="" alt="" /> </a>
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/portfolio">Portfolio</a></li>
	</ul>
</nav>

<style lang="scss" scoped>
	nav {
		display: flex;
		justify-content: space-between;
		padding: 1rem;
		align-items: center;
		width: 100%;
		height: 3rem;
		gap: 1rem;

		//add bottomshadow
		box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);

		ul {
			display: flex;
			align-items: center;
			gap: 1rem;
		}
		a {
			width: 100%;
			height: 100%;
			color: #000;
		}
	}
</style>
