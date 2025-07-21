import { 
  AppShell, 
  Container, 
  Title, 
  Stack, 
  Text, 
  SimpleGrid,
  Paper,
  Button,
  Group
} from '@mantine/core';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BillCard } from './BillCard';
import { PaymentConfirmModal } from './PaymentConfirmModal';
import { PaymentSuccessModal } from './PaymentSuccessModal';
import { RecurringBillModal } from './RecurringBillModal';
import { RecurringBill, PaymentConfirmationData, RecurringBillData } from '../types/schema';
import { BillsStorageService } from '../services/billsStorageService';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function RecurringBillsPage() {
  const navigate = useNavigate();
  const { user } = useLocalStorage();
  const [opened, { toggle }] = useDisclosure();
  const [bills, setBills] = useState<RecurringBill[]>([]);
  const [paymentData, setPaymentData] = useState<PaymentConfirmationData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [confirmModalOpened, { open: openConfirmModal, close: closeConfirmModal }] = useDisclosure(false);
  const [successModalOpened, { open: openSuccessModal, close: closeSuccessModal }] = useDisclosure(false);
  const [billModalOpened, { open: openBillModal, close: closeBillModal }] = useDisclosure(false);

  // Load bills on component mount
  useEffect(() => {
    const loadBills = () => {
      const storedBills = BillsStorageService.getBills();
      setBills(storedBills);
    };

    loadBills();
  }, []);

  const handlePayNow = (billId: string) => {
    const bill = bills.find(b => b.id === billId);
    if (!bill) return;

    setPaymentData({
      billId: bill.id,
      amount: bill.amount,
      receiverName: bill.receiverName,
      paymentMethodId: bill.paymentMethodId
    });
    openConfirmModal();
  };

  const handleConfirmPayment = async () => {
    if (!paymentData) return;

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update bill payment in storage
      BillsStorageService.updateBillPayment(paymentData.billId);
      
      // Reload bills
      const updatedBills = BillsStorageService.getBills();
      setBills(updatedBills);
      
      // Close confirm modal and show success
      closeConfirmModal();
      openSuccessModal();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuccessClose = () => {
    closeSuccessModal();
    setPaymentData(null);
  };

  const handleConfirmClose = () => {
    closeConfirmModal();
    setPaymentData(null);
  };

  const handleCreateBill = () => {
    openBillModal();
  };

  const handleBillSubmit = (billData: RecurringBillData) => {
    try {
      BillsStorageService.saveBill(billData);
      // Reload bills to show the new one
      const updatedBills = BillsStorageService.getBills();
      setBills(updatedBills);
      closeBillModal();
    } catch (error) {
      console.error('Failed to save recurring bill:', error);
    }
  };

  if (!user) {
    return (
      <AppShell
        header={{ height: 70 }}
        navbar={{
          width: 250,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <Container size="xl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <Text>Please log in to view your bills.</Text>
        </Container>
      </AppShell>
    );
  }

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <Header user={user} opened={opened} toggle={toggle} />
      <Sidebar opened={opened} />

      <AppShell.Main>
        <Container size="xl">
          <Stack gap="xl">
            {/* Header */}
            <Group justify="space-between" align="flex-start">
              <div>
                <Title order={1} mb="xs">
                  💳 Recurring Bills
                </Title>
                <Text c="dimmed" size="lg">
                  Manage your recurring payments and subscriptions
                </Text>
              </div>
              {bills.length > 0 && (
                <Button
                  leftSection={<Plus size={16} />}
                  onClick={handleCreateBill}
                >
                  Create Recurring Bill
                </Button>
              )}
            </Group>

            {/* Bills List */}
            {bills.length > 0 ? (
              <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
                {bills.map((bill) => (
                  <BillCard
                    key={bill.id}
                    bill={bill}
                    onPayNow={handlePayNow}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Paper p="xl" ta="center" withBorder>
                <Stack gap="md" align="center">
                  <Text size="lg" fw={500}>No recurring bills found</Text>
                  <Text c="dimmed">Create your first recurring bill from the dashboard</Text>
                  <Button
                    leftSection={<Plus size={16} />}
                    onClick={handleCreateBill}
                  >
                    Create Recurring Bill
                  </Button>
                </Stack>
              </Paper>
            )}
          </Stack>
        </Container>
      </AppShell.Main>

      {/* Payment Confirmation Modal */}
      <PaymentConfirmModal
        opened={confirmModalOpened}
        onClose={handleConfirmClose}
        onConfirm={handleConfirmPayment}
        paymentData={paymentData}
        isProcessing={isProcessing}
      />

      {/* Payment Success Modal */}
      <PaymentSuccessModal
        opened={successModalOpened}
        onClose={handleSuccessClose}
        paymentData={paymentData}
      />

      {/* Recurring Bill Modal */}
      <RecurringBillModal
        opened={billModalOpened}
        onClose={closeBillModal}
        onSubmit={handleBillSubmit}
        connectedCards={[]}
      />
    </AppShell>
  );
}