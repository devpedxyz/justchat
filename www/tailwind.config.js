/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: 'hsl(var(--color-primary) / <alpha-value>)',
				secondary: 'hsl(var(--color-secondary) / <alpha-value>)',
				accent: 'hsl(var(--color-accent) / <alpha-value>)',
				neutral: {
					base: 'hsl(var(--color-neutral-base) / <alpha-value>)',
					dark: 'hsl(var(--color-neutral-dark) / <alpha-value>)',
					light: 'hsl(var(--color-neutral-light) / <alpha-value>)'
				},
				bg: 'hsl(var(--color-bg) / <alpha-value>)',
				text: {
					base: 'hsl(var(--color-text-base) / <alpha-value>)',
					invert: 'hsl(var(--color-text-invert) / <alpha-value>)'
				},
				chat: {
					sidebar: {
						bg: 'hsl(var(--color-chat-sidebar-bg) / <alpha-value>)'
					},
					header: {
						bg: 'hsl(var(--color-chat-header-bg) / <alpha-value>)',
						heading: 'hsl(var(--color-chat-header-heading) / <alpha-value>)'
					},
					chatbox: 'hsl(var(--color-chat-chatbox) / <alpha-value>)',
					msg: {
						bg: 'hsl(var(--color-chat-msg-bg) / <alpha-value>)'
					}
				},
				input: {
					bg: 'hsl(var(--color-input-bg) / <alpha-value>)',
					text: 'hsl(var(--color-input-text) / <alpha-value>)'
				}
			}
		}
	}
};
