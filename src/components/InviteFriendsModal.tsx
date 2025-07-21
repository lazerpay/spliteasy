import { 
  Modal, 
  TextInput, 
  Button, 
  Stack, 
  Group,
  Text,
  Paper,
  Notification
} from '@mantine/core';
import { Mail, Gift, Send, X, Check } from 'lucide-react';
import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface InviteFriendsModalProps {
  opened: boolean;
  onClose: () => void;
}

interface NotificationState {
  show: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
}

export function InviteFriendsModal({ opened, onClose }: InviteFriendsModalProps) {
  const { simulateReferralAcceptance } = useLocalStorage();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showNotification = (type: 'success' | 'error', title: string, message: string) => {
    setNotification({ show: true, type, title, message });
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleSendInvite = async () => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      setError('Email address is required');
      return;
    }
    
    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success notification
      showNotification(
        'success',
        'Invitation Sent!',
        `Invite sent to ${trimmedEmail}. You'll earn cashback when they join!`
      );
      
      // Simulate referral acceptance after 3 seconds
      simulateReferralAcceptance(trimmedEmail);
      
      // Reset form and close modal
      setEmail('');
      setError('');
      onClose();
    } catch {
      showNotification(
        'error',
        'Failed to send invite',
        'Please try again later'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setNotification(prev => ({ ...prev, show: false }));
    onClose();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSendInvite();
    }
  };

  return (
    <>
      {/* Notification */}
      {notification.show && (
        <Notification
          icon={notification.type === 'success' ? <Check size={16} /> : <X size={16} />}
          color={notification.type === 'success' ? 'green' : 'red'}
          title={notification.title}
          onClose={() => setNotification(prev => ({ ...prev, show: false }))}
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 1000,
            maxWidth: 400
          }}
        >
          {notification.message}
        </Notification>
      )}

      <Modal
        opened={opened}
        onClose={handleClose}
        title="Invite Friends"
        centered
        size="md"
      >
        <Stack gap="lg">
          {/* Cashback Promotion */}
          <Paper p="md" radius="md" withBorder>
            <Group gap="sm" align="flex-start">
              <Gift size={20} color="var(--mantine-color-orange-6)" />
              <div>
                <Text fw={600} c="orange.7" fz="sm">
                  Earn up to $50 in cashback on referral!
                </Text>
                <Text fz="xs" c="dimmed" mt="xs">
                  Get $10 for each friend who joins and makes their first expense.
                </Text>
              </div>
            </Group>
          </Paper>

          {/* Email Input */}
          <Stack gap="md">
            <Text fw={500}>Send an invitation to your friend</Text>
            <TextInput
              label="Friend's Email Address"
              placeholder="Enter email address"
              value={email}
              onChange={(event) => {
                setEmail(event.currentTarget.value);
                if (error) setError(''); // Clear error when user starts typing
              }}
              onKeyDown={handleKeyPress}
              leftSection={<Mail size={16} />}
              error={error}
              disabled={isLoading}
              autoFocus
            />
          </Stack>

          {/* Benefits Section */}
          <Paper p="md" radius="md" bg="gray.0">
            <Text fw={500} fz="sm" mb="xs">What your friend gets:</Text>
            <Stack gap="xs">
              <Text fz="xs" c="dimmed">• Free account setup</Text>
              <Text fz="xs" c="dimmed">• Easy expense splitting with groups</Text>
              <Text fz="xs" c="dimmed">• Real-time balance tracking</Text>
              <Text fz="xs" c="dimmed">• Secure payment settlements</Text>
            </Stack>
          </Paper>

          {/* Action Buttons */}
          <Group justify="flex-end" gap="sm">
            <Button
              variant="light"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              leftSection={<Send size={16} />}
              onClick={handleSendInvite}
              loading={isLoading}
              disabled={!email.trim()}
            >
              Send Invitation
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}