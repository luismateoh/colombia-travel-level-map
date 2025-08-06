/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class', // Habilitar modo oscuro con clases
	theme: {
		extend: {
			animation: {
				// Tooltip
				"slide-up-fade": "slide-up-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
				"slide-down-fade": "slide-down-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
				// Nuevas animaciones
				"fade-in": "fade-in 0.3s ease-out",
				"slide-in-right": "slide-in-right 0.4s ease-out",
				"slide-in-left": "slide-in-left 0.4s ease-out",
				"scale-in": "scale-in 0.2s ease-out",
				"bounce-custom": "bounce-custom 1s ease-in-out",
				"pulse-custom": "pulse-custom 2s ease-in-out infinite",
			},
			keyframes: {
				// Tooltip
				"slide-up-fade": {
					"0%": { opacity: 0, transform: "translateY(6px)" },
					"100%": { opacity: 1, transform: "translateY(0)" },
				},
				"slide-down-fade": {
					"0%": { opacity: 0, transform: "translateY(-6px)" },
					"100%": { opacity: 1, transform: "translateY(0)" },
				},
				// Nuevas animaciones
				"fade-in": {
					"0%": { opacity: 0, transform: "translateY(10px) scale(0.95)" },
					"100%": { opacity: 1, transform: "translateY(0) scale(1)" },
				},
				"slide-in-right": {
					"0%": { opacity: 0, transform: "translateX(30px)" },
					"100%": { opacity: 1, transform: "translateX(0)" },
				},
				"slide-in-left": {
					"0%": { opacity: 0, transform: "translateX(-30px)" },
					"100%": { opacity: 1, transform: "translateX(0)" },
				},
				"scale-in": {
					"0%": { opacity: 0, transform: "scale(0.9)" },
					"100%": { opacity: 1, transform: "scale(1)" },
				},
				"bounce-custom": {
					"0%, 20%, 53%, 80%, 100%": { transform: "translate3d(0,0,0)" },
					"40%, 43%": { transform: "translate3d(0, -8px, 0)" },
					"70%": { transform: "translate3d(0, -4px, 0)" },
					"90%": { transform: "translate3d(0, -2px, 0)" },
				},
				"pulse-custom": {
					"0%": { transform: "scale(1)" },
					"50%": { transform: "scale(1.05)" },
					"100%": { transform: "scale(1)" },
				},
			},
			colors: {
				// Colores personalizados para modo oscuro
				dark: {
					50: '#f8fafc',
					100: '#f1f5f9',
					200: '#e2e8f0',
					300: '#cbd5e1',
					400: '#94a3b8',
					500: '#64748b',
					600: '#475569',
					700: '#334155',
					800: '#1e293b',
					900: '#0f172a',
				}
			},
			backdropBlur: {
				xs: '2px',
			},
			transitionProperty: {
				'height': 'height',
				'spacing': 'margin, padding',
			}
		},
	},
	plugins: [],
}
