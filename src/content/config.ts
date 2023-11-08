import { z, defineCollection } from 'astro:content';

// prettier-ignore
const works = defineCollection({
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			publishedDate: z.string().transform((str) => new Date(str)),
			client: z.string(),
			thumbnail: image(),
			description: z.string().max(160, 'For best SEO results, please keep the description under 160 characters.'),
			tags: z.array(z.enum(['Digital Art', 'Product Design', 'Brand Design', 'Web Development'])),
			draft: z.boolean().default(false),
			images: z.array(image()),
		}),
});

export const collections = {
	works: works,
};
