import { Group, Text } from '@mantine/core';
import { Split } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function Logo({ size = 'md', color = 'orange' }: LogoProps) {
  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 20;
      case 'lg':
        return 28;
      default:
        return 24;
    }
  };

  return (
    <Group gap="xs" align="center">
      <Split size={getIconSize()} color={`var(--mantine-color-${color}-6)`} />
      <Text
        fw={400}
        c={color}
        style={{
          fontFamily: 'Lobster, cursive',
          fontSize: '24px',
          lineHeight: 1.2
        }}
      >
        SplitEasy
      </Text>
    </Group>
  );
}