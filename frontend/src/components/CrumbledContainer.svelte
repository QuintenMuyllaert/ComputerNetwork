<script lang="ts">
	import CrumbledWall from "./CrumbledWall.svelte";
</script>

<div class="container">
	<CrumbledWall top={true} bottom={true} />
	<div class="slot-container">
		<slot />
	</div>
</div>

<style lang="scss" scoped>
	.container {
		display: grid;
		grid-template-areas: "a";
		place-items: center;
		position: relative;
		height: fit-content;

		:first-child {
			grid-area: a;
			z-index: -1;
		}

		:last-child {
			grid-area: a;
			padding: 2.5rem 0;
			z-index: 1;
		}
	}

	.container:nth-child(2n + 1) {
		> :global(:first-child) {
			opacity: 0;
		}
		:last-child {
			padding: 0;
		}
	}

	.slot-container {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
	}
</style>
