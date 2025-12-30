// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://til.zhaochunqi.com",
	integrations: [mdx(), sitemap()],
	markdown: {
		shikiConfig: {
			theme: "github-light-high-contrast",
			wrap: true,
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
