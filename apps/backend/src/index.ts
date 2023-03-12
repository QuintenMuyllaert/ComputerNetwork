import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import sharp from "sharp";
import path from "path";
import http from "http";

const app: Application = express();

const cache: { url: any; buffer: any }[] = [];
const cacheSize = 100;
const generateCacheValue = (url: string, buffer: Buffer) => {
	cache.push({
		url,
		buffer,
	});

	if (cache.length > cacheSize) {
		cache.shift();
	}
};
const checkCache = (url: string) => {
	//only check url
	const cacheValue = cache.find((cacheValue) => cacheValue.url === url);
	if (cacheValue) {
		//put cacheValue at the end of the array
		cache.splice(cache.indexOf(cacheValue), 1);
		return cacheValue.buffer;
	}
	return null;
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cors({
		origin: "*",
	}),
);

//middleware for all /img/* routes
app.use("/img", async (req: Request, res: Response, next: any) => {
	console.log("middleware for /img/* routes");
	const { width, height, format, quality } = req.query;
	// /img/foo.jpg -> ../frontend/build/img/foo.jpg
	const filePath = path.join(__dirname, "../../frontend/build/img", req.path);
	console.log(filePath);

	//set a very long cache time for images
	res.set("Cache-Control", "public, max-age=31536000");

	//check if image is in cache
	const cacheValue = checkCache(req.path + JSON.stringify(req.query));
	if (cacheValue) {
		console.log("cache hit");
		res.set("Content-Type", "image/" + format);
		return res.send(cacheValue);
	}

	try {
		const image = await sharp(filePath);
		if (width && height) {
			// resize
			image.resize(Number(width), Number(height));
		} else if (width) {
			// resize to width
			image.resize(Number(width));
		} else if (height) {
			// resize to height
			image.resize(null, Number(height));
		}

		if (format) {
			// convert to format
			if (
				format === "jpeg" ||
				format === "jpg" ||
				format === "png" ||
				format === "webp" ||
				format === "tiff" ||
				format === "raw" ||
				format === "gif" ||
				format === "svg" ||
				format === "heif"
			) {
				image.toFormat(format);
			} else {
				return res.status(401).send("Invalid format");
			}
		}

		if (quality && Number(quality) > 0 && Number(quality) <= 100 && Math.floor(Number(quality)) === Number(quality)) {
			switch (format) {
				case "jpeg":
				case "jpg":
					image.jpeg({ quality: Number(quality) });
					break;
				case "png":
					image.png({ quality: Number(quality) });
					break;
				case "webp":
					image.webp({ quality: Number(quality) });
					break;
				case "tiff":
					image.tiff({ quality: Number(quality) });
					break;
				default:
					return res.status(401).send("Format does not support quality");
			}
		}

		const buffer = await image.toBuffer();

		//add image to cache
		generateCacheValue(req.path + JSON.stringify(req.query), buffer);

		res.set("Content-Type", "image/" + format);
		return res.send(buffer);
	} catch (err) {
		console.log(err);
		return res.status(404).send("Not Found");
	}
});

app.use(express.static(path.join(__dirname, "../../frontend/build")));

const httpServer = http.createServer(app);

httpServer.listen(80, () => {
	console.log("HTTP Server running on port 80");
});
