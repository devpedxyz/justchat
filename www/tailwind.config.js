/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				x: {
					100: 'rgba(255,255,255,0.1)',
					200: 'rgba(255,255,255,0.2)',
					300: 'rgba(255,255,255,0.3)',
					400: 'rgba(255,255,255,0.4)',
					500: 'rgba(255,255,255,0.5)'
				}
			}
		}
	},
	plugins: [require('daisyui')]
};
