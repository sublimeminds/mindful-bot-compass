
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
				// Simplified TherapySync brand colors
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
				'scale-in': {
					'0%': {
						transform: 'scale(0.98)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'gentle-float': {
					'0%, 100%': {
						transform: 'translateY(0px)',
						opacity: '0.6'
					},
					'50%': {
						transform: 'translateY(-8px)',
						opacity: '0.8'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'gentle-float': 'gentle-float 6s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
