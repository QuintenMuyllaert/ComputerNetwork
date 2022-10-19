<script lang="ts">
	import { onMount } from "svelte";

	import { Particle } from "../class/Particle";

	export let active: boolean = true;

	//get the canvas element
	let canvas: HTMLCanvasElement;

	const particles = [];
	for (let i = 0; i < 100; i++) {
		particles.push(new Particle());
	}

	//resize the canvas to the size of the window
	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	document.addEventListener("resize", resizeCanvas);

	//get the canvas context when loaded
	onMount(() => {
		let ctx = canvas.getContext("2d");

		//set the canvas size to the window size
		resizeCanvas();

		window.addEventListener("resize", resizeCanvas);

		//draw the particles
		const drawParticles = () => {
			if (!active) return;

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			particles.forEach((particle) => {
				particle.draw(ctx);
			});
			requestAnimationFrame(drawParticles);
		};

		requestAnimationFrame(drawParticles);
	});
</script>

<canvas bind:this={canvas} />

<style lang="scss" scoped>
	canvas {
		width: 100%;
		height: 100%;
		z-index: -999;
		position: absolute;
		left: 0;
		top: 0;
	}
</style>
