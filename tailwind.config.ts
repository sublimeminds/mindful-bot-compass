
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// TherapySync brand colors
				therapy: {
					50: 'hsl(var(--therapy-50))',
					100: 'hsl(var(--therapy-100))',
					200: 'hsl(var(--therapy-200))',
					300: 'hsl(var(--therapy-300))',
					400: 'hsl(var(--therapy-400))',
					500: 'hsl(var(--therapy-500))',
					600: 'hsl(var(--therapy-600))',
					700: 'hsl(var(--therapy-700))',
					800: 'hsl(var(--therapy-800))',
					900: 'hsl(var(--therapy-900))',
					950: 'hsl(var(--therapy-950))',
				},
				calm: {
					50: 'hsl(var(--calm-50))',
					100: 'hsl(var(--calm-100))',
					200: 'hsl(var(--calm-200))',
					300: 'hsl(var(--calm-300))',
					400: 'hsl(var(--calm-400))',
					500: 'hsl(var(--calm-500))',
					600: 'hsl(var(--calm-600))',
					700: 'hsl(var(--calm-700))',
					800: 'hsl(var(--calm-800))',
					900: 'hsl(var(--calm-900))',
					950: 'hsl(var(--calm-950))',
				},
				harmony: {
					50: 'hsl(var(--harmony-50))',
					100: 'hsl(var(--harmony-100))',
					200: 'hsl(var(--harmony-200))',
					300: 'hsl(var(--harmony-300))',
					400: 'hsl(var(--harmony-400))',
					500: 'hsl(var(--harmony-500))',
					600: 'hsl(var(--harmony-600))',
					700: 'hsl(var(--harmony-700))',
					800: 'hsl(var(--harmony-800))',
					900: 'hsl(var(--harmony-900))',
					950: 'hsl(var(--harmony-950))',
				},
				balance: {
					50: 'hsl(var(--balance-50))',
					100: 'hsl(var(--balance-100))',
					200: 'hsl(var(--balance-200))',
					300: 'hsl(var(--balance-300))',
					400: 'hsl(var(--balance-400))',
					500: 'hsl(var(--balance-500))',
					600: 'hsl(var(--balance-600))',
					700: 'hsl(var(--balance-700))',
					800: 'hsl(var(--balance-800))',
					900: 'hsl(var(--balance-900))',
					950: 'hsl(var(--balance-950))',
				},
				flow: {
					50: 'hsl(var(--flow-50))',
					100: 'hsl(var(--flow-100))',
					200: 'hsl(var(--flow-200))',
					300: 'hsl(var(--flow-300))',
					400: 'hsl(var(--flow-400))',
					500: 'hsl(var(--flow-500))',
					600: 'hsl(var(--flow-600))',
					700: 'hsl(var(--flow-700))',
					800: 'hsl(var(--flow-800))',
					900: 'hsl(var(--flow-900))',
					950: 'hsl(var(--flow-950))',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'swirl-breathe': {
					'0%, 100%': { 
						transform: 'rotate(0deg) scale(1)',
						filter: 'hue-rotate(0deg)'
					},
					'25%': { 
						transform: 'rotate(90deg) scale(1.05)',
						filter: 'hue-rotate(45deg)'
					},
					'50%': { 
						transform: 'rotate(180deg) scale(1.1)',
						filter: 'hue-rotate(90deg)'
					},
					'75%': { 
						transform: 'rotate(270deg) scale(1.05)',
						filter: 'hue-rotate(135deg)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'swirl-breathe': 'swirl-breathe 4s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
