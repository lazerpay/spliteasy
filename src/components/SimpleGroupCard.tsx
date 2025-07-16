import { Card, Text, Group, Avatar, Badge } from '@mantine/core';
import { Users } from 'lucide-react';
import { Group as GroupType } from '../types/schema';
import { TransactionStatus } from '../types/enums';
import { formatCurrency } from '../utils/formatters';
import { GroupMembersList } from './GroupMembersList';

interface SimpleGroupCardProps {
  group: GroupType;
  onClick?: () => void;
}

export function SimpleGroupCard({ group, onClick }: SimpleGroupCardProps) {
  const hasActivity = group.expenses && group.expenses.length > 0;
  const hasBalance = Math.abs(group.totalBalance) > 0.01;
  
  const allActivitiesSettled = hasActivity && 
    group.expenses!.every(expense => expense.status === TransactionStatus.SETTLED);

  const getBalanceColor = () => {
    if (group.totalBalance > 0) return 'green';
    if (group.totalBalance < 0) return 'red';
    return 'gray';
  };

  const getBalanceText = () => {
    if (!hasActivity) return null;
    
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
      {/* Group Header - Name and Member Count in Row */}
      <Group justify="space-between" mb="md">
        <Group gap="md">
          <Avatar src={group.avatar} size="md" radius="md">
            <Users size={20} />
          </Avatar>
          <Group gap="xs" align="center">
            <Text fw={700} fz="16px">
              {group.name}
            </Text>
            <Badge variant="light" color="blue" fz="12px">
              {group.memberCount} members
            </Badge>
          </Group>
        </Group>
      </Group>

      {/* Members Avatars with Tooltips */}
      <Group justify="space-between" align="flex-start" mb={getBalanceText() ? "md" : undefined}>
        <div>
          <Text fz="xs" c="dimmed" fw={500} mb={4}>
            Members
          </Text>
          <GroupMembersList members={group.members} maxVisible={4} size="sm" />
        </div>
      </Group>

      {/* Balance Status */}
      {getBalanceText() && (
        <Text fz="14px" c={getBalanceColor()} fw={500}>
          {getBalanceText()}
        </Text>
      )}
    </Card>
  );
}