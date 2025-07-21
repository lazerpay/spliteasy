import { 
  Modal, 
  Stack, 
  Text, 
  Group, 
  Button 
} from '@mantine/core';
import { X, AlertCircle } from 'lucide-react';
import { PaymentConfirmModalProps } from '../types/schema';
import { formatCurrency } from '../utils/formatters';

export function PaymentConfirmModal({ 
  opened, 
  onClose, 
  onConfirm, 
  paymentData, 
  isProcessing 
}: PaymentConfirmModalProps) {
  if (!paymentData) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Confirm Payment"
      centered
      size="sm"
      closeButtonProps={{
        icon: <X size={20} />
      }}
    >
      <Stack gap="lg">
        {/* Payment Details */}
        <Group gap="md" align="flex-start">
          <AlertCircle size={24} color="var(--mantine-color-blue-6)" />
          <Stack gap="xs" style={{ flex: 1 }}>
            <Text size="lg" fw={500}>
              You are about to pay {formatCurrency(paymentData.amount)} to {paymentData.receiverName}
            </Text>
            <Text size="sm" c="dimmed">
              This payment will be processed immediately and cannot be undone.
            </Text>
          </Stack>
        </Group>

        {/* Action Buttons */}
        <Group justify="flex-end" gap="sm">
          <Button
            variant="light"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            loading={isProcessing}
            disabled={isProcessing}
          >
            Confirm
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}