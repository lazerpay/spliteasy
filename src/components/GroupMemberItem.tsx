import { Group, Avatar, Text, Badge, ActionIcon } from '@mantine/core';
import { MoreVertical, User } from 'lucide-react';
import { BalanceType } from '../types/enums';
import { formatCurrency } from '../utils/formatters';

interface GroupMemberItemProps {
  name: string;
  balance: number;
  balanceType: BalanceType;
  avatarIndex: number;
  onMenuClick: () => void;
  isCurrentUser?: boolean;
}

export function GroupMemberItem({ 
  name, 
  balance, 
  balanceType, 
  avatarIndex, 
  onMenuClick,
  isCurrentUser = false 
}: GroupMemberItemProps) {
  const getStatusBadge = () => {
    if (Math.abs(balance) < 0.01) {
      return <Badge color="green" variant="light" size="sm">Settled</Badge>;
    }
    
    if (balanceType === BalanceType.OWED_TO_YOU) {
      return <Badge color="blue" variant="light" size="sm">Owes {formatCurrency(balance)}</Badge>;
    }
    
    if (balanceType === BalanceType.YOU_OWE) {
      return <Badge color="orange" variant="light" size="sm">Owed {formatCurrency(balance)}</Badge>;
    }
    
    return <Badge color="gray" variant="light" size="sm">Settled</Badge>;
  };

  return (
    <Group justify="space-between" p="sm" style={{ borderRadius: '8px', backgroundColor: 'var(--mantine-color-gray-0)' }}>
      <Group gap="md">
        <Avatar
          src={`https://i.pravatar.cc/150?img=${avatarIndex}`}
          size="md"
          radius="xl"
        >
          <User size={20} />
        </Avatar>
        
        <div>
          <Group gap="xs" align="center">
            <Text fw={500} fz="sm">
              {name}
              {isCurrentUser && (
                <Text component="span" c="dimmed" fz="xs" ml={4}>
                  (You)
                </Text>
              )}
            </Text>
          </Group>
          {getStatusBadge()}
        </div>
      </Group>

      <ActionIcon
        variant="subtle"
        color="gray"
        size="sm"
        onClick={onMenuClick}
      >
        <MoreVertical size={16} />
      </ActionIcon>
    </Group>
  );
}