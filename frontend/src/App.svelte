<script lang="ts">
	import { Router } from "svelte-router-spa";
	import routes from "./router";

	import Navbar from "./components/Navbar.svelte";

	//get the preferred theme from the user using the media query
	const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

	let appTheme = prefersDarkScheme ? "dark" : "light";
	if (localStorage.getItem("theme")) appTheme = localStorage.getItem("theme");
</script>

<main id="app" class={appTheme}>
	<Navbar />
	<Router {routes} />
</main>

<style lang="scss" scoped>
	main#app {
		display: grid;
		grid-template-rows: auto 1fr;
		width: 100%;
		height: 100%;

		color: var(--color-text);
		background-color: var(--color-background);
	}
</style>
