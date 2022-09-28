import dotenv from "dotenv";
import express, { Request, Response } from "express";
import mime from "mime-types";

import { createServer } from "https";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();

app.use(
	createProxyMiddleware({
		target: process.env.SPACE_URI,
		changeOrigin: true,
		ws: true,
		router: (req: Request) => {
			const { host } = req.headers;
			const subdomain = host?.split(".")[0];
			const folder = subdomain ? `${subdomain}/` : "root/";

			//remove query from url
			let url = req.url?.split("?")[0];

			//add trailing slash if missing and there is no file extension
			if (url && !url.includes(".") && !url.endsWith("/")) {
				url += "/";
			}

			//if requesting a route ending in / then redirect to the root index.html
			if (url?.endsWith("/")) {
				//expressy way to redirect
				req.url = `${url}index.html`;

				//spa way to redirect
				req.url = "/index.html";
			}

			return `${process.env.SPACE_URI}${folder}`;
		},
		onProxyRes: (proxyRes, req: Request, res: Response) => {
			//get the file extension
			const extension = req.url?.split(".").pop() || ".txt";
			const contentType = mime.contentType(extension) || "text/plain";

			//set correct content type
			proxyRes.headers["Content-Type"] = contentType;
		},
	}),
);

(async () => {
	// Import certificate and private key from mongodb
	const { MongoClient } = require("mongodb");
	const client = new MongoClient(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	await client.connect();
	const collection = client.db("ssl").collection("certificates");

	// Get the latest certificate by sorting by iat
	const certificate = await collection.find().sort({ iat: -1 }).limit(1).toArray();

	await client.close();

	const server = createServer(
		{
			key: certificate[0].privateKey,
			cert: certificate[0].certificate,
		},
		app,
	);

	setInterval(async () => {
		//check if there is a new certificate and update it
		console.log("Checking for new certificate...");
		const { MongoClient } = require("mongodb");
		const client = new MongoClient(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		await client.connect();
		const collection = client.db("ssl").collection("certificates");

		// Get the latest certificate by sorting by iat
		const certificate = await collection.find().sort({ iat: -1 }).limit(1).toArray();

		await client.close();

		server.setSecureContext({
			key: certificate[0].privateKey,
			cert: certificate[0].certificate,
		});

		console.log("Certificate updated!");
	}, 1000 * 60 * 60 * 24);

	server.listen(443, () => {
		console.log("Server listening on port 3000");
	});
})();
