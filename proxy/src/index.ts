import dotenv from "dotenv";
import express, { Request, Response } from "express";
import mime from "mime-types";

import { createServer } from "spdy";

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

			const subdomain = host?.split(".").length === 3 && host?.split(".")[0];
			const folder = subdomain ? `${subdomain}/` : "www/";

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

	const cips = [
		"TLS13-AES-256-GCM-SHA384",
		"TLS13-CHACHA20-POLY1305-SHA256",
		"TLS_AES_256_GCM_SHA384",
		"TLS-AES-256-GCM-SHA384",
		"TLS_CHACHA20_POLY1305_SHA256",
		"TLS-CHACHA20-POLY1305-SHA256",
		"ECDHE-ECDSA-AES256-GCM-SHA384",
		"ECDHE-ECDSA-CHACHA20-POLY1305",
		"ECDHE-ECDSA-AES256-SHA384",
		"ECDHE-RSA-AES256-GCM-SHA384",
		"ECDHE-RSA-CHACHA20-POLY1305",
		"ECDHE-ECDSA-AES256-SHA",
		"ECDHE-RSA-AES256-SHA384",
		"ECDHE-RSA-AES256-SHA",
	];

	const curves = ["secp521r1", "X448", "secp384r1", "secp256k1"];

	const server = createServer(
		{
			key: certificate[0].privateKey,
			cert: certificate[0].certificate,
			ciphers: cips.join(":"),
			ecdhCurve: curves.join(":"),
			dhparam: certificate[0].dhparam,
			spdy: {
				protocols: ["h2", "http/1.1", "http/1.0", "spdy/3.1", "spdy/3", "spdy/2"],
			},
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
		console.log("Server started");
	});
})();
