import dotenv from "dotenv";
import { promises as fs } from "fs";

import { generateCertificate } from "./app";

dotenv.config();

(async () => {
	const { DOMAIN, CLOUDFLARE_TOKEN, MAINTAINER_EMAIL } = process.env;
	if (!DOMAIN || !CLOUDFLARE_TOKEN || !MAINTAINER_EMAIL) {
		console.error("Missing environment variables\nMake sure you have a .env file with the following variables:\nDOMAIN\nCLOUDFLARE_TOKEN\nMAINTAINER_EMAIL");
		process.exit(1);
	}

	try {
		const certificate = await generateCertificate({
			domain: DOMAIN,
			cloudflareToken: CLOUDFLARE_TOKEN,
			maintainerEmail: MAINTAINER_EMAIL,
			keySize: 4096,
			staging: true,
			verbose: true,
		});

		console.log(certificate);

		await Promise.all([
			fs.writeFile("./pems/certificate.pem", certificate.certificate),
			fs.writeFile("./pems/privateKey.pem", certificate.privateKey),
			fs.writeFile("./pems/publicKey.pem", certificate.publicKey),
			fs.writeFile("./pems/csr.pem", certificate.csr),
		]);

		console.log("Done!");
	} catch (e) {
		console.error("Something went wrong while generating certificate", e);
		process.exit(1);
	}
})();
