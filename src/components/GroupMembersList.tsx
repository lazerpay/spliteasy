import { Group, Avatar, Text, Stack, Tooltip } from '@mantine/core';
import { User } from 'lucide-react';

interface GroupMembersListProps {
  members: string[];
  maxVisible?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function GroupMembersList({ members, maxVisible = 4, size = 'sm' }: GroupMembersListProps) {
  const visibleMembers = members.slice(0, maxVisible);
  const remainingCount = members.length - maxVisible;

  return (
    <Group gap="xs">
      {visibleMembers.map((member, index) => (
        <Tooltip key={member} label={member} position="top">
          <Avatar
            size={size}
            radius="xl"
            src={`https://i.pravatar.cc/150?img=${index + 5}`}
          >
            <User size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} />
          </Avatar>
        </Tooltip>
      ))}
      
      {remainingCount > 0 && (
        <Tooltip 
          label={
            <Stack gap={2}>
              {members.slice(maxVisible).map(member => (
                <Text key={member} fz="xs">{member}</Text>
              ))}
            </Stack>
          } 
          position="top"
        >
          <Avatar size={size} radius="xl" color="gray">
            <Text fz={size === 'xs' ? 10 : size === 'sm' ? 12 : 14} fw={500}>
              +{remainingCount}
            </Text>
          </Avatar>
        </Tooltip>
      )}
    </Group>
  );
}