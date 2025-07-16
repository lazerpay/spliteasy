import { MantineProvider } from '@mantine/core';
import { Dashboard } from './src/components/Dashboard';
import theme from './src/theme/theme';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Dashboard />
    </MantineProvider>
  );
}