import { RecurringBill, RecurringBillData } from '../types/schema';
import { formatNextPaymentDate } from '../utils/formatters';

const BILLS_STORAGE_KEY = 'recurringBills';

export class BillsStorageService {
  static saveBill(billData: RecurringBillData): RecurringBill {
    const bills = this.getBills();
    const newBill: RecurringBill = {
      id: `bill-${Date.now()}`,
      receiverName: billData.receiverName,
      description: billData.description,
      amount: billData.amount,
      frequency: billData.frequency,
      paymentMethodId: billData.paymentMethodId,
      nextPaymentDate: billData.paymentDateTime,
      lastPaidDate: null,
      createdDate: new Date(),
      isActive: true
    };

    bills.push(newBill);
    localStorage.setItem(BILLS_STORAGE_KEY, JSON.stringify(bills));
    return newBill;
  }

  static getBills(): RecurringBill[] {
    try {
      const stored = localStorage.getItem(BILLS_STORAGE_KEY);
      if (!stored) return [];
      
      const bills = JSON.parse(stored);
      return bills.map((bill: any) => ({
        ...bill,
        nextPaymentDate: new Date(bill.nextPaymentDate),
        lastPaidDate: bill.lastPaidDate ? new Date(bill.lastPaidDate) : null,
        createdDate: new Date(bill.createdDate)
      }));
    } catch (error) {
      console.error('Error loading bills:', error);
      return [];
    }
  }

  static updateBillPayment(billId: string): void {
    const bills = this.getBills();
    const billIndex = bills.findIndex(bill => bill.id === billId);
    
    if (billIndex !== -1) {
      const bill = bills[billIndex];
      const now = new Date();
      bill.lastPaidDate = now;
      bill.nextPaymentDate = formatNextPaymentDate(now, bill.frequency);
      
      localStorage.setItem(BILLS_STORAGE_KEY, JSON.stringify(bills));
    }
  }

  static deleteBill(billId: string): void {
    const bills = this.getBills();
    const filteredBills = bills.filter(bill => bill.id !== billId);
    localStorage.setItem(BILLS_STORAGE_KEY, JSON.stringify(filteredBills));
  }
}