<script lang="ts">
	import { onMount } from "svelte";

	export let tilesize: number = 8;
	export let top: boolean = true;
	export let bottom: boolean = true;

	//get the canvas element
	let canvas: HTMLCanvasElement;

	//resize the canvas to the size of the window
	function resizeCanvas() {
		if (!canvas) return;

		//set canvas width and height to the parent width and height
		canvas.width = canvas?.parentElement?.clientWidth ?? 0;
		canvas.height = canvas?.parentElement?.clientHeight ?? 0;

		draw();
	}

	const crumble = {
		top,
		left: false,
		right: false,
		bottom,
	};

	const draw = async () => {
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const color = window?.getComputedStyle(canvas, null)?.getPropertyValue("--color-primary");
		ctx.fillStyle = color; ///"#3BA7A7"; // "#51a0ce"; //pattern;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//crumble the wall by drawing random rectangles over the edges
		//the rectangles are tilesizextilesize pixels
		const xs = canvas.width / tilesize;
		const ys = canvas.height / tilesize;
		for (let x = 0; x < xs; x++) {
			for (let y = 0; y < ys; y++) {
				//the closer to the edge, the more likely it is to crumble
				//check if the crumble object is true for the current x and y
				const chance = Math.min(y, ys - y) / 5;
				const rand = Math.random();
				//half of the smallest of xs and ys
				if (rand > chance) {
					if (crumble.top && y < ys / 2) {
						ctx.clearRect(x * tilesize, y * tilesize, tilesize, tilesize);
					}
					if (crumble.bottom && y > ys / 2) {
						ctx.clearRect(x * tilesize, y * tilesize, tilesize, tilesize);
					}
				}
			}
		}
	};

	//get the canvas context when loaded
	onMount(() => {
		//set the canvas size to the window size
		resizeCanvas();

		window.addEventListener("resize", resizeCanvas);

		canvas?.parentElement?.addEventListener("resize", resizeCanvas);

		let lastColor = window?.getComputedStyle(canvas, null)?.getPropertyValue("--color-primary");
		const colorCheck = () => {
			if (!canvas) return;
			if (typeof window.getComputedStyle !== "function") return;

			const color = window?.getComputedStyle(canvas, null)?.getPropertyValue("--color-primary");
			if (color !== lastColor) {
				lastColor = color;
				resizeCanvas();
			}
			requestAnimationFrame(colorCheck);
		};

		const interval = requestAnimationFrame(colorCheck);

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			canvas?.parentElement?.removeEventListener("resize", resizeCanvas);
			cancelAnimationFrame(interval);
		};
	});
</script>

<canvas bind:this={canvas} />

<style lang="scss" scoped>
	canvas {
		position: absolute;
	}
</style>
