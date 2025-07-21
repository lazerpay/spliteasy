import { PaymentCard } from './src/types/schema';

// Data for recurring bill modal
export const mockRootProps = {
  opened: true,
  onClose: () => {},
  onSubmit: (billData: any) => {},
  connectedCards: [
    {
      id: 'card-1',
      type: 'Visa' as const,
      lastFour: '4532',
      expiryDate: '12/25',
      isDefault: true
    },
    {
      id: 'card-2', 
      type: 'Mastercard' as const,
      lastFour: '8901',
      expiryDate: '08/26',
      isDefault: false
    }
  ] as PaymentCard[]
};