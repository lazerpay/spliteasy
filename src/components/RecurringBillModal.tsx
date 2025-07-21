import { 
  Modal, 
  Stack, 
  TextInput, 
  NumberInput,
  Button, 
  Group,
  Select,
  Text
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { X, User, FileText, DollarSign, Calendar, CreditCard, Plus, Repeat } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { RecurringBillModalProps, RecurringBillData, PaymentCard } from '../types/schema';
import { formatCardDisplay } from '../utils/formatters';
import { AddCardModal } from './AddCardModal';

export function RecurringBillModal({ 
  opened, 
  onClose, 
  onSubmit, 
  connectedCards: propConnectedCards 
}: RecurringBillModalProps) {
  const [receiverName, setReceiverName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | string>('');
  const [paymentDateTime, setPaymentDateTime] = useState<Date | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedCards, setSavedCards] = useState<PaymentCard[]>([]);
  const [addCardModalOpened, { open: openAddCardModal, close: closeAddCardModal }] = useDisclosure(false);

  // Load saved cards from localStorage on component mount
  useEffect(() => {
    const loadSavedCards = () => {
      try {
        const stored = localStorage.getItem('savedCards');
        if (stored) {
          setSavedCards(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading saved cards:', error);
        setSavedCards([]);
      }
    };

    if (opened) {
      loadSavedCards();
      // Set default time to 12:00 AM if no date is selected
      if (!paymentDateTime) {
        const defaultDate = new Date();
        defaultDate.setHours(0, 0, 0, 0);
        setPaymentDateTime(defaultDate);
      }
    }
  }, [opened, paymentDateTime]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!receiverName.trim()) {
      newErrors.receiverName = 'Receiver name is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!amount || Number(amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }

    if (!paymentDateTime) {
      newErrors.paymentDateTime = 'Payment date and time is required';
    }

    if (!paymentMethodId) {
      newErrors.paymentMethodId = 'Payment method is required';
    }

    if (!frequency) {
      newErrors.frequency = 'Payment frequency is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const billData: RecurringBillData = {
      receiverName: receiverName.trim(),
      description: description.trim(),
      amount: Number(amount),
      paymentDateTime: paymentDateTime!,
      paymentMethodId,
      frequency: frequency as 'weekly' | 'monthly' | 'yearly'
    };

    onSubmit(billData);
    handleClose();
  };

  const handleClose = () => {
    setReceiverName('');
    setDescription('');
    setAmount('');
    setPaymentDateTime(null);
    setPaymentMethodId('');
    setFrequency('');
    setErrors({});
    onClose();
  };

  const handleAddCard = () => {
    openAddCardModal();
  };

  const handleCardAdded = (newCard: PaymentCard) => {
    setSavedCards(prev => [...prev, newCard]);
    setPaymentMethodId(newCard.id);
    closeAddCardModal();
  };

  // Prepare payment method options
  const paymentMethodOptions = savedCards.length > 0 
    ? savedCards.map(card => ({
        value: card.id,
        label: formatCardDisplay(card.lastFour, card.type)
      }))
    : [{
        value: 'add-card',
        label: 'Add Card'
      }];

  // Frequency options
  const frequencyOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const isFormValid = receiverName.trim() && 
                     description.trim() && 
                     amount && 
                     Number(amount) > 0 && 
                     paymentDateTime && 
                     paymentMethodId && 
                     paymentMethodId !== 'add-card' &&
                     frequency;

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleClose}
        title="Set up Recurring Bill"
        size="md"
        centered
        closeButtonProps={{
          icon: <X size={20} />
        }}
      >
        <Stack gap="md">
          {/* Receiver Name */}
          <TextInput
            label="Receiver's Name"
            placeholder="Enter receiver's name"
            value={receiverName}
            onChange={(event) => {
              setReceiverName(event.currentTarget.value);
              if (errors.receiverName) {
                setErrors(prev => ({ ...prev, receiverName: '' }));
              }
            }}
            leftSection={<User size={16} />}
            error={errors.receiverName}
            required
          />

          {/* Description */}
          <TextInput
            label="Description"
            placeholder="Enter bill description"
            value={description}
            onChange={(event) => {
              setDescription(event.currentTarget.value);
              if (errors.description) {
                setErrors(prev => ({ ...prev, description: '' }));
              }
            }}
            leftSection={<FileText size={16} />}
            error={errors.description}
            required
          />

          {/* Amount */}
          <NumberInput
            label="Amount"
            placeholder="Enter amount"
            value={amount}
            onChange={(value) => {
              setAmount(value);
              if (errors.amount) {
                setErrors(prev => ({ ...prev, amount: '' }));
              }
            }}
            leftSection={<DollarSign size={16} />}
            min={0}
            decimalScale={2}
            fixedDecimalScale
            error={errors.amount}
            required
          />

          {/* Payment Date & Time */}
          <DateTimePicker
            label="Payment Date & Time"
            placeholder="Select date and time"
            value={paymentDateTime}
            onChange={(value) => {
              setPaymentDateTime(value);
              if (errors.paymentDateTime) {
                setErrors(prev => ({ ...prev, paymentDateTime: '' }));
              }
            }}
            leftSection={<Calendar size={16} />}
            error={errors.paymentDateTime}
            required
            valueFormat="DD/MM/YYYY HH:mm"
            minDate={new Date()}
            withSeconds={false}
          />

          {/* Payment Frequency */}
          <Select
            label="Pay Every"
            placeholder="Select frequency"
            value={frequency}
            onChange={(value) => {
              setFrequency(value || '');
              if (errors.frequency) {
                setErrors(prev => ({ ...prev, frequency: '' }));
              }
            }}
            data={frequencyOptions}
            leftSection={<Repeat size={16} />}
            error={errors.frequency}
            required
          />

          {/* Payment Method */}
          <div>
            <Select
              label="Payment Method"
              placeholder={savedCards.length === 0 ? "No cards saved - Add a card" : "Select a card"}
              value={paymentMethodId}
              onChange={(value) => {
                if (value === 'add-card') {
                  handleAddCard();
                } else {
                  setPaymentMethodId(value || '');
                  if (errors.paymentMethodId) {
                    setErrors(prev => ({ ...prev, paymentMethodId: '' }));
                  }
                }
              }}
              data={paymentMethodOptions}
              leftSection={<CreditCard size={16} />}
              error={errors.paymentMethodId}
              required
            />
            
            {savedCards.length > 0 && (
              <Button
                variant="subtle"
                size="sm"
                leftSection={<Plus size={16} />}
                onClick={handleAddCard}
                mt="xs"
              >
                Add Another Card
              </Button>
            )}
          </div>

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
              Set up Bill
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Add Card Modal */}
      <AddCardModal
        opened={addCardModalOpened}
        onClose={closeAddCardModal}
        onSubmit={handleCardAdded}
      />
    </>
  );
}