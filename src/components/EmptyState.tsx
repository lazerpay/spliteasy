import { Stack, Text, Button, Paper, ThemeIcon } from '@mantine/core';
import { Plus, Users, Receipt } from 'lucide-react';

interface EmptyStateProps {
  onGetStarted: () => void;
}

export function EmptyState({ onGetStarted }: EmptyStateProps) {
  return (
    <Paper p="xl" radius="lg" withBorder style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
      <Stack gap="xl" align="center">
        <ThemeIcon size={80} radius="xl" variant="light" color="orange">
          <Receipt size={40} />
        </ThemeIcon>
        
        <Stack gap="md" align="center">
          <Text fz="24px" fw={700}>
            👋 Welcome to SplitEasy!
          </Text>
          <Text fz="16px" c="dimmed" ta="center">
            Start splitting expenses with friends and keep track of who owes what. 
            It's easy, fair, and stress-free!
          </Text>
        </Stack>

        <Stack gap="sm" align="center">
          <Button
            leftSection={<Plus size={20} />}
            size="lg"
            color="orange"
            onClick={onGetStarted}
            radius="md"
          >
            Add Your First Expense
          </Button>
          
          <Text fz="14px" c="dimmed">
            or create a group to get started
          </Text>
        </Stack>

        <Stack gap="md" w="100%">
          <Text fz="16px" fw={600} c="dimmed">
            What you can do:
          </Text>
          
          <Stack gap="xs">
            <Text fz="14px" c="dimmed" ta="center">
              💰 Track shared expenses and bills
            </Text>
            <Text fz="14px" c="dimmed" ta="center">
              👥 Create groups for trips, roommates, or events
            </Text>
            <Text fz="14px" c="dimmed" ta="center">
              📊 See who owes what at a glance
            </Text>
            <Text fz="14px" c="dimmed" ta="center">
              ⚡ Settle up with friends easily
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}