/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		container: {
			center: true,
		},
		extend: {
			fontFamily: {
				sans: ['Saans', 'system-ui', 'sans-serif'],
			},
			fontWeight: {
				light: '300',
				normal: '400',
			},
		},
	},
	plugins: [],
};
