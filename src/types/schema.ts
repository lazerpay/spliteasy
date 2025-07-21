import { TransactionType, TransactionStatus, BalanceType, NotificationType, NotificationStatus } from './enums';

// Props types (data passed to components)
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface FinancialSummary {
  totalBalance: number;
  youOwe: number;
  youAreOwed: number;
  monthlySpending: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount?: number;
  paidBy?: string;
  splitBetween?: string[];
  date: Date;
  status?: TransactionStatus;
  groupName?: string;
}

export interface GroupMember {
  name: string;
  settled: boolean;
}

export interface Group {
  id: string;
  name: string;
  members: string[];
  memberDetails?: GroupMember[];
  totalBalance: number;
  memberCount: number;
  avatar: string;
  expenses?: Transaction[];
}

export interface Friend {
  id: string;
  name: string;
  email: string;
  balance: number;
  balanceType: BalanceType;
  avatar: string;
}

export interface DashboardProps {
  user: User;
  summary: FinancialSummary;
  recentTransactions: Transaction[];
  groups: Group[];
  friends: Friend[];
}

// Type definitions for notifications and cashback system
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  amount?: number;
  date: Date;
  status: NotificationStatus;
  email?: string;
}

export interface CashbackData {
  totalEarned: number;
  referralCount: number;
  lastEarned: Date | null;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  cashbackData: CashbackData;
}

// Props types for recurring bill components
export interface PaymentCard {
  id: string;
  type: 'Visa' | 'Mastercard' | 'American Express' | 'Discover';
  lastFour: string;
  expiryDate: string;
  nameOnCard: string;
  isDefault: boolean;
}

export interface RecurringBillData {
  receiverName: string;
  description: string;
  amount: number;
  paymentDateTime: Date;
  paymentMethodId: string;
  frequency: 'weekly' | 'monthly' | 'yearly';
}

export interface RecurringBillModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (billData: RecurringBillData) => void;
  connectedCards: PaymentCard[];
}

// Props types for recurring bills management
export interface RecurringBill {
  id: string;
  receiverName: string;
  description: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'yearly';
  paymentMethodId: string;
  nextPaymentDate: Date;
  lastPaidDate: Date | null;
  createdDate: Date;
  isActive: boolean;
}

export interface PaymentConfirmationData {
  billId: string;
  amount: number;
  receiverName: string;
  paymentMethodId: string;
}

export interface BillsPageProps {
  bills: RecurringBill[];
  onPayNow: (billId: string) => void;
}

export interface PaymentConfirmModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  paymentData: PaymentConfirmationData | null;
  isProcessing: boolean;
}

export interface PaymentSuccessModalProps {
  opened: boolean;
  onClose: () => void;
  paymentData: PaymentConfirmationData | null;
}