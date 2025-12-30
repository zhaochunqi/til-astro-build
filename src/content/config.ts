import { defineCollection, z } from "astro:content";

const notes = defineCollection({
	schema: z.object({
		title: z.string(),
		tags: z.array(z.string()).optional(),
		date: z.date(),
	}),
});

export const collections = { notes };
