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
			padding: {
				DEFAULT: '1rem',
				xs: '0.5rem',
				sm: '1rem',
				md: '1.5rem',
				lg: '2rem',
				xl: '2.5rem',
				'2xl': '3rem',
				'3xl': '4rem',
				'4xl': '5rem'
			},
			screens: {
				xs: '480px',
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1400px',
				'3xl': '1600px',
				'4xl': '1920px'
			}
		},
		screens: {
			'xs': '480px',
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1400px',
			'3xl': '1600px',
			'4xl': '1920px',
			// MacBook Air specific
			'macbook': '1440px',
			// Container queries
			'@xs': '320px',
			'@sm': '384px',
			'@md': '448px',
			'@lg': '512px',
			'@xl': '576px',
			'@2xl': '672px',
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
			fontSize: {
				// Enhanced fluid typography
				'fluid-xs': 'clamp(0.75rem, 0.65rem + 0.5vw, 0.875rem)',
				'fluid-sm': 'clamp(0.875rem, 0.75rem + 0.625vw, 1rem)',
				'fluid-base': 'clamp(1rem, 0.85rem + 0.75vw, 1.125rem)',
				'fluid-lg': 'clamp(1.125rem, 0.95rem + 0.875vw, 1.25rem)',
				'fluid-xl': 'clamp(1.25rem, 1rem + 1.25vw, 1.5rem)',
				'fluid-2xl': 'clamp(1.5rem, 1.2rem + 1.5vw, 2rem)',
				'fluid-3xl': 'clamp(1.875rem, 1.4rem + 2.375vw, 2.5rem)',
				'fluid-4xl': 'clamp(2.25rem, 1.6rem + 3.25vw, 3rem)',
				'fluid-5xl': 'clamp(3rem, 2rem + 5vw, 4rem)',
				'fluid-6xl': 'clamp(3.75rem, 2.25rem + 7.5vw, 6rem)',
			},
			spacing: {
				// Enhanced fluid spacing with better scaling
				'fluid-xs': 'clamp(0.25rem, 0.125rem + 0.625vw, 0.5rem)',
				'fluid-sm': 'clamp(0.5rem, 0.25rem + 1.25vw, 1rem)',
				'fluid-md': 'clamp(1rem, 0.5rem + 2.5vw, 2rem)',
				'fluid-lg': 'clamp(1.5rem, 0.75rem + 3.75vw, 3rem)',
				'fluid-xl': 'clamp(2rem, 1rem + 5vw, 4rem)',
				'fluid-2xl': 'clamp(3rem, 1.5rem + 7.5vw, 6rem)',
				'fluid-3xl': 'clamp(4rem, 2rem + 10vw, 8rem)',
			},
			gridTemplateColumns: {
				'auto-fit-xs': 'repeat(auto-fit, minmax(120px, 1fr))',
				'auto-fit-sm': 'repeat(auto-fit, minmax(200px, 1fr))',
				'auto-fit-md': 'repeat(auto-fit, minmax(280px, 1fr))',
				'auto-fit-lg': 'repeat(auto-fit, minmax(350px, 1fr))',
				'auto-fill-xs': 'repeat(auto-fill, minmax(120px, 1fr))',
				'auto-fill-sm': 'repeat(auto-fill, minmax(200px, 1fr))',
				'auto-fill-md': 'repeat(auto-fill, minmax(280px, 1fr))',
				'auto-fill-lg': 'repeat(auto-fill, minmax(350px, 1fr))',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'therapy-subtle': 'var(--shadow-therapy-subtle)',
				'therapy-glow': 'var(--shadow-therapy-glow)',
				'calm-glow': 'var(--shadow-calm-glow)',
				'orange-glow': 'var(--shadow-orange-glow)'
			},
			animationDelay: {
				'200': '200ms',
				'400': '400ms',
				'600': '600ms'
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
				},
				// Therapy AI Category Keyframes
				'pulse-neural': {
					'0%, 100%': { transform: 'scale(1)', filter: 'brightness(1)' },
					'50%': { transform: 'scale(1.05)', filter: 'brightness(1.2)' }
				},
				'wave-therapy': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-3px)' }
				},
				'breathe-mindful': {
					'0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
					'50%': { opacity: '1', transform: 'scale(1.02)' }
				},
				'glow-healing': {
					'0%, 100%': { boxShadow: '0 0 5px rgba(120, 119, 198, 0.3)' },
					'50%': { boxShadow: '0 0 20px rgba(120, 119, 198, 0.6)' }
				},
				// Platform Category Keyframes
				'orbit-social': {
					'0%': { transform: 'rotate(0deg) translateX(2px) rotate(0deg)' },
					'100%': { transform: 'rotate(360deg) translateX(2px) rotate(-360deg)' }
				},
				'ping-alert': {
					'0%, 100%': { transform: 'scale(1)', opacity: '1' },
					'50%': { transform: 'scale(1.1)', opacity: '0.8' }
				},
				'slide-smooth': {
					'0%, 100%': { transform: 'translateX(0px)' },
					'50%': { transform: 'translateX(2px)' }
				},
				'bounce-family': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'25%': { transform: 'translateY(-2px)' },
					'75%': { transform: 'translateY(-1px)' }
				},
				// Tools & Data Category Keyframes
				'matrix-data': {
					'0%, 100%': { opacity: '1', transform: 'scale(1)' },
					'25%': { opacity: '0.7', transform: 'scale(0.98)' },
					'75%': { opacity: '0.9', transform: 'scale(1.02)' }
				},
				'connect-sync': {
					'0%, 100%': { transform: 'rotate(0deg)' },
					'50%': { transform: 'rotate(180deg)' }
				},
				'signal-mobile': {
					'0%, 100%': { transform: 'scale(1)', filter: 'brightness(1)' },
					'50%': { transform: 'scale(1.03)', filter: 'brightness(1.1)' }
				},
				'flow-export': {
					'0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
					'25%': { transform: 'translateX(1px) translateY(-1px)' },
					'75%': { transform: 'translateX(-1px) translateY(1px)' }
				},
				// Solutions Category Keyframes
				'expand-scale': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.08)' }
				},
				'shield-secure': {
					'0%, 100%': { transform: 'scale(1)', filter: 'brightness(1)' },
					'50%': { transform: 'scale(1.02)', filter: 'brightness(1.15)' }
				},
				'heart-care': {
					'0%, 100%': { transform: 'scale(1)' },
					'25%': { transform: 'scale(1.05)' },
					'75%': { transform: 'scale(1.02)' }
				},
				'coin-pricing': {
					'0%, 100%': { transform: 'rotateY(0deg)' },
					'50%': { transform: 'rotateY(180deg)' }
				},
				// Resources Category Keyframes
				'book-open': {
					'0%, 100%': { transform: 'rotateX(0deg)' },
					'50%': { transform: 'rotateX(10deg)' }
				},
				'lightbulb-idea': {
					'0%, 100%': { filter: 'brightness(1)' },
					'50%': { filter: 'brightness(1.3)' }
				},
				'support-lift': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-4px)' }
				},
				'search-discover': {
					'0%, 100%': { transform: 'rotate(0deg) scale(1)' },
					'50%': { transform: 'rotate(5deg) scale(1.03)' }
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'swirl-breathe': 'swirl-breathe 4s ease-in-out infinite',
				// Therapy AI Category Animations
				'pulse-neural': 'pulse-neural 2s ease-in-out infinite',
				'wave-therapy': 'wave-therapy 3s ease-in-out infinite',
				'breathe-mindful': 'breathe-mindful 4s ease-in-out infinite',
				'glow-healing': 'glow-healing 2.5s ease-in-out infinite',
				// Platform Category Animations
				'orbit-social': 'orbit-social 4s linear infinite',
				'ping-alert': 'ping-alert 1.5s ease-in-out infinite',
				'slide-smooth': 'slide-smooth 3s ease-in-out infinite',
				'bounce-family': 'bounce-family 2s ease-in-out infinite',
				// Tools & Data Category Animations
				'matrix-data': 'matrix-data 2s linear infinite',
				'connect-sync': 'connect-sync 3s ease-in-out infinite',
				'signal-mobile': 'signal-mobile 2s ease-in-out infinite',
				'flow-export': 'flow-export 3.5s ease-in-out infinite',
				// Solutions Category Animations
				'expand-scale': 'expand-scale 2.5s ease-in-out infinite',
				'shield-secure': 'shield-secure 3s ease-in-out infinite',
				'heart-care': 'heart-care 2s ease-in-out infinite',
				'coin-pricing': 'coin-pricing 4s ease-in-out infinite',
				// Resources Category Animations
				'book-open': 'book-open 3s ease-in-out infinite',
				'lightbulb-idea': 'lightbulb-idea 2s ease-in-out infinite',
				'support-lift': 'support-lift 3s ease-in-out infinite',
				'search-discover': 'search-discover 2.5s ease-in-out infinite',
				'spin-slow': 'spin-slow 6s linear infinite'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		// Container query plugin
		function({ addUtilities }) {
			const newUtilities = {
				'.container-query': {
					'container-type': 'inline-size',
				},
			}
			addUtilities(newUtilities)
		}
	],
} satisfies Config;
