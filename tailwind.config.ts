
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// TherapySync brand colors - gradient swirl inspired
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
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'grow': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0.8'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				// Swirl-inspired animations
				'swirl-breathe': {
					'0%, 100%': {
						transform: 'scale(1) rotate(0deg)',
						filter: 'brightness(1)'
					},
					'50%': {
						transform: 'scale(1.03) rotate(5deg)',
						filter: 'brightness(1.08)'
					}
				},
				'swirl-grow': {
					'0%': {
						transform: 'scale(1) rotate(0deg)'
					},
					'50%': {
						transform: 'scale(1.15) rotate(10deg)'
					},
					'100%': {
						transform: 'scale(1) rotate(0deg)'
					}
				},
				'gradient-flow': {
					'0%, 100%': {
						'background-position': '0% 50%'
					},
					'50%': {
						'background-position': '100% 50%'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'grow': 'grow 2s ease-in-out infinite',
				'swirl-breathe': 'swirl-breathe 4s ease-in-out infinite',
				'swirl-grow': 'swirl-grow 2s ease-out infinite',
				'gradient-flow': 'gradient-flow 8s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
