import { 
  AppShell, 
  Container, 
  Title, 
  Stack, 
  Text, 
  Group, 
  Button,
  LoadingOverlay,
  Modal
} from '@mantine/core';
import { Trash2 } from 'lucide-react';
import { TransactionStatus } from '../types/enums';
import { useDisclosure } from '@mantine/hooks';
import { useState, useMemo } from 'react';

import { ActivityItem } from './ActivityItem';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { EmptyState } from './EmptyState';
import { AddExpenseModal } from './AddExpenseModal';
import { CreateGroupModal } from './CreateGroupModal';
import { HistorySearchBar } from './HistorySearchBar';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function History() {
  const [opened, { toggle }] = useDisclosure();
  const [expenseModalOpened, { open: openExpenseModal, close: closeExpenseModal }] = useDisclosure(false);
  const [createGroupModalOpened, { open: openCreateGroupModal, close: closeCreateGroupModal }] = useDisclosure(false);
  const [clearModalOpened, { open: openClearModal, close: closeClearModal }] = useDisclosure(false);
  const [searchQuery, setSearchQuery] = useState('');
  const {
    user,
    transactions,
    groups,
    isLoading,
    completeOnboarding,
    addTransaction,
    addGroup,
    updateTransaction,
    deleteTransaction,
    clearAllData
  } = useLocalStorage();

  const handleGetStarted = () => {
    completeOnboarding();
    openExpenseModal();
  };

  const handleMarkAsSettled = (transactionId: string) => {
    updateTransaction(transactionId, { status: TransactionStatus.SETTLED });
  };

  const handleDeleteTransaction = (transactionId: string) => {
    deleteTransaction(transactionId);
  };

  const handleClearAllActivities = () => {
    clearAllData();
    closeClearModal();
  };

  // Filter transactions based on search query
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    
    const query = searchQuery.toLowerCase();
    return transactions.filter(transaction => 
      transaction.description.toLowerCase().includes(query) ||
      (transaction.groupName && transaction.groupName.toLowerCase().includes(query)) ||
      (transaction.paidBy && transaction.paidBy.toLowerCase().includes(query)) ||
      (transaction.splitBetween && transaction.splitBetween.some(member => 
        member.toLowerCase().includes(query)
      ))
    );
  }, [transactions, searchQuery]);

  if (isLoading) {
    return (
      <AppShell
        header={{ height: 70 }}
        navbar={{
          width: 250,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <LoadingOverlay visible />
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell
        header={{ height: 70 }}
        navbar={{
          width: 250,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <Container size="xl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <EmptyState onGetStarted={handleGetStarted} />
        </Container>
        
        {/* Add Expense Modal */}
        <AddExpenseModal
          opened={expenseModalOpened}
          onClose={closeExpenseModal}
          onSubmit={addTransaction}
          groups={groups}
          currentUser={user?.name || ''}
          onGroupCreate={addGroup}
        />
      </AppShell>
    );
  }

  // Show empty state if no transactions
  if (transactions.length === 0) {
    return (
      <AppShell
        header={{ height: 70 }}
        navbar={{
          width: 250,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <Header user={user} opened={opened} toggle={toggle} />
        <Sidebar opened={opened} />
        <AppShell.Main>
          <Container size="xl">
            <Stack gap="xl">
              {/* Header */}
              <div>
                <Title order={1}>Activity History</Title>
                <Text c="dimmed" size="lg">
                  All your transactions and activities
                </Text>
              </div>

              <Container size="md" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <EmptyState onGetStarted={handleGetStarted} />
              </Container>
            </Stack>
          </Container>
        </AppShell.Main>

        {/* Add Expense Modal */}
        <AddExpenseModal
          opened={expenseModalOpened}
          onClose={closeExpenseModal}
          onSubmit={addTransaction}
          groups={groups}
          currentUser={user?.name || ''}
          onGroupCreate={addGroup}
        />

        {/* Create Group Modal */}
        <CreateGroupModal
          opened={createGroupModalOpened}
          onClose={closeCreateGroupModal}
          onSubmit={addGroup}
          currentUser={user?.name || ''}
        />
      </AppShell>
    );
  }

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <Header user={user} opened={opened} toggle={toggle} />
      <Sidebar opened={opened} />

      <AppShell.Main>
        <Container size="xl">
          <Stack gap="xl">
            {/* Header */}
            <div>
              <Title order={1}>Activity History</Title>
              <Text c="dimmed" size="lg">
                All your transactions and activities
              </Text>
            </div>

            {/* Search Bar */}
            <HistorySearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Activity List */}
            <Stack gap="md">
              <Group justify="space-between">
                <Text c="dimmed" fz="sm">
                  {searchQuery ? (
                    <>
                      {filteredTransactions.length} of {transactions.length} {transactions.length === 1 ? 'activity' : 'activities'}
                      {searchQuery && (
                        <Text component="span" fw={500} ml={4}>
                          matching "{searchQuery}"
                        </Text>
                      )}
                    </>
                  ) : (
                    <>
                      {transactions.length} {transactions.length === 1 ? 'activity' : 'activities'}
                    </>
                  )}
                </Text>
                {transactions.length > 0 && (
                  <Button
                    variant="light"
                    color="red"
                    leftSection={<Trash2 size={16} />}
                    onClick={openClearModal}
                    size="sm"
                  >
                    Clear All
                  </Button>
                )}
              </Group>
              
              {filteredTransactions.length > 0 ? (
                <Stack gap="sm">
                  {filteredTransactions.map((transaction) => (
                    <ActivityItem 
                      key={transaction.id} 
                      transaction={transaction}
                      onMarkAsSettled={handleMarkAsSettled}
                      onDelete={handleDeleteTransaction}
                    />
                  ))}
                </Stack>
              ) : searchQuery ? (
                <Stack gap="md" ta="center" py="xl">
                  <Text c="dimmed" fz="lg">
                    No activities found
                  </Text>
                  <Text c="dimmed" fz="sm">
                    Try adjusting your search terms or clear the search to see all activities
                  </Text>
                  <Button variant="light" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                </Stack>
              ) : null}
            </Stack>
          </Stack>
        </Container>
      </AppShell.Main>

      {/* Add Expense Modal */}
      <AddExpenseModal
        opened={expenseModalOpened}
        onClose={closeExpenseModal}
        onSubmit={addTransaction}
        groups={groups}
        currentUser={user?.name || ''}
        onGroupCreate={addGroup}
      />

      {/* Create Group Modal */}
      <CreateGroupModal
        opened={createGroupModalOpened}
        onClose={closeCreateGroupModal}
        onSubmit={addGroup}
        currentUser={user?.name || ''}
      />

      {/* Clear All Activities Confirmation Modal */}
      <Modal
        opened={clearModalOpened}
        onClose={closeClearModal}
        title="Clear All Activities"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to clear all activities? This action cannot be undone and will remove all your transaction history, groups, and financial data.
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={closeClearModal}>
              Cancel
            </Button>
            <Button color="red" onClick={handleClearAllActivities}>
              Clear All
            </Button>
          </Group>
        </Stack>
      </Modal>
    </AppShell>
  );
}