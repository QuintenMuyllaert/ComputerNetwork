<script lang="ts">
	import { onDestroy, onMount } from "svelte";

	export let tilesize: number = 8;
	export let top: boolean = true;
	export let bottom: boolean = true;

	//get the canvas element
	let canvas: HTMLCanvasElement;

	//resize the canvas to the size of the window
	function resizeCanvas() {
		//set canvas width and height to the parent width and height
		canvas.width = canvas.parentElement.clientWidth;
		canvas.height = canvas.parentElement.clientHeight;

		draw();
	}

	document.addEventListener("resize", resizeCanvas);

	const url = "/img/dark_squares.webp";

	const loadImageAsync = (url: string) => {
		return new Promise<HTMLImageElement>((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve(img);
			img.onerror = reject;
			img.src = url;
		});
	};

	const crumble = {
		top,
		left: false,
		right: false,
		bottom,
	};

	const drawAll = async () => {
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const img = await loadImageAsync(url);

		//the image is a tiling pattern
		//every square is tilesizextilesize pixels
		//the image is 297x297 pixels
		//so the pattern is 27x27 squares
		//make a crumbledWall pattern
		const pattern = ctx.createPattern(img, "repeat");
		ctx.fillStyle = pattern;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//crumble the wall by drawing random rectangles over the edges
		//the rectangles are tilesizextilesize pixels
		const xs = canvas.width / tilesize;
		const ys = canvas.height / tilesize;
		for (let x = 0; x < xs; x++) {
			for (let y = 0; y < ys; y++) {
				//the closer to the edge, the more likely it is to crumble
				const chance = Math.min(x, y, xs - x, ys - y) / 10;
				const rand = Math.random();
				if (rand > chance) {
					ctx.clearRect(x * tilesize, y * tilesize, tilesize, tilesize);
				}
			}
		}
	};

	const draw = async () => {
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const img = await loadImageAsync(url);

		//the image is a tiling pattern
		//every square is tilesizextilesize pixels
		//the image is 297x297 pixels
		//so the pattern is 27x27 squares
		//make a crumbledWall pattern
		const pattern = ctx.createPattern(img, "repeat");
		const color = window.getComputedStyle(canvas, null).getPropertyValue("--color-primary");
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

		let lastColor = window.getComputedStyle(canvas, null).getPropertyValue("--color-primary");
		const colorCheck = () => {
			const color = window.getComputedStyle(canvas, null).getPropertyValue("--color-primary");
			if (color !== lastColor) {
				lastColor = color;
				resizeCanvas();
			}
			requestAnimationFrame(colorCheck);
		};

		const interval = requestAnimationFrame(colorCheck);
	});
</script>

<canvas bind:this={canvas} />

<style lang="scss" scoped>
	canvas {
		position: absolute;
	}
</style>
