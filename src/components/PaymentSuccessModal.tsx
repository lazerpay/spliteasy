import { 
  Modal, 
  Stack, 
  Text, 
  Group, 
  Button 
} from '@mantine/core';
import { X, CheckCircle } from 'lucide-react';
import { PaymentSuccessModalProps } from '../types/schema';
import { formatCurrency } from '../utils/formatters';

export function PaymentSuccessModal({ 
  opened, 
  onClose, 
  paymentData 
}: PaymentSuccessModalProps) {
  if (!paymentData) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Payment Successful"
      centered
      size="sm"
      closeButtonProps={{
        icon: <X size={20} />
      }}
    >
      <Stack gap="lg">
        {/* Success Message */}
        <Group gap="md" align="flex-start">
          <CheckCircle size={24} color="var(--mantine-color-green-6)" />
          <Stack gap="xs" style={{ flex: 1 }}>
            <Text size="lg" fw={500}>
              Payment Successful!
            </Text>
            <Text size="sm" c="dimmed">
              Your payment of {formatCurrency(paymentData.amount)} to {paymentData.receiverName} has been processed successfully.
            </Text>
          </Stack>
        </Group>

        {/* Action Button */}
        <Group justify="flex-end">
          <Button onClick={onClose}>
            Close
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}