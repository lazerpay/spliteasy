import { Card, Text, Group, Avatar, Badge, Stack } from '@mantine/core';
import { Users } from 'lucide-react';
import { Group as GroupType, Transaction } from '../types/schema';
import { TransactionStatus } from '../types/enums';
import { formatCurrency } from '../utils/formatters';
import { DeleteGroupButton } from './DeleteGroupButton';
import { GroupActionButtons } from './GroupActionButtons';

interface GroupCardProps {
  group: GroupType;
  transactions: Transaction[];
  currentUser: string;
  onDeleteGroup: (groupId: string) => void;
  onRemoveMember: (groupId: string, memberName: string) => void;
  onMarkMemberAsSettled: (groupId: string, memberName: string) => void;
  onViewMembers: (group: GroupType) => void;
  onShowActivity: (group: GroupType) => void;
  onClick?: () => void;
}

export function GroupCard({ 
  group, 
  transactions, 
  currentUser, 
  onDeleteGroup, 
  onRemoveMember, 
  onMarkMemberAsSettled, 
  onViewMembers,
  onShowActivity,
  onClick 
}: GroupCardProps) {
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
    >
      <Stack gap="md">
        {/* Group Header */}
        <Group justify="space-between">
          <Group gap="md" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', flex: 1 }}>
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
          
          <DeleteGroupButton 
            groupName={group.name}
            onDelete={() => onDeleteGroup(group.id)}
          />
        </Group>

        {/* Balance Status */}
        {getBalanceText() && (
          <Text fz="14px" c={getBalanceColor()} fw={500}>
            {getBalanceText()}
          </Text>
        )}

        {/* Action Buttons */}
        <GroupActionButtons
          onViewMembers={() => onViewMembers(group)}
          onShowActivity={() => onShowActivity(group)}
        />
      </Stack>
    </Card>
  );
}