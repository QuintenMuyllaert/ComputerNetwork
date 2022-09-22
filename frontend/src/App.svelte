<script lang="ts">
	import { Router } from "svelte-router-spa";

	import Index from "./pages/index.svelte";
	import Portfolio from "./pages/portfolio.svelte";

	const routes = [
		{
			name: "/",
			component: Index,
		},
		{
			name: "/portfolio",
			component: Portfolio,
		},
	];

	let text = "Hello World";
</script>

<main>
	<h1>{text}!</h1>
	<Router {routes} />
</main>

<style lang="scss">
	main {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		h1 {
			color: red;
		}
	}
</style>
