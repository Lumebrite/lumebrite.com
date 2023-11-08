// RinseDocs Config

export const SITE = {
	website: 'https://astro-paper.pages.dev/',
	author: 'Sat Naing',
	desc: 'A minimal, responsive and SEO-friendly Astro blog theme.',
	title: 'AstroPaper',
	ogImage: 'astropaper-og.jpg',
	lightAndDarkMode: true,
	postPerPage: 3,

	navOverrides: [
		{
			folder: ['general', 'General Library'],
			content: [
				{
					folder: ['nested', 'NESTED'],
					content: [
						{
							folder: ['nested-further', 'NESTED FURTHER'],
						},
					],
				},
			],
		},
	],
};
