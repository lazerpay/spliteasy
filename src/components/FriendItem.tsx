import { Group, Avatar, Text, Badge } from '@mantine/core';
import { Friend } from '../types/schema';
import { BalanceType } from '../types/enums';
import { formatCurrency } from '../utils/formatters';

interface FriendItemProps {
  friend: Friend;
  onClick?: () => void;
}

export function FriendItem({ friend, onClick }: FriendItemProps) {
  const getBalanceColor = () => {
    switch (friend.balanceType) {
      case BalanceType.OWED_TO_YOU:
        return 'green';
      case BalanceType.YOU_OWE:
        return 'red';
      default:
        return 'gray';
    }
  };

  const getBalanceText = () => {
    if (friend.balanceType === BalanceType.SETTLED) {
      return 'Settled up';
    }
    return formatCurrency(friend.balance);
  };

  return (
    <Group 
      justify="space-between" 
      p="md" 
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: '8px',
        '&:hover': onClick ? { backgroundColor: 'var(--mantine-color-gray-0)' } : {}
      }}
      onClick={onClick}
    >
      <Group gap="md">
        <Avatar src={friend.avatar} size="md" radius="xl" />
        <div>
          <Text fw={500} size="sm">
            {friend.name}
          </Text>
          <Text size="xs" c="dimmed">
            {friend.email}
          </Text>
        </div>
      </Group>

      <Badge 
        variant="light" 
        color={getBalanceColor()}
        size="sm"
      >
        {getBalanceText()}
      </Badge>
    </Group>
  );
}