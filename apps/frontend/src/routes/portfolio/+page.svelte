<script lang="ts">
	import { onMount } from "svelte";
	import CrumbledContainer from "../../components/CrumbledContainer.svelte";
	import Navbar from "../../components/Navbar.svelte";

	interface Project {
		name: string;
		description: string;
		tech: string[];
		img: string;
		link: string;
	}

	let articles: Project[] = [];
	let mobile: boolean = false;

	const fetchArticles = async () => {
		const response = await fetch("/portfolio.md");
		const data = await response.text();
		/*
		# Industry Project - DLC Scoreboard

		[img]: /img/portfolio/IMG_20220623_140823.jpg

		Second semester of my Bachlor 2MCT Next Web Developer we got assigned an Industry Project.
		For this project we had to work in a team of 3 people we had to make a PWA for a Belgian company.
		Our PWA is used to control the football scoreboard in KM Torhout - "Velodroom".

		[tags]: React NodeJS TypeScript Scss SocketIO
		*/
		const lines = data.replace(/\r/g, "").split("\n");
		let bufferArticle: Project | null = null;
		for (let line of lines) {
			if (line.startsWith("#")) {
				if (bufferArticle) {
					articles.push(bufferArticle);
				}
				bufferArticle = {
					name: line.slice(2),
					description: "",
					tech: [],
					img: "",
					link: "",
				};
			}

			if (!bufferArticle) continue;

			if (line.startsWith("[img]:")) {
				bufferArticle.img = line.slice(7);
			}
			if (line.startsWith("[link]:")) {
				bufferArticle.link = line.slice(7);
			}
			if (line.startsWith("[tags]:")) {
				bufferArticle.tech = line.slice(8).split(" ");
			}
			if (!line.startsWith("#") && !line.startsWith("[img]:") && !line.startsWith("[tags]:")) {
				bufferArticle.description += line;
			}
		}
		if (bufferArticle) {
			articles.push(bufferArticle);
		}

		return articles;
	};

	const onResize = () => {
		mobile = window.innerWidth < 768;
	};

	const bestImageFileFormatThisBrowserSupports = () => {
		//webp > avif > jpg > png > gif
		const webp = document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") == 0;
		const avif = document.createElement("canvas").toDataURL("image/avif").indexOf("data:image/avif") == 0;
		const jpg = document.createElement("canvas").toDataURL("image/jpeg").indexOf("data:image/jpeg") == 0;
		const png = document.createElement("canvas").toDataURL("image/png").indexOf("data:image/png") == 0;
		const gif = document.createElement("canvas").toDataURL("image/gif").indexOf("data:image/gif") == 0;

		if (webp) return "webp";
		if (avif) return "avif";
		if (jpg) return "jpg";
		if (png) return "png";
		if (gif) return "gif";
	};

	onMount(() => {
		(async () => {
			articles = await fetchArticles();
		})();

		console.log(bestImageFileFormatThisBrowserSupports());

		mobile = window.innerWidth < 768;

		window.addEventListener("resize", onResize);
		return () => {
			articles = [];
			window.removeEventListener("resize", onResize);
		};
	});
</script>

<div class="page">
	<Navbar />
	<main>
		<!-- loop over the articles-->
		{#each articles as article, i}
			<CrumbledContainer>
				<div class="container">
					{#if mobile}
						<div class="text-container">
							<h1>{article.name}</h1>
							<p>{article.description}</p>
							<img src={article.img} alt={article.name} loading="lazy" />
							<div class="tags">
								{#each article.tech as tech}
									<span>{tech}</span>
								{/each}
							</div>
						</div>
					{:else}
						{#if i % 2 == 0}
							<img src={article.img} alt={article.name} />
						{/if}
						<div class="text-container">
							<h1>{article.name}</h1>
							<p>{article.description}</p>
							<div class="tags">
								{#each article.tech as tech}
									<span>{tech}</span>
								{/each}
							</div>
						</div>
						{#if i % 2 == 1}
							<img src={article.img} alt={article.name} loading="lazy" />
						{/if}
					{/if}
				</div>
			</CrumbledContainer>
		{/each}
	</main>
</div>

<style lang="scss">
	.page {
		display: grid;
		grid-template-rows: auto 1fr;
	}
	main {
		display: grid;
		padding: 1rem 0;
		gap: 1rem;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 1rem;
	}

	.container {
		display: grid;
		justify-items: center;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr;
		width: fit-content;
		padding: 0 1rem;
	}

	.text-container {
		border-radius: 1rem;
		background-color: var(--color-container-background);
		width: 100%;
		height: 100%;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;

		p {
			flex: 1;
		}
		h1 {
			text-align: center;
		}
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: center;
		span {
			background-color: var(--color-container-background);
			padding: 0.5rem 1rem;
			border-radius: 1rem;
			background-color: var(--color-primary);
			color: #ffffff;
		}
	}

	@media (min-width: 768px) {
		//big
		.text-container {
			min-height: 80%;
			max-height: fit-content;
			height: auto;
			align-self: center;
			z-index: 1;
		}
		img {
			align-self: center;
			z-index: -1;
		}

		.container {
			max-width: min(100%, 1200px);
			& > :first-child {
				transform: translateX(2rem);
			}

			& > :last-child {
				transform: translateX(-2rem);
			}
		}
	}

	@media (max-width: 769px) {
		//small
		.container {
			grid-template-columns: 1fr;
		}
		.text-container {
			height: fit-content;
			h1 {
				font-size: 1rem;
			}
			p {
				font-size: 0.75rem;
			}
		}
	}
</style>