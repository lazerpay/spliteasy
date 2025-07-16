import { Paper, Group, Text, Badge, Avatar, Stack, Menu, ActionIcon } from '@mantine/core';
import { Receipt, CheckCircle, Users, UserPlus, MoreHorizontal, Check, Trash2 } from 'lucide-react';
import { Transaction } from '../types/schema';
import { formatDateTime, formatCurrency, formatTransactionType } from '../utils/formatters';
import { TransactionType, TransactionStatus } from '../types/enums';

interface ActivityItemProps {
  transaction: Transaction;
  onMarkAsSettled?: (transactionId: string) => void;
  onDelete?: (transactionId: string) => void;
}

export function ActivityItem({ transaction, onMarkAsSettled, onDelete }: ActivityItemProps) {
  const getIcon = () => {
    switch (transaction.type) {
      case TransactionType.EXPENSE:
        return <Receipt size={20} />;
      case TransactionType.SETTLEMENT:
        return <CheckCircle size={20} />;
      case TransactionType.GROUP_CREATED:
      case TransactionType.GROUP_JOINED:
        return <Users size={20} />;
      default:
        return <UserPlus size={20} />;
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case TransactionStatus.SETTLED:
        return 'green';
      case TransactionStatus.PARTIALLY_SETTLED:
        return 'yellow';
      case TransactionStatus.PENDING:
        return 'orange';
      default:
        return 'gray';
    }
  };

  const canMarkAsSettled = transaction.type === TransactionType.EXPENSE && 
                          transaction.status !== TransactionStatus.SETTLED;

  return (
    <Paper p="md" radius="md" withBorder>
      <Group justify="space-between" align="flex-start">
        <Group align="flex-start" gap="md" style={{ flex: 1 }}>
          <Avatar color="orange" variant="light" radius="md">
            {getIcon()}
          </Avatar>
          
          <Stack gap="xs" flex={1}>
            <Group justify="space-between" align="flex-start">
              <div style={{ flex: 1 }}>
                <Text fw={700} fz="16px">
                  {transaction.description}
                </Text>
                <Text fz="14px" c="dimmed">
                  {formatTransactionType(transaction.type)} • {formatDateTime(transaction.date)}
                </Text>
              </div>
              
              <Group gap="xs" align="center">
                {transaction.amount && (
                  <Text fw={600} fz="16px" c={transaction.type === TransactionType.SETTLEMENT ? 'green' : undefined}>
                    {formatCurrency(transaction.amount)}
                  </Text>
                )}
                
                {(onMarkAsSettled || onDelete) && (
                  <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray" size="sm">
                        <MoreHorizontal size={16} />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      {canMarkAsSettled && onMarkAsSettled && (
                        <Menu.Item
                          leftSection={<Check size={14} />}
                          onClick={() => onMarkAsSettled(transaction.id)}
                        >
                          Mark as settled
                        </Menu.Item>
                      )}
                      {onDelete && (
                        <Menu.Item
                          leftSection={<Trash2 size={14} />}
                          color="red"
                          onClick={() => onDelete(transaction.id)}
                        >
                          Delete activity
                        </Menu.Item>
                      )}
                    </Menu.Dropdown>
                  </Menu>
                )}
              </Group>
            </Group>
            
            {transaction.groupName && (
              <Text fz="14px" c="dimmed">
                in {transaction.groupName}
              </Text>
            )}
            
            {transaction.paidBy && (
              <Text fz="14px" c="dimmed">
                Paid by {transaction.paidBy}
              </Text>
            )}
            
            {transaction.splitBetween && transaction.splitBetween.length > 0 && (
              <Text fz="14px" c="dimmed">
                Split between: {transaction.splitBetween.join(', ')}
                {transaction.amount && transaction.splitBetween.length > 1 && (
                  <Text component="span" fw={500} ml={4}>
                    ({formatCurrency(transaction.amount / transaction.splitBetween.length)} per person)
                  </Text>
                )}
              </Text>
            )}
            
            {transaction.status && (
              <Badge fz="12px" color={getStatusColor()} variant="light">
                {transaction.status.replace('_', ' ')}
              </Badge>
            )}
          </Stack>
        </Group>
      </Group>
    </Paper>
  );
}