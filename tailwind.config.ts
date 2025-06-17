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
				therapy: {
					50: '#f0fdf0',
					100: '#dcfce7',
					200: '#bbf7d0',
					300: '#86efac',
					400: '#4ade80',
					500: '#22c55e',
					600: '#16a34a',
					700: '#15803d',
					800: '#166534',
					900: '#14532d',
				},
				calm: {
					50: '#f0f9ff',
					100: '#e0f2fe',
					200: '#bae6fd',
					300: '#7dd3fc',
					400: '#38bdf8',
					500: '#0ea5e9',
					600: '#0284c7',
					700: '#0369a1',
					800: '#075985',
					900: '#0c4a6e',
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
				// Tree-inspired animations
				'tree-breathe': {
					'0%, 100%': {
						transform: 'scale(1)',
						filter: 'brightness(1)'
					},
					'50%': {
						transform: 'scale(1.02)',
						filter: 'brightness(1.05)'
					}
				},
				'tree-grow': {
					'0%': {
						transform: 'scale(1) rotate(0deg)'
					},
					'50%': {
						transform: 'scale(1.1) rotate(1deg)'
					},
					'100%': {
						transform: 'scale(1) rotate(0deg)'
					}
				},
				'leaf-float': {
					'0%, 100%': {
						transform: 'translateY(0px) translateX(0px) rotate(0deg)'
					},
					'25%': {
						transform: 'translateY(-5px) translateX(2px) rotate(1deg)'
					},
					'50%': {
						transform: 'translateY(-8px) translateX(-1px) rotate(-1deg)'
					},
					'75%': {
						transform: 'translateY(-3px) translateX(1px) rotate(0.5deg)'
					}
				},
				'tree-growth': {
					'0%': {
						transform: 'scale(0.8)',
						opacity: '0.6'
					},
					'50%': {
						transform: 'scale(1.1)',
						opacity: '1'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '0.9'
					}
				},
				'trunk-grow': {
					'0%': {
						transform: 'scaleY(0.5)',
						transformOrigin: 'bottom'
					},
					'100%': {
						transform: 'scaleY(1)',
						transformOrigin: 'bottom'
					}
				},
				'leaf-grow-1': {
					'0%': {
						transform: 'scale(0)',
						opacity: '0'
					},
					'60%': {
						transform: 'scale(1.2)',
						opacity: '0.8'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'leaf-grow-2': {
					'0%': {
						transform: 'scale(0)',
						opacity: '0'
					},
					'70%': {
						transform: 'scale(1.15)',
						opacity: '0.9'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'leaf-grow-3': {
					'0%': {
						transform: 'scale(0)',
						opacity: '0'
					},
					'80%': {
						transform: 'scale(1.1)',
						opacity: '1'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'roots-grow': {
					'0%': {
						strokeDasharray: '0 100',
						opacity: '0'
					},
					'100%': {
						strokeDasharray: '100 0',
						opacity: '0.7'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'grow': 'grow 2s ease-in-out infinite',
				// Tree animations
				'tree-breathe': 'tree-breathe 4s ease-in-out infinite',
				'tree-grow': 'tree-grow 2s ease-out infinite',
				'leaf-float': 'leaf-float 8s ease-in-out infinite',
				'tree-growth': 'tree-growth 3s ease-out infinite',
				'trunk-grow': 'trunk-grow 2s ease-out infinite',
				'leaf-grow-1': 'leaf-grow-1 2.5s ease-out infinite',
				'leaf-grow-2': 'leaf-grow-2 3s ease-out infinite',
				'leaf-grow-3': 'leaf-grow-3 3.5s ease-out infinite',
				'roots-grow': 'roots-grow 2s ease-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
