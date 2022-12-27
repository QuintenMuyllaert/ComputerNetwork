<script lang="ts">
	import { bestImageFileFormatThisBrowserSupports } from "../utils/imageformat";
	import { backendUrl } from "../utils/globals";

	let button: HTMLButtonElement;

	function toggleTheme() {
		let theme = localStorage.getItem("theme");

		if (theme === "dark") {
			localStorage.setItem("theme", "light");
		} else if (theme === "light") {
			localStorage.setItem("theme", "dark");
		} else {
			const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
			let appTheme = prefersDarkScheme ? "light" : "dark";
			localStorage.setItem("theme", appTheme);
		}

		document.location.reload();
	}
</script>

<nav>
	<a href="/"><img src={`${backendUrl}/img/favicon.png?width=${64}&format=${bestImageFileFormatThisBrowserSupports()}&quality=80`} alt="Site logo" loading="eager" /></a>
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/portfolio">Portfolio</a></li>
		<li><button bind:this={button} on:click={toggleTheme}>☀</button></li>
	</ul>
</nav>

<style lang="scss" scoped>
	nav {
		img {
			max-width: 100%;
			max-height: 100%;
			filter: brightness(0) invert(1);
		}

		display: flex;
		justify-content: space-between;
		padding: 0.5rem;
		align-items: center;
		width: 100%;
		height: 3rem;
		gap: 1rem;

		//add bottomshadow
		box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);

		background-color: var(--color-nav-background);
		ul {
			display: flex;
			align-items: center;
			gap: 1rem;
		}
		a {
			width: fit-content;
			height: 100%;
			color: #ffffff;
		}

		button {
			width: 2rem;
			height: 2rem;
			border: none;
			border-radius: 50%;
			background-color: var(--color-button-background);
			color: #ffffff;
			cursor: pointer;
			transition: background-color 0.2s ease-in-out;

			&:hover {
				background-color: var(--color-button-background-hover);
			}
		}
	}
</style>
