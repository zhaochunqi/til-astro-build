// @ts-check

import { copyFile, readdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import sharp from "sharp";

const singleSitemapCompat = {
	name: "single-sitemap-compat",
	hooks: {
		"astro:build:done": async ({ dir, logger }) => {
			const distDir = fileURLToPath(dir);
			const files = await readdir(distDir);
			const chunkFiles = files.filter((file) => /^sitemap-\d+\.xml$/.test(file)).sort();

			if (chunkFiles.length !== 1) {
				logger.info(`single-sitemap-compat skipped: found ${chunkFiles.length} sitemap chunks`);
				return;
			}

			await copyFile(`${distDir}/${chunkFiles[0]}`, `${distDir}/sitemap.xml`);
			await rm(`${distDir}/sitemap-index.xml`, { force: true });
			await rm(`${distDir}/${chunkFiles[0]}`, { force: true });
			logger.info("`sitemap.xml` created from the only sitemap chunk");
		},
	},
};

// https://astro.build/config
export default defineConfig({
	site: "https://til.zhaochunqi.com",
	integrations: [mdx({ optimize: true }), sitemap({ entryLimit: 50000 }), singleSitemapCompat],
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
