import { createTheme, colorsTuple } from '@mantine/core';

const theme = createTheme({
  primaryColor: 'orange',
  colors: {
    orange: colorsTuple('#FE4E00'),
  },
  fontFamily: 'Figtree, system-ui, sans-serif',
  headings: {
    fontFamily: 'Figtree, system-ui, sans-serif',
    fontWeight: '600',
    sizes: {
      h1: { fontSize: '32px' },
      h3: { fontSize: '20px' }
    }
  },
  defaultRadius: 'md',
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  }
});

export default theme;