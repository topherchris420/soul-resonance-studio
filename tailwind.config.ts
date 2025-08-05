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
				'soul-pulse': {
					'0%, 100%': {
						transform: 'scale(1)',
						opacity: '0.7',
						filter: 'brightness(1)'
					},
					'50%': {
						transform: 'scale(1.1)',
						opacity: '1',
						filter: 'brightness(1.3)'
					}
				},
				'cosmic-drift': {
					'0%': {
						transform: 'translateX(0) translateY(0) rotate(0deg)',
						opacity: '0.6'
					},
					'25%': {
						transform: 'translateX(15px) translateY(-10px) rotate(90deg)',
						opacity: '0.8'
					},
					'50%': {
						transform: 'translateX(5px) translateY(15px) rotate(180deg)',
						opacity: '1'
					},
					'75%': {
						transform: 'translateX(-10px) translateY(-5px) rotate(270deg)',
						opacity: '0.8'
					},
					'100%': {
						transform: 'translateX(0) translateY(0) rotate(360deg)',
						opacity: '0.6'
					}
				},
				'biometric-flow': {
					'0%': {
						backgroundPosition: '0% 50%',
						opacity: '0.6'
					},
					'50%': {
						backgroundPosition: '100% 50%',
						opacity: '1'
					},
					'100%': {
						backgroundPosition: '0% 50%',
						opacity: '0.6'
					}
				},
				'harmonic-wave': {
					'0%': {
						transform: 'translateY(0px) scale(1)',
						opacity: '0.8'
					},
					'50%': {
						transform: 'translateY(-20px) scale(1.05)',
						opacity: '1'
					},
					'100%': {
						transform: 'translateY(0px) scale(1)',
						opacity: '0.8'
					}
				},
				'neural-sync': {
					'0%': {
						transform: 'scale(1)',
						filter: 'brightness(1)'
					},
					'50%': {
						transform: 'scale(1.02)',
						filter: 'brightness(1.2)'
					},
					'100%': {
						transform: 'scale(1)',
						filter: 'brightness(1)'
					}
				},
				'ethereal-fade': {
					'0%, 100%': {
						opacity: '0.3',
						transform: 'scale(0.98)'
					},
					'50%': {
						opacity: '0.7',
						transform: 'scale(1.02)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'soul-pulse': 'soul-pulse 3s ease-in-out infinite',
				'cosmic-drift': 'cosmic-drift 8s ease-in-out infinite',
				'biometric-flow': 'biometric-flow 6s ease-in-out infinite',
				'harmonic-wave': 'harmonic-wave 4s ease-in-out infinite',
				'neural-sync': 'neural-sync 6s ease-in-out infinite',
				'ethereal-fade': 'ethereal-fade 10s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-cosmic': 'var(--gradient-cosmic)',
				'gradient-soul': 'var(--gradient-soul)',
				'gradient-harmonic': 'var(--gradient-harmonic)',
				'gradient-biometric': 'var(--gradient-biometric)'
			},
			boxShadow: {
				'cosmic': 'var(--shadow-cosmic)',
				'soul': 'var(--shadow-soul)',
				'glow-primary': 'var(--glow-primary)',
				'glow-secondary': 'var(--glow-secondary)',
				'glow-accent': 'var(--glow-accent)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
