import { Stack, Text, Paper, Group, Badge, Avatar, Button, Modal } from '@mantine/core';
import { useState } from 'react';
import { Group as GroupType, Transaction } from '../types/schema';
import { TransactionType } from '../types/enums';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { DollarSign, Users, Handshake, Trash2, AlertTriangle, Plus } from 'lucide-react';
import { useDisclosure } from '@mantine/hooks';

interface GroupActivityViewProps {
  group: GroupType;
  transactions: Transaction[];
  currentUser: string;
  onClearActivity: () => void;
  onAddExpense: (groupId: string) => void;
}

export function GroupActivityView({ group, transactions, currentUser, onClearActivity, onAddExpense }: GroupActivityViewProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const groupTransactions = transactions.filter(t => t.groupName === group.name);

  const handleClearActivity = () => {
    onClearActivity();
    close();
  };
  
  const getActivityIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.EXPENSE:
        return <DollarSign size={16} />;
      case TransactionType.SETTLEMENT:
        return <Handshake size={16} />;
      case TransactionType.GROUP_CREATED:
        return <Users size={16} />;
      default:
        return <DollarSign size={16} />;
    }
  };

  const getStatusColor = (transaction: Transaction) => {
    if (transaction.status === 'settled') return 'green';
    if (transaction.status === 'partially_settled') return 'yellow';
    return 'blue';
  };

  if (groupTransactions.length === 0) {
    return (
      <Stack gap="md" ta="center" py="xl">
        <Text c="dimmed" fz="lg">
          No activity yet
        </Text>
        <Text c="dimmed" fz="sm">
          Start by adding an expense to this group
        </Text>
        <Button
          leftSection={<Plus size={16} />}
          onClick={() => onAddExpense(group.id)}
          mt="md"
        >
          Add Expense
        </Button>
      </Stack>
    );
  }

  return (
    <>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Text fz="sm" c="dimmed">
            All activity for this group
          </Text>
          {groupTransactions.length > 0 && (
            <Button
              variant="light"
              color="red"
              size="sm"
              leftSection={<Trash2 size={16} />}
              onClick={open}
            >
              Clear All Activity
            </Button>
          )}
        </Group>
      
      <Stack gap="sm">
        {groupTransactions.map((transaction) => (
          <Paper key={transaction.id} p="md" withBorder radius="md">
            <Stack gap="sm">
              <Group justify="space-between" align="flex-start">
                <Group gap="md">
                  <Avatar size="sm" radius="xl" color="blue">
                    {getActivityIcon(transaction.type)}
                  </Avatar>
                  <div>
                    <Text fw={500} fz="sm">
                      {transaction.description}
                    </Text>
                    <Text fz="xs" c="dimmed">
                      {formatDateTime(transaction.date)}
                    </Text>
                  </div>
                </Group>
                
                <div style={{ textAlign: 'right' }}>
                  {transaction.amount && (
                    <Text fw={600} fz="sm">
                      {formatCurrency(transaction.amount)}
                    </Text>
                  )}
                  {transaction.status && (
                    <Badge 
                      size="xs" 
                      color={getStatusColor(transaction)}
                      variant="light"
                    >
                      {transaction.status.replace('_', ' ')}
                    </Badge>
                  )}
                </div>
              </Group>
              
              {transaction.paidBy && (
                <Group gap="xs">
                  <Text fz="xs" c="dimmed">
                    Paid by: <Text component="span" fw={500}>{transaction.paidBy}</Text>
                  </Text>
                </Group>
              )}
              
              {transaction.splitBetween && transaction.splitBetween.length > 0 && (
                <Group gap="xs">
                  <Text fz="xs" c="dimmed">
                    Split between: <Text component="span" fw={500}>
                      {transaction.splitBetween.join(', ')}
                    </Text>
                  </Text>
                </Group>
              )}
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>

    {/* Clear Activity Confirmation Modal */}
    <Modal
      opened={opened}
      onClose={close}
      title={
        <Group gap="xs">
          <AlertTriangle size={20} color="red" />
          <Text fw={600}>Clear All Activity</Text>
        </Group>
      }
      centered
    >
      <Stack gap="md">
        <Text>
          Are you sure you want to clear all activity for "{group.name}"? This action cannot be undone.
        </Text>
        
        <Text fz="sm" c="dimmed">
          ⚠️ This will permanently remove all transaction history for this group.
        </Text>

        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={close}>
            Cancel
          </Button>
          <Button color="red" onClick={handleClearActivity}>
            Clear All Activity
          </Button>
        </Group>
      </Stack>
    </Modal>
  </>
  );
}