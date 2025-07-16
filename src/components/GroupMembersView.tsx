import { Stack, Text, Menu } from '@mantine/core';
import { useState } from 'react';
import { Group as GroupType, Transaction } from '../types/schema';
import { calculateGroupMemberBalances } from '../utils/groupUtils';
import { GroupMemberItem } from './GroupMemberItem';
import { GroupMemberMenu } from './GroupMemberMenu';

interface GroupMembersViewProps {
  group: GroupType;
  transactions: Transaction[];
  currentUser: string;
  onRemoveMember: (groupId: string, memberName: string) => void;
  onMarkMemberAsSettled: (groupId: string, memberName: string) => void;
}

export function GroupMembersView({
  group,
  transactions,
  currentUser,
  onRemoveMember,
  onMarkMemberAsSettled
}: GroupMembersViewProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const memberBalances = calculateGroupMemberBalances(group, transactions, currentUser);

  const handleMemberMenuClick = (memberName: string) => {
    setActiveMenu(activeMenu === memberName ? null : memberName);
  };

  const handleMarkAsSettled = (memberName: string) => {
    onMarkMemberAsSettled(group.id, memberName);
    setActiveMenu(null);
  };

  const handleRemoveMember = (memberName: string) => {
    onRemoveMember(group.id, memberName);
    setActiveMenu(null);
  };

  return (
    <Stack gap="md">
      <Text fz="sm" c="dimmed">
        Manage group members and their balances
      </Text>
      
      <Stack gap="xs">
        {memberBalances.map((member, index) => (
          <Menu
            key={member.name}
            opened={activeMenu === member.name}
            onClose={() => setActiveMenu(null)}
            position="bottom-end"
            withArrow
          >
            <Menu.Target>
              <div>
                <GroupMemberItem
                  name={member.name}
                  balance={member.balance}
                  balanceType={member.balanceType}
                  avatarIndex={index + 5}
                  onMenuClick={() => handleMemberMenuClick(member.name)}
                  isCurrentUser={member.name === currentUser}
                />
              </div>
            </Menu.Target>
            
            <Menu.Dropdown>
              <GroupMemberMenu
                memberName={member.name}
                isSettled={member.balanceType === 'settled'}
                onMarkAsSettled={() => handleMarkAsSettled(member.name)}
                onDeleteMember={() => handleRemoveMember(member.name)}
                isCurrentUser={member.name === currentUser}
              />
            </Menu.Dropdown>
          </Menu>
        ))}
      </Stack>
    </Stack>
  );
}