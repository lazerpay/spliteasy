import { 
  Modal, 
  Stack, 
  TextInput, 
  Select,
  Button, 
  Group,
  Text
} from '@mantine/core';
import { X, User, CreditCard, Calendar } from 'lucide-react';
import { useState } from 'react';
import { PaymentCard } from '../types/schema';

interface AddCardModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (card: PaymentCard) => void;
}

export function AddCardModal({ opened, onClose, onSubmit }: AddCardModalProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cardType, setCardType] = useState<string>('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cardTypeOptions = [
    { value: 'Visa', label: 'Visa' },
    { value: 'Mastercard', label: 'Mastercard' },
    { value: 'American Express', label: 'American Express' },
    { value: 'Discover', label: 'Discover' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!nameOnCard.trim()) {
      newErrors.nameOnCard = 'Name on card is required';
    }

    if (!cardNumber.trim() || cardNumber.length < 16) {
      newErrors.cardNumber = 'Valid card number is required (16 digits)';
    }

    if (!expiryDate.trim() || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      newErrors.expiryDate = 'Valid expiry date is required (MM/YY)';
    }

    if (!cardType) {
      newErrors.cardType = 'Card type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newCard: PaymentCard = {
      id: `card-${Date.now()}`,
      type: cardType as 'Visa' | 'Mastercard' | 'American Express' | 'Discover',
      lastFour: cardNumber.slice(-4),
      expiryDate: expiryDate,
      nameOnCard: nameOnCard.trim(),
      isDefault: false
    };

    // Save to localStorage
    const existingCards = JSON.parse(localStorage.getItem('savedCards') || '[]');
    const updatedCards = [...existingCards, newCard];
    localStorage.setItem('savedCards', JSON.stringify(updatedCards));

    onSubmit(newCard);
    handleClose();
  };

  const handleClose = () => {
    setCardNumber('');
    setExpiryDate('');
    setCardType('');
    setNameOnCard('');
    setErrors({});
    onClose();
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add slash after 2 digits
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
  };

  const isFormValid = nameOnCard.trim() &&
                     cardNumber.length >= 16 && 
                     expiryDate.length === 5 && 
                     cardType;

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Add Payment Card"
      size="md"
      centered
      closeButtonProps={{
        icon: <X size={20} />
      }}
    >
      <Stack gap="md">
        {/* Card Type */}
        <Select
          label="Card Type"
          placeholder="Select card type"
          value={cardType}
          onChange={(value) => {
            setCardType(value || '');
            if (errors.cardType) {
              setErrors(prev => ({ ...prev, cardType: '' }));
            }
          }}
          data={cardTypeOptions}
          leftSection={<CreditCard size={16} />}
          error={errors.cardType}
          required
        />

        {/* Name on Card */}
        <TextInput
          label="Name on Card"
          placeholder="Enter name as it appears on card"
          value={nameOnCard}
          onChange={(event) => {
            setNameOnCard(event.currentTarget.value);
            if (errors.nameOnCard) {
              setErrors(prev => ({ ...prev, nameOnCard: '' }));
            }
          }}
          leftSection={<User size={16} />}
          error={errors.nameOnCard}
          required
        />

        {/* Card Number */}
        <TextInput
          label="Card Number"
          placeholder="1234 5678 9012 3456"
          value={formatCardNumber(cardNumber)}
          onChange={(event) => {
            const rawValue = event.currentTarget.value.replace(/\s/g, '');
            setCardNumber(rawValue);
            if (errors.cardNumber) {
              setErrors(prev => ({ ...prev, cardNumber: '' }));
            }
          }}
          leftSection={<CreditCard size={16} />}
          error={errors.cardNumber}
          required
        />

        {/* Expiry Date */}
        <TextInput
          label="Expiry Date"
          placeholder="MM/YY"
          value={expiryDate}
          onChange={(event) => {
            const formatted = formatExpiryDate(event.currentTarget.value);
            setExpiryDate(formatted);
            if (errors.expiryDate) {
              setErrors(prev => ({ ...prev, expiryDate: '' }));
            }
          }}
          leftSection={<Calendar size={16} />}
          error={errors.expiryDate}
          required
        />

        {/* Info Text */}
        <Text size="sm" c="dimmed">
          Your card information is securely stored and encrypted.
        </Text>

        {/* Action Buttons */}
        <Group justify="flex-end" gap="sm" mt="md">
          <Button
            variant="light"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Add Card
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}