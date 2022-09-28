interface CertificateData {
	certificate: string;
	privateKey: string;
	publicKey: string;
	csr: string;
	iat: number;
	exp: number;
}

import { promises as fs } from "fs";

export const saveOnFs = async (certificate: CertificateData) => {
	console.log("Saving certificate on fs...");
	await Promise.all([
		fs.writeFile("./pems/certificate.pem", certificate.certificate),
		fs.writeFile("./pems/privateKey.pem", certificate.privateKey),
		fs.writeFile("./pems/publicKey.pem", certificate.publicKey),
		fs.writeFile("./pems/csr.pem", certificate.csr),
		fs.writeFile(
			"./pems/data.json",
			JSON.stringify(
				{
					iat: certificate.iat,
					exp: certificate.exp,
				},
				null,
				2,
			),
		),
	]);
};

export const saveOnMongoDB = async (certificate: CertificateData) => {
	if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined");

	console.log("Saving certificate on MongoDB...");
	const { MongoClient } = require("mongodb");
	const client = new MongoClient(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	await client.connect();
	const collection = client.db("ssl").collection("certificates");
	await collection.insertOne(certificate);
	await client.close();
};
