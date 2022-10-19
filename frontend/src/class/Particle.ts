export const Particle = class Particle {
	x: number = Math.random();
	y: number = 0;
	speed: number = 0;
	alpha: number = 0;
	size: number = 0;
	character: string = Math.random() > 0.5 ? "1" : "0";

	constructor() {
		this.reset();
	}

	reset() {
		this.y = 0;
		this.speed = 2 * Math.random();
		this.alpha = Math.random();
		this.size = 18 * Math.random();
	}

	draw(ctx) {
		const width = ctx.canvas.width;

		this.y += this.speed;
		this.alpha -= 0.01;
		this.size -= 0.1;

		if (this.alpha < 0) {
			this.reset();
		}

		if (this.size < 0) {
			this.reset();
		}

		ctx.font = this.size + "px serif";
		//convert alpha to hex
		const alphaHex = Math.round(this.alpha * 255).toString(16);
		ctx.fillStyle = "#3ba7a7" + alphaHex;
		ctx.fillText(this.character, this.x * width, this.y);
	}
};
