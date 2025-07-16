import { 
  Paper, 
  Title, 
  Stack, 
  Group,
  Text,
  Button,
  Modal,
  Alert
} from '@mantine/core';
import { Trash2, AlertTriangle, Shield } from 'lucide-react';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLocalStorage } from '../hooks/useLocalStorage';

export function DangerZone() {
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [confirmText, setConfirmText] = useState('');
  const { clearAllData } = useLocalStorage();
  const navigate = useNavigate();

  const handleDeleteAllData = () => {
    if (confirmText === 'DELETE ALL DATA') {
      clearAllData();
      closeDeleteModal();
      setConfirmText('');
      // Navigate to dashboard after deletion
      navigate('/');
    }
  };

  const isDeleteEnabled = confirmText === 'DELETE ALL DATA';

  return (
    <>
      <Paper p="xl" radius="md" withBorder style={{ borderColor: 'var(--mantine-color-red-3)' }}>
        <Stack gap="lg">
          <Group gap="md">
            <Shield size={24} color="var(--mantine-color-red-6)" />
            <Title order={3} c="red">Danger Zone</Title>
          </Group>

          <Alert 
            icon={<AlertTriangle size={16} />} 
            color="red" 
            variant="light"
            title="Warning"
          >
            This action cannot be undone. All your data including groups, transactions, 
            and activity history will be permanently deleted.
          </Alert>

          <Paper p="md" withBorder style={{ borderColor: 'var(--mantine-color-red-2)', backgroundColor: 'var(--mantine-color-red-0)' }}>
            <Stack gap="md">
              <div>
                <Text fw={600} c="red" mb="xs">Delete All Data</Text>
                <Text fz="sm" c="dimmed">
                  Permanently delete all your groups, transactions, activity history, and reset your account. 
                  This will clear all data from local storage and cannot be recovered.
                </Text>
              </div>
              
              <Button
                color="red"
                variant="light"
                leftSection={<Trash2 size={16} />}
                onClick={openDeleteModal}
              >
                Delete All Data
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Paper>

      {/* Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Confirm Data Deletion"
        centered
        size="md"
      >
        <Stack gap="md">
          <Alert 
            icon={<AlertTriangle size={16} />} 
            color="red" 
            variant="filled"
            title="This action cannot be undone!"
          >
            You are about to permanently delete all your data including:
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li>All groups and group memberships</li>
              <li>All transactions and expense history</li>
              <li>All activity and statistics</li>
              <li>User preferences and settings</li>
            </ul>
          </Alert>

          <div>
            <Text fw={600} mb="xs">
              Type "DELETE ALL DATA" to confirm:
            </Text>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE ALL DATA"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--mantine-color-gray-4)',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <Group justify="flex-end" gap="sm">
            <Button
              variant="light"
              onClick={() => {
                closeDeleteModal();
                setConfirmText('');
              }}
            >
              Cancel
            </Button>
            <Button
              color="red"
              disabled={!isDeleteEnabled}
              onClick={handleDeleteAllData}
              leftSection={<Trash2 size={16} />}
            >
              Delete All Data
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}