import { RecurringBill } from './src/types/schema';

// Data for recurring bills management
export const mockRootProps = {
  bills: [
    {
      id: 'bill-1',
      receiverName: 'Netflix',
      description: 'Monthly subscription',
      amount: 19.99,
      frequency: 'monthly' as const,
      paymentMethodId: 'card-1',
      nextPaymentDate: new Date('2024-02-15'),
      lastPaidDate: new Date('2024-01-15'),
      createdDate: new Date('2024-01-01'),
      isActive: true
    },
    {
      id: 'bill-2',
      receiverName: 'Spotify',
      description: 'Music streaming',
      amount: 9.99,
      frequency: 'monthly' as const,
      paymentMethodId: 'card-1',
      nextPaymentDate: new Date('2024-02-20'),
      lastPaidDate: new Date('2024-01-20'),
      createdDate: new Date('2024-01-05'),
      isActive: true
    }
  ] as RecurringBill[]
};