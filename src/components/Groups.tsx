import { 
  AppShell, 
  Container, 
  Title, 
  SimpleGrid, 
  Stack, 
  Text, 
  Group, 
  Button,
  TextInput,
  Paper,
  LoadingOverlay
} from '@mantine/core';
import { Plus, Search, Users } from 'lucide-react';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

import { GroupCard } from './GroupCard';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { CreateGroupModal } from './CreateGroupModal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { GroupsEmptyState } from './GroupsEmptyState';
import { DeleteAllGroupsButton } from './DeleteAllGroupsButton';
import { GroupDrawer } from './GroupDrawer';
import { AddExpenseModal } from './AddExpenseModal';
import { Group as GroupType } from '../types/schema';

export function Groups() {
  const [opened, { toggle }] = useDisclosure();
  const [createGroupModalOpened, { open: openCreateGroupModal, close: closeCreateGroupModal }] = useDisclosure(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [expenseModalOpened, { open: openExpenseModal, close: closeExpenseModal }] = useDisclosure(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null);
  const [drawerType, setDrawerType] = useState<'members' | 'activity' | null>(null);
  const [preselectedGroupId, setPreselectedGroupId] = useState<string>('');
  
  const {
    user,
    groups,
    transactions,
    isLoading,
    addGroup,
    addTransaction,
    deleteGroup,
    deleteAllGroups,
    removeMemberFromGroup,
    markMemberAsSettled,
    clearGroupActivity
  } = useLocalStorage();

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.members.some(member => 
      member.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleCreateGroup = () => {
    openCreateGroupModal();
  };

  const handleViewMembers = (group: GroupType) => {
    setSelectedGroup(group);
    setDrawerType('members');
    openDrawer();
  };

  const handleShowActivity = (group: GroupType) => {
    setSelectedGroup(group);
    setDrawerType('activity');
    openDrawer();
  };

  const handleCloseDrawer = () => {
    closeDrawer();
    setSelectedGroup(null);
    setDrawerType(null);
  };

  const handleAddExpense = (groupId: string) => {
    setPreselectedGroupId(groupId);
    // Close drawer first, then open expense modal
    closeDrawer();
    setSelectedGroup(null);
    setDrawerType(null);
    // Use setTimeout to ensure drawer closes before modal opens
    setTimeout(() => {
      openExpenseModal();
    }, 100);
  };

  const handleCloseExpenseModal = () => {
    closeExpenseModal();
    setPreselectedGroupId('');
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
            {/* Page Header */}
            <Group justify="space-between" align="flex-end">
              <div>
                <Title order={1} mb="xs">
                  My Groups
                </Title>
                <Text c="dimmed" size="lg">
                  Manage your expense groups and track shared costs
                </Text>
              </div>
              <Group gap="md">
                <DeleteAllGroupsButton 
                  onDeleteAll={deleteAllGroups}
                  groupCount={groups.length}
                />
                <Button 
                  leftSection={<Plus size={20} />}
                  onClick={handleCreateGroup}
                >
                  Create Group
                </Button>
              </Group>
            </Group>

            {/* Search and Filters */}
            {groups.length > 0 && (
              <Paper p="md" radius="md" withBorder>
                <Group gap="md">
                  <TextInput
                    placeholder="Search groups or members..."
                    leftSection={<Search size={16} />}
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.currentTarget.value)}
                    style={{ flex: 1 }}
                  />
                  <Text c="dimmed" fz="sm">
                    {filteredGroups.length} of {groups.length} groups
                  </Text>
                </Group>
              </Paper>
            )}

            {/* Groups Grid */}
            {filteredGroups.length > 0 ? (
              <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="md">
                {filteredGroups.map((group) => (
                  <GroupCard 
                    key={group.id} 
                    group={group}
                    transactions={transactions}
                    currentUser={user?.name || ''}
                    onDeleteGroup={deleteGroup}
                    onRemoveMember={removeMemberFromGroup}
                    onMarkMemberAsSettled={markMemberAsSettled}
                    onViewMembers={handleViewMembers}
                    onShowActivity={handleShowActivity}
                  />
                ))}
              </SimpleGrid>
            ) : groups.length === 0 ? (
              <GroupsEmptyState onCreateGroup={handleCreateGroup} />
            ) : (
              <Paper p="xl" ta="center" c="dimmed">
                <Users size={48} style={{ opacity: 0.5, margin: '0 auto 16px' }} />
                <Text fz="lg" fw={500} mb="xs">
                  No groups found
                </Text>
                <Text fz="sm">
                  Try adjusting your search terms or create a new group
                </Text>
              </Paper>
            )}
          </Stack>
        </Container>
      </AppShell.Main>

      {/* Create Group Modal */}
      <CreateGroupModal
        opened={createGroupModalOpened}
        onClose={closeCreateGroupModal}
        onSubmit={addGroup}
        currentUser={user?.name || ''}
      />

      {/* Group Drawer */}
      <GroupDrawer
        opened={drawerOpened}
        onClose={handleCloseDrawer}
        group={selectedGroup}
        transactions={transactions}
        currentUser={user?.name || ''}
        drawerType={drawerType}
        onRemoveMember={removeMemberFromGroup}
        onMarkMemberAsSettled={markMemberAsSettled}
        onClearGroupActivity={clearGroupActivity}
        onAddExpense={handleAddExpense}
      />

      {/* Add Expense Modal */}
      <AddExpenseModal
        opened={expenseModalOpened}
        onClose={handleCloseExpenseModal}
        onSubmit={addTransaction}
        groups={groups}
        currentUser={user?.name || ''}
        onGroupCreate={addGroup}
        preselectedGroupId={preselectedGroupId}
      />
    </AppShell>
  );
}