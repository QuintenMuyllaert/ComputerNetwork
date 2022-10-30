<script lang="ts">
	import { onMount } from "svelte";

	import { Particle } from "../class/Particle";
	import type { IParticle } from "../class/Particle";

	export let active: boolean = true;

	//get the canvas element
	let canvas: HTMLCanvasElement;

	const particles: IParticle[] = [];
	for (let i = 0; i < 100; i++) {
		particles.push(new Particle());
	}

	//resize the canvas to the size of the window
	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	//get the canvas context when loaded
	onMount(() => {
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		//set the canvas size to the window size
		resizeCanvas();

		window.addEventListener("resize", resizeCanvas);

		//draw the particles
		let finished = true;
		const drawParticles = () => {
			finished = false;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			for (const particle of particles) {
				particle.draw(ctx);
			}
			finished = true;
		};

		const renderLoop = setInterval(() => {
			if (!active) return;
			if (!finished) return;
			requestAnimationFrame(drawParticles);
		}, 1000 / 60);

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			clearInterval(renderLoop);
		};
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
