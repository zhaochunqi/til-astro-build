// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import sharp from "sharp";

// https://astro.build/config
export default defineConfig({
	site: "https://til.zhaochunqi.com",
	integrations: [mdx({ optimize: true }), sitemap()],
	markdown: {
		shikiConfig: {
			theme: "github-light-high-contrast",
			wrap: true,
		},
	},
	image: {
		service: sharp(),
	},
	experimental: {
		svgo: true,
		contentIntellisense: true,
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
