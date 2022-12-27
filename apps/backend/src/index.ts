import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import sharp from "sharp";
import path from "path";

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//middleware for all /img/* routes
app.use("/img", async (req: Request, res: Response, next: any) => {
	console.log("middleware for /img/* routes");
	const { width, height, format, quality } = req.query;
	// /img/foo.jpg -> ../frontend/static/img/foo.jpg
	const filePath = path.join(__dirname, "../../frontend/static/img", req.path);
	console.log(filePath);

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
		res.set("Content-Type", "image/" + format);
		return res.send(buffer);
	} catch (err) {
		console.log(err);
		return res.status(404).send("Not Found");
	}
});

app.get("/", (req: Request, res: Response) => {
	res.send("Hello World!");
});

app.listen(3000, () => {
	console.log("Server started on port 3000");
});
