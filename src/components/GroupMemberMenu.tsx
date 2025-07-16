import { Menu, Text } from '@mantine/core';
import { Check, UserMinus } from 'lucide-react';

interface GroupMemberMenuProps {
  memberName: string;
  isSettled: boolean;
  onMarkAsSettled: () => void;
  onDeleteMember: () => void;
  isCurrentUser?: boolean;
}

export function GroupMemberMenu({ 
  memberName, 
  isSettled, 
  onMarkAsSettled, 
  onDeleteMember,
  isCurrentUser = false 
}: GroupMemberMenuProps) {
  return (
    <>
      <Menu.Item
        leftSection={<Check size={16} />}
        onClick={onMarkAsSettled}
        disabled={isSettled}
      >
        <Text fz="sm">
          {isSettled ? 'Already settled' : 'Mark as settled'}
        </Text>
      </Menu.Item>
      
      {!isCurrentUser && (
        <Menu.Item
          leftSection={<UserMinus size={16} />}
          color="red"
          onClick={onDeleteMember}
        >
          <Text fz="sm">Remove from group</Text>
        </Menu.Item>
      )}
    </>
  );
}