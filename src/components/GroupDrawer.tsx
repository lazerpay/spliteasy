import { Drawer, Title, Stack, Group, Avatar } from '@mantine/core';
import { Users } from 'lucide-react';
import { Group as GroupType, Transaction } from '../types/schema';
import { GroupMembersView } from './GroupMembersView';
import { GroupActivityView } from './GroupActivityView';

interface GroupDrawerProps {
  opened: boolean;
  onClose: () => void;
  group: GroupType | null;
  transactions: Transaction[];
  currentUser: string;
  drawerType: 'members' | 'activity' | null;
  onRemoveMember: (groupId: string, memberName: string) => void;
  onMarkMemberAsSettled: (groupId: string, memberName: string) => void;
  onClearGroupActivity: (groupId: string) => void;
  onAddExpense: (groupId: string) => void;
}

export function GroupDrawer({
  opened,
  onClose,
  group,
  transactions,
  currentUser,
  drawerType,
  onRemoveMember,
  onMarkMemberAsSettled,
  onClearGroupActivity,
  onAddExpense
}: GroupDrawerProps) {
  if (!group) return null;

  const getTitle = () => {
    if (drawerType === 'members') return 'Members';
    if (drawerType === 'activity') return 'Activity History';
    return group.name;
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="md" align="center">
          <Avatar src={group.avatar} size="sm" radius="md">
            <Users size={16} />
          </Avatar>
          <div>
            <Title order={3}>{group.name}</Title>
            <Title order={5} c="dimmed" fw={400}>
              {getTitle()}
            </Title>
          </div>
        </Group>
      }
      position="right"
      size="md"
      padding="lg"
      transitionProps={{
        transition: 'slide-left',
        duration: 300,
        timingFunction: 'ease-in-out'
      }}
    >
      <Stack gap="md">
        {drawerType === 'members' && (
          <GroupMembersView
            group={group}
            transactions={transactions}
            currentUser={currentUser}
            onRemoveMember={onRemoveMember}
            onMarkMemberAsSettled={onMarkMemberAsSettled}
          />
        )}
        
        {drawerType === 'activity' && (
          <GroupActivityView
            group={group}
            transactions={transactions}
            currentUser={currentUser}
            onClearActivity={() => onClearGroupActivity(group.id)}
            onAddExpense={onAddExpense}
          />
        )}
      </Stack>
    </Drawer>
  );
}