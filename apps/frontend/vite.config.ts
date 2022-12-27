import { sveltekit } from "@sveltejs/kit/vite";
import viteCompression from "vite-plugin-compression";
import type { UserConfig } from "vite";

const config: UserConfig = {
	plugins: [sveltekit(), viteCompression()],
	server: {
		port: 80,
	},
};

export default config;
