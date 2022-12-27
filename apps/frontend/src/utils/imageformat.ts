import { isBrowser } from "./globals";

let format: string;

export const bestImageFileFormatThisBrowserSupports = () => {
	if (!isBrowser) return "png";

	//webp > avif > png > jpg > gif
	if (format) return format;

	const webp = document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") == 0;
	if (webp) {
		format = "webp";
		return format;
	}

	const avif = document.createElement("canvas").toDataURL("image/avif").indexOf("data:image/avif") == 0;
	if (avif) {
		format = "avif";
		return format;
	}

	const png = document.createElement("canvas").toDataURL("image/png").indexOf("data:image/png") == 0;
	if (png) {
		format = "png";
		return format;
	}

	const jpg = document.createElement("canvas").toDataURL("image/jpeg").indexOf("data:image/jpeg") == 0;
	if (jpg) {
		format = "jpg";
		return format;
	}

	const gif = document.createElement("canvas").toDataURL("image/gif").indexOf("data:image/gif") == 0;
	if (gif) {
		format = "gif";
		return format;
	}
};
