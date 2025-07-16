import { Group, Button } from '@mantine/core';
import { Users, History } from 'lucide-react';

interface GroupActionButtonsProps {
  onViewMembers: () => void;
  onShowActivity: () => void;
}

export function GroupActionButtons({ onViewMembers, onShowActivity }: GroupActionButtonsProps) {
  return (
    <Group gap="sm">
      <Button
        variant="light"
        size="sm"
        leftSection={<Users size={16} />}
        onClick={onViewMembers}
      >
        View Members
      </Button>
      <Button
        variant="light"
        size="sm"
        leftSection={<History size={16} />}
        onClick={onShowActivity}
      >
        Show Activity
      </Button>
    </Group>
  );
}