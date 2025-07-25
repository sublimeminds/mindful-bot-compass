// Utility to convert Tailwind gradient classes to SVG gradient definitions
export const getTailwindGradientAsSVG = (gradientClasses: string, id: string) => {
  // Extract gradient colors from Tailwind classes
  const gradientMap: Record<string, { colors: string[], direction: string }> = {
    'from-therapy-400 via-therapy-500 to-harmony-600': {
      colors: ['hsl(var(--therapy-400))', 'hsl(var(--therapy-500))', 'hsl(var(--harmony-600))'],
      direction: '135deg'
    },
    'from-calm-500 via-therapy-400 to-flow-600': {
      colors: ['hsl(var(--calm-500))', 'hsl(var(--therapy-400))', 'hsl(var(--flow-600))'],
      direction: '135deg'
    },
    'from-harmony-500 via-balance-600 to-therapy-700': {
      colors: ['hsl(var(--harmony-500))', 'hsl(var(--balance-600))', 'hsl(var(--therapy-700))'],
      direction: '135deg'
    },
    'from-mindful-500 via-flow-400 to-therapy-600': {
      colors: ['hsl(var(--mindful-500))', 'hsl(var(--flow-400))', 'hsl(var(--therapy-600))'],
      direction: '135deg'
    },
    'from-healing-400 via-therapy-500 to-calm-600': {
      colors: ['hsl(var(--healing-400))', 'hsl(var(--therapy-500))', 'hsl(var(--calm-600))'],
      direction: '135deg'
    },
    'from-flow-500 via-harmony-400 to-therapy-600': {
      colors: ['hsl(var(--flow-500))', 'hsl(var(--harmony-400))', 'hsl(var(--therapy-600))'],
      direction: '135deg'
    },
    'from-balance-400 via-therapy-500 to-mindful-600': {
      colors: ['hsl(var(--balance-400))', 'hsl(var(--therapy-500))', 'hsl(var(--mindful-600))'],
      direction: '135deg'
    },
    'from-therapy-500 via-harmony-400 to-balance-600': {
      colors: ['hsl(var(--therapy-500))', 'hsl(var(--harmony-400))', 'hsl(var(--balance-600))'],
      direction: '135deg'
    },
    'from-primary-500 via-secondary-400 to-accent-600': {
      colors: ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))'],
      direction: '135deg'
    }
  };

  const gradient = gradientMap[gradientClasses] || {
    colors: ['hsl(var(--primary))', 'hsl(var(--secondary))'],
    direction: '135deg'
  };

  return gradient;
};