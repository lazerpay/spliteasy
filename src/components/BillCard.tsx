import { 
  Card, 
  Group, 
  Text, 
  Button, 
  Badge, 
  Stack 
} from '@mantine/core';
import { Calendar, CreditCard, Repeat } from 'lucide-react';
import { RecurringBill } from '../types/schema';
import { formatCurrency, formatDate, formatPaymentStatus } from '../utils/formatters';

interface BillCardProps {
  bill: RecurringBill;
  onPayNow: (billId: string) => void;
}

export function BillCard({ bill, onPayNow }: BillCardProps) {
  const paymentStatus = formatPaymentStatus(bill.nextPaymentDate);
  const isOverdue = paymentStatus === 'Overdue';
  const isDueToday = paymentStatus === 'Due Today';

  const getStatusColor = () => {
    if (isOverdue) return 'red';
    if (isDueToday) return 'orange';
    return 'blue';
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Text fw={600} size="lg">{bill.receiverName}</Text>
            <Text size="sm" c="dimmed">{bill.description}</Text>
          </div>
          <Text fw={700} size="xl" c="blue">
            {formatCurrency(bill.amount)}
          </Text>
        </Group>

        {/* Payment Info */}
        <Stack gap="xs">
          <Group gap="sm">
            <Calendar size={16} />
            <Text size="sm">
              <Text span fw={500}>Next Payment:</Text> {formatDate(bill.nextPaymentDate)}
            </Text>
            <Badge color={getStatusColor()} size="sm">
              {paymentStatus}
            </Badge>
          </Group>

          <Group gap="sm">
            <Calendar size={16} />
            <Text size="sm">
              <Text span fw={500}>Last Paid:</Text> {
                bill.lastPaidDate ? formatDate(bill.lastPaidDate) : 'Never'
              }
            </Text>
          </Group>

          <Group gap="sm">
            <Repeat size={16} />
            <Text size="sm">
              <Text span fw={500}>Frequency:</Text> {bill.frequency.charAt(0).toUpperCase() + bill.frequency.slice(1)}
            </Text>
          </Group>

          <Group gap="sm">
            <CreditCard size={16} />
            <Text size="sm">
              <Text span fw={500}>Payment Method:</Text> Card ending in ••••
            </Text>
          </Group>
        </Stack>

        {/* Actions */}
        <Group justify="flex-end">
          <Button
            variant={isOverdue ? 'filled' : 'light'}
            color={isOverdue ? 'red' : 'blue'}
            onClick={() => onPayNow(bill.id)}
          >
            Pay Now
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}