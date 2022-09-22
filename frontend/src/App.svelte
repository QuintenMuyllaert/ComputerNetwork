<script lang="ts">
	import { Router } from "svelte-router-spa";
	import routes from "./router";

	import Navbar from "./components/Navbar.svelte";
</script>

<main>
	<Navbar />
	<Router {routes} />
</main>

<style lang="scss" scoped>
	main {
		display: grid;
		grid-template-rows: auto 1fr;
		width: 100%;
		height: 100%;
	}
</style>
