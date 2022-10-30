<script lang="ts">
	export let prefix: string = "";
	export let sentences: string[] = [];
	export let suffix: string = "";
	export let delayBetweenSentences: number = 1000;
	export let delayBetweenLetters: number = 100;

	const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

	let goalSentence = "";
	let sentence = "";

	//get random sentence from array that is not the same as the previous one
	const getRandomSentence = (): string => {
		if (sentences.length === 1) {
			return sentences[0];
		}

		const newSentence = sentences[Math.floor(Math.random() * sentences.length)];
		if (newSentence === goalSentence) {
			return getRandomSentence();
		}
		return newSentence;
	};

	goalSentence = getRandomSentence();

	let direction = 1;

	(async () => {
		for (;;) {
			if (sentence === goalSentence) {
				direction = -1;
				await delay(delayBetweenSentences);
			}
			if (sentence === "") {
				direction = 1;
				goalSentence = getRandomSentence();
				await delay(delayBetweenSentences / 2);
			}

			if (direction === 1) {
				sentence = goalSentence.slice(0, sentence.length + 1);
			} else {
				sentence = goalSentence.slice(0, sentence.length - 1);
			}

			if (direction === 1) {
				await delay(delayBetweenLetters);
			} else {
				await delay(delayBetweenLetters / 4);
			}
		}
	})();
</script>

<p class="Typer">{prefix}{sentence}{suffix}</p>

<style lang="scss">
</style>
