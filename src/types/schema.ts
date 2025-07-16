import { TransactionType, TransactionStatus, BalanceType } from './enums';

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