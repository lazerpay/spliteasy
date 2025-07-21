import { 
  AppShell, 
  Container, 
  Title, 
  SimpleGrid, 
  Stack, 
  Text, 
  Group, 
  Button,
  Paper,
  LoadingOverlay
} from '@mantine/core';
import { Plus, Handshake, Users, UserPlus } from 'lucide-react';
import { TransactionStatus } from '../types/enums';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FinancialSummaryCard } from './FinancialSummaryCard';
import { QuickActionButton } from './QuickActionButton';
import { ActivityItem } from './ActivityItem';
import { SimpleGroupCard } from './SimpleGroupCard';
import { FriendItem } from './FriendItem';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { EmptyState } from './EmptyState';
import { AddExpenseModal } from './AddExpenseModal';
import { CreateGroupModal } from './CreateGroupModal';
import { InviteFriendsModal } from './InviteFriendsModal';
import { RecurringBillModal } from './RecurringBillModal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { BillsStorageService } from '../services/billsStorageService';

export function Dashboard() {
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure();
  const [expenseModalOpened, { open: openExpenseModal, close: closeExpenseModal }] = useDisclosure(false);
  const [createGroupModalOpened, { open: openCreateGroupModal, close: closeCreateGroupModal }] = useDisclosure(false);
  const [inviteFriendsModalOpened, { open: openInviteFriendsModal, close: closeInviteFriendsModal }] = useDisclosure(false);
  const [recurringBillModalOpened, { open: openRecurringBillModal, close: closeRecurringBillModal }] = useDisclosure(false);
  const {
    user,
    summary,
    transactions: recentTransactions,
    groups,
    friends,
    isFirstTime,
    isLoading,
    completeOnboarding,
    addTransaction,
    addGroup,
    updateTransaction,
    deleteTransaction
  } = useLocalStorage();

  const handleAddExpense = () => {
    if (isFirstTime) {
      completeOnboarding();
    }
    openExpenseModal();
  };

  const handleSettleUp = () => {
    if (isFirstTime) {
      completeOnboarding();
    }
    openRecurringBillModal();
  };

  const handleCreateGroup = () => {
    if (isFirstTime) {
      completeOnboarding();
    }
    openCreateGroupModal();
  };

  const handleInviteFriends = () => {
    if (isFirstTime) {
      completeOnboarding();
    }
    openInviteFriendsModal();
  };

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

  const handleRecurringBillSubmit = (billData: any) => {
    try {
      BillsStorageService.saveBill(billData);
      console.log('Recurring bill created and saved:', billData);
    } catch (error) {
      console.error('Failed to save recurring bill:', error);
    }
  };

  const handleViewAllActivity = () => {
    navigate('/history');
  };

  const handleViewAllGroups = () => {
    navigate('/groups');
  };

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

  if (!user || !summary) {
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

  // Show empty state until user has added their first expense
  if (recentTransactions.length === 0) {
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
          <Container size="xl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <EmptyState onGetStarted={handleGetStarted} />
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
            {/* Welcome Section */}
            <div>
              <Title order={1} mb="xs">
                👋 Welcome back, {user.name.split(' ')[0]}!
              </Title>
              <Text c="dimmed" size="lg">
                Here's your financial overview
              </Text>
            </div>

            {/* Financial Summary Cards */}
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
              <FinancialSummaryCard
                title="Total Balance"
                amount={summary.totalBalance}
                type={summary.totalBalance >= 0 ? 'positive' : 'negative'}
                subtitle={summary.totalBalance >= 0 ? 'Overall, you are owed' : 'Overall, you owe'}
              />
              <FinancialSummaryCard
                title="You Owe"
                amount={summary.youOwe}
                type="negative"
              />
              <FinancialSummaryCard
                title="You're Owed"
                amount={summary.youAreOwed}
                type="positive"
              />
              <FinancialSummaryCard
                title="This Month"
                amount={summary.monthlySpending}
                type="neutral"
                subtitle="Total spending"
              />
            </SimpleGrid>

            {/* Quick Actions */}
            <Paper p="lg" radius="md" withBorder>
              <Title order={3} mb="md">
                Quick Actions
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
                <QuickActionButton
                  leftSection={<Plus size={20} />}
                  onClick={handleAddExpense}
                  fullWidth
                >
                  Add Expense
                </QuickActionButton>
                <QuickActionButton
                  leftSection={<Handshake size={20} />}
                  variant="light"
                  onClick={handleSettleUp}
                  fullWidth
                >
                  Set up recurring bill
                </QuickActionButton>
                <QuickActionButton
                  leftSection={<Users size={20} />}
                  variant="light"
                  onClick={handleCreateGroup}
                  fullWidth
                >
                  Create Group
                </QuickActionButton>
                <QuickActionButton
                  leftSection={<UserPlus size={20} />}
                  variant="light"
                  onClick={handleInviteFriends}
                  fullWidth
                >
                  Invite Friends
                </QuickActionButton>
              </SimpleGrid>
            </Paper>

            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
              {/* Recent Activity */}
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={3}>Recent Activity</Title>
                  <Button variant="subtle" size="sm" onClick={handleViewAllActivity}>
                    View All
                  </Button>
                </Group>
                
                {recentTransactions.length > 0 ? (
                  <Stack gap="sm">
                    {recentTransactions.slice(0, 4).map((transaction) => (
                      <ActivityItem 
                        key={transaction.id} 
                        transaction={transaction}
                        onMarkAsSettled={handleMarkAsSettled}
                        onDelete={handleDeleteTransaction}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Paper p="xl" ta="center" c="dimmed">
                    <Text>No recent activity</Text>
                    <Text fz="14px">Get started by adding your first expense!</Text>
                  </Paper>
                )}
              </Stack>

              {/* Groups */}
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={3}>My Groups</Title>
                  <Button variant="subtle" size="sm" onClick={handleViewAllGroups}>
                    View All
                  </Button>
                </Group>
                <SimpleGrid cols={1} spacing="md">
                  {groups.slice(0, 3).map((group) => (
                    <SimpleGroupCard 
                      key={group.id} 
                      group={group}
                    />
                  ))}
                </SimpleGrid>
              </Stack>
            </SimpleGrid>
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

      {/* Invite Friends Modal */}
      <InviteFriendsModal
        opened={inviteFriendsModalOpened}
        onClose={closeInviteFriendsModal}
      />

      {/* Recurring Bill Modal */}
      <RecurringBillModal
        opened={recurringBillModalOpened}
        onClose={closeRecurringBillModal}
        onSubmit={handleRecurringBillSubmit}
        connectedCards={[]}
      />
    </AppShell>
  );
}