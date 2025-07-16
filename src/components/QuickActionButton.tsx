import { Button } from '@mantine/core';
import { ReactNode } from 'react';

interface QuickActionButtonProps {
  children: ReactNode;
  leftSection?: ReactNode;
  variant?: 'filled' | 'outline' | 'light';
  color?: string;
  onClick?: () => void;
  fullWidth?: boolean;
}

export function QuickActionButton({ 
  children, 
  leftSection, 
  variant = 'filled', 
  color = 'orange',
  onClick,
  fullWidth = false
}: QuickActionButtonProps) {
  return (
    <Button
      leftSection={leftSection}
      variant={variant}
      color={color}
      size="md"
      fullWidth={fullWidth}
      onClick={onClick}
      radius="md"
    >
      {children}
    </Button>
  );
}