import { Card, Text, Group, Avatar, Badge } from '@mantine/core';
import { Users } from 'lucide-react';
import { Group as GroupType } from '../types/schema';
import { TransactionStatus } from '../types/enums';
import { formatCurrency } from '../utils/formatters';

interface GroupCardProps {
  group: GroupType;
  onClick?: () => void;
}

export function GroupCard({ group, onClick }: GroupCardProps) {
  const hasActivity = group.expenses && group.expenses.length > 0;
  const hasBalance = Math.abs(group.totalBalance) > 0.01; // Account for floating point precision
  
  // Check if all activities are settled
  const allActivitiesSettled = hasActivity && 
    group.expenses!.every(expense => expense.status === TransactionStatus.SETTLED);

  const getBalanceColor = () => {
    if (group.totalBalance > 0) return 'green';
    if (group.totalBalance < 0) return 'red';
    return 'gray';
  };

  const getBalanceText = () => {
    // Don't show status if no activity
    if (!hasActivity) return null;
    
    // Show settled message if balance is 0 or all activities are settled
    if (!hasBalance || allActivitiesSettled) {
      return '🔥 All settled up';
    }
    
    if (group.totalBalance > 0) return `🤩 You are owed ${formatCurrency(group.totalBalance)}`;
    if (group.totalBalance < 0) return `☹️ You owe ${formatCurrency(Math.abs(group.totalBalance))}`;
    
    return null;
  };

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder 
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <Group justify="space-between" mb={getBalanceText() ? "md" : undefined}>
        <Group gap="md">
          <Avatar src={group.avatar} size="md" radius="md">
            <Users size={20} />
          </Avatar>
          <Text fw={700} fz="16px">
            {group.name}
          </Text>
        </Group>
        <Badge variant="light" color="blue" fz="12px">
          {group.memberCount} members
        </Badge>
      </Group>

      {getBalanceText() && (
        <Text fz="14px" c={getBalanceColor()} fw={500}>
          {getBalanceText()}
        </Text>
      )}
    </Card>
  );
}