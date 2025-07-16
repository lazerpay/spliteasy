import { Stack, Text, Button, Paper } from '@mantine/core';
import { Users, Plus } from 'lucide-react';

interface GroupsEmptyStateProps {
  onCreateGroup: () => void;
}

export function GroupsEmptyState({ onCreateGroup }: GroupsEmptyStateProps) {
  return (
    <Paper p="xl" ta="center" radius="md" withBorder>
      <Stack gap="md" align="center">
        <Users size={64} style={{ opacity: 0.3 }} />
        
        <Stack gap="xs" align="center">
          <Text fz="xl" fw={600}>
            No groups yet
          </Text>
          <Text c="dimmed" maw={400} ta="center">
            Create your first group to start splitting expenses with friends, family, or colleagues. 
            Groups make it easy to track shared costs and settle up later.
          </Text>
        </Stack>

        <Button 
          leftSection={<Plus size={20} />}
          size="md"
          onClick={onCreateGroup}
        >
          Create Your First Group
        </Button>

        <Stack gap="xs" align="center" mt="md">
          <Text fz="sm" fw={500} c="dimmed">
            Popular group types:
          </Text>
          <Text fz="sm" c="dimmed">
            🏠 Roommates • 🍕 Friends • 💼 Work • ✈️ Travel • 🎉 Events
          </Text>
        </Stack>
      </Stack>
    </Paper>
  );
}