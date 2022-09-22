export const Particle = class Particle {
	x: number = 0;
	y: number = 0;
	speed: number = 0;
	alpha: number = 0;
	size: number = 0;
	character: string = Math.random() > 0.5 ? "1" : "0";

	constructor(x) {
		this.x = x;
		this.reset();
	}

	reset() {
		this.y = 0;
		this.speed = 2 * Math.random();
		this.alpha = Math.random();
		this.size = 18 * Math.random();
	}

	draw(ctx) {
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
		ctx.fillStyle = "rgba(0, 128, 255, " + this.alpha + ")";
		ctx.fillText(this.character, this.x, this.y);
	}
};
