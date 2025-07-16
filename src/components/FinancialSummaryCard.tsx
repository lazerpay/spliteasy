import { Card, Text, Group, ThemeIcon } from '@mantine/core';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface FinancialSummaryCardProps {
  title: string;
  amount: number;
  type: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
}

export function FinancialSummaryCard({ title, amount, type, subtitle }: FinancialSummaryCardProps) {
  const isZeroBalance = Math.abs(amount) < 0.01; // Account for floating point precision
  const isTotalBalance = title === 'Total Balance';
  
  const getIcon = () => {
    switch (type) {
      case 'positive':
        return <TrendingUp size={20} />;
      case 'negative':
        return <TrendingDown size={20} />;
      default:
        return <DollarSign size={20} />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'positive':
        return 'green';
      case 'negative':
        return 'red';
      default:
        return 'blue';
    }
  };

  const getSubtitle = () => {
    // Show settled message for Total Balance when amount is 0
    if (isTotalBalance && isZeroBalance) {
      return '🔥 All settled up';
    }
    return subtitle;
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text size="sm" c="dimmed" fw={500}>
          {title}
        </Text>
        <ThemeIcon variant="light" color={getColor()} size="xl" p="xs">
          {getIcon()}
        </ThemeIcon>
      </Group>
      
      <Text fw={700} fz="32px" c={type === 'negative' ? 'red' : type === 'positive' ? 'green' : undefined}>
        {type === 'negative' && amount > 0 ? '-' : ''}{formatCurrency(amount)}
      </Text>
      
      {getSubtitle() && (
        <Text fz="14px" c="dimmed" mt={4}>
          {isTotalBalance && isZeroBalance ? '' : (type === 'negative' ? '☹️ ' : type === 'positive' ? '🤩 ' : '')}{getSubtitle()}
        </Text>
      )}
    </Card>
  );
}