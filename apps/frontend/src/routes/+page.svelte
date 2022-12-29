<script lang="ts">
	import Typer from "../components/Typer.svelte";
	import RainAnimation from "../components/RainAnimation.svelte";
	import CrumbledWall from "../components/CrumbledWall.svelte";
	import Navbar from "../components/Navbar.svelte";

	const sentences: string[] = [
		"Hello world! 🌍",
		"I'm a full-stack developer 👨‍💻",
		"Aspiring 10x developer 💯",
		"I'm a student at the University of Applied Sciences Howest in Kortrijk 🎓",
		"I'm a CoderDojo mentor 🥋",
		"I love to code 💖",
		"I love to learn new things 📚",
		"I love to play video games 🎮",
		"I 💙 JavaScript & TypeScript",
		"I 💙 Electronics",
		"IoT projects are my passion 🤖",
		"Feel free to contact me! 📧",
		"I'm always looking for new opportunities! 🤝",
		"I'm always looking for new projects! 📁",
		"🌌 Ran code in space! 🚀",
		"Wanna see my projects? 📂",
		"Check out my GitHub! 🐙",
		"Thanks for visiting my website! 🙏",
		"Have a nice day! ☀️",
		"Have a nice evening! 🌙",
		"Reinvigorating the web! 🌐",
		"Make it from scratch! 🧱",
		"Doable, not impossible! 🚀",
		"sudo rm -rf /",
		"Question everything! 🤔",
		"Be curious! 🧐",
		"Be creative! 🎨",
		"Be kind! ❤️",
		"Laureate best thesis project in VTI Menen 🏆",
		"Made with ❤️ in Belgium 🇧🇪",
		"npm install npm@latest -g",
		"npm i -g pnpm",
		"404: Not found 🤷‍♂️",
		"@TODO: Add more sentences 🤔",
	];
</script>

<div class="page">
	<Navbar />
	<main>
		<div>
			<h1>ComputerNetwork</h1>
			<h2>Quinten Muyllaert</h2>
			<Typer prefix="< " suffix=" />" {sentences} />
		</div>
		<RainAnimation active={true} />
		<div class="wall">
			<CrumbledWall bottom={false} />
		</div>
	</main>
</div>

<style lang="scss">
	.page {
		display: grid;
		grid-template-rows: auto 1fr;
	}

	main {
		display: grid;
		position: relative;
		place-items: center;
		z-index: 100;

		div {
			display: grid;
			gap: 1rem;
			place-items: center;
			width: fit-content;
			height: fit-content;
		}
		h1 {
			font-size: 2.5rem;
		}

		h2 {
			font-size: 2.25rem;
		}

		.wall {
			width: 100%;
			height: 10rem;
			position: absolute;
			bottom: 0;
			left: 0;
			z-index: -1;
		}
	}

	:global(.Typer) {
		font-size: 1.5rem;
	}
</style>
