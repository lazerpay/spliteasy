import { 
  Paper, 
  Text, 
  Group, 
  Stack,
  ThemeIcon
} from '@mantine/core';
import { ReactNode } from 'react';

interface StatisticCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: string;
  trend?: 'up' | 'down' | 'same';
}

export function StatisticCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'blue',
  trend 
}: StatisticCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'green';
      case 'down': return 'red';
      default: return 'gray';
    }
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      // Format currency values
      if (title.toLowerCase().includes('spent') || title.toLowerCase().includes('amount')) {
        return `$${val.toFixed(2)}`;
      }
      // Format regular numbers
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Paper p="md" radius="md" withBorder>
      <Stack gap="xs">
        <Group justify="space-between" align="flex-start">
          <Text fz="sm" c="dimmed" fw={500}>
            {title}
          </Text>
          <ThemeIcon 
            size="sm" 
            variant="light" 
            color={color}
          >
            {icon}
          </ThemeIcon>
        </Group>
        
        <Text fz="xl" fw={700} c={color}>
          {formatValue(value)}
        </Text>
        
        {subtitle && (
          <Text fz="xs" c={trend ? getTrendColor() : 'dimmed'}>
            {subtitle}
          </Text>
        )}
      </Stack>
    </Paper>
  );
}