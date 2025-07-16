import { Button, Modal, Text, Stack, Group } from '@mantine/core';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useDisclosure } from '@mantine/hooks';

interface DeleteAllGroupsButtonProps {
  onDeleteAll: () => void;
  groupCount: number;
  disabled?: boolean;
}

export function DeleteAllGroupsButton({ onDeleteAll, groupCount, disabled }: DeleteAllGroupsButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);

  const handleConfirmDelete = () => {
    onDeleteAll();
    close();
  };

  return (
    <>
      <Button
        variant="light"
        color="red"
        leftSection={<Trash2 size={16} />}
        onClick={open}
        disabled={disabled || groupCount === 0}
        size="sm"
      >
        Delete All Groups
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title={
          <Group gap="xs">
            <AlertTriangle size={20} color="red" />
            <Text fw={600}>Delete All Groups</Text>
          </Group>
        }
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to delete all {groupCount} groups? This action cannot be undone.
          </Text>
          
          <Text fz="sm" c="dimmed">
            ⚠️ This will permanently remove all groups and their associated data, but will not affect your transaction history.
          </Text>

          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
            <Button color="red" onClick={handleConfirmDelete}>
              Delete All Groups
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}