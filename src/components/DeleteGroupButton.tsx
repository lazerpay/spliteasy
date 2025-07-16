import { ActionIcon, Modal, Text, Stack, Group, Button } from '@mantine/core';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useDisclosure } from '@mantine/hooks';

interface DeleteGroupButtonProps {
  groupName: string;
  onDelete: () => void;
}

export function DeleteGroupButton({ groupName, onDelete }: DeleteGroupButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);

  const handleConfirmDelete = () => {
    onDelete();
    close();
  };

  return (
    <>
      <ActionIcon
        variant="subtle"
        color="red"
        size="sm"
        onClick={open}
      >
        <Trash2 size={16} />
      </ActionIcon>

      <Modal
        opened={opened}
        onClose={close}
        title={
          <Group gap="xs">
            <AlertTriangle size={20} color="red" />
            <Text fw={600}>Delete Group</Text>
          </Group>
        }
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to delete the group "{groupName}"? This action cannot be undone.
          </Text>
          
          <Text fz="sm" c="dimmed">
            ⚠️ This will permanently remove the group and all its associated data, but will not affect your transaction history.
          </Text>

          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
            <Button color="red" onClick={handleConfirmDelete}>
              Delete Group
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}