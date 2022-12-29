process.exit(0);

import dotenv from "dotenv";
import { promises as fs } from "fs";

import { generateCertificate } from "./app";
import { saveOnFs, saveOnMongoDB } from "./save";

dotenv.config();

const generateCertificateFiles = async () => {
	const { DOMAIN, CLOUDFLARE_TOKEN, MAINTAINER_EMAIL } = process.env;
	if (!DOMAIN || !CLOUDFLARE_TOKEN || !MAINTAINER_EMAIL) {
		console.error("Missing environment variables\nMake sure you have a .env file with the following variables:\nDOMAIN\nCLOUDFLARE_TOKEN\nMAINTAINER_EMAIL");
		process.exit(0);
	}

	try {
		const certificate = await generateCertificate({
			domain: DOMAIN,
			cloudflareToken: CLOUDFLARE_TOKEN,
			maintainerEmail: MAINTAINER_EMAIL,
			keySize: 4096,
			staging: false,
			verbose: true,
		});

		console.log(certificate);

		await Promise.all([saveOnFs(certificate), saveOnMongoDB(certificate)]);

		console.log("Done!");
	} catch (e) {
		console.error("Something went wrong while generating certificate", e);
		process.exit(1);
	}
};

(async () => {
	try {
		await fs.stat("./pems/data.json");
	} catch (e) {
		console.log("No certificate metadata found, generating new certificate");
		await generateCertificateFiles();
	}

	const checkCertificate = async (daysRemaining: number = 10) => {
		const { iat, exp } = JSON.parse(await fs.readFile("./pems/data.json", "utf8"));
		const buffer = 60 * 60 * 1000 * 24 * daysRemaining;
		if (Date.now() + buffer > exp) {
			return true;
		}
		return false;
	};

	if (await checkCertificate(10)) {
		console.log("Certificate is about to expire, generating new certificate");
		await generateCertificateFiles();
	}

	const dailyCheckInterval = setInterval(async () => {
		console.log("Checking certificate expiration...");
		if (await checkCertificate(10)) {
			console.log("Certificate is about to expire, generating new certificate");
			await generateCertificateFiles();
		} else {
			console.log("Certificate is still valid");
		}
	}, 1000 * 60 * 60 * 24); // 1 day
})();
