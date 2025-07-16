import { Transaction, Group, User } from '../types/schema';
import { TransactionType, TransactionStatus } from '../types/enums';

export interface UserStatistics {
  totalGroups: number;
  totalTransactions: number;
  totalAmountSpent: number;
  mostActiveGroup: {
    name: string;
    transactionCount: number;
  } | null;
  mostSpentInGroup: {
    name: string;
    amount: number;
  } | null;
  averageTransactionAmount: number;
  largestTransaction: {
    description: string;
    amount: number;
    date: Date;
  } | null;
  groupsAsAdmin: number;
  settledTransactions: number;
  pendingTransactions: number;
  monthlyStats: {
    currentMonth: number;
    lastMonth: number;
    trend: 'up' | 'down' | 'same';
  };
}

export function calculateUserStatistics(
  user: User,
  transactions: Transaction[],
  groups: Group[]
): UserStatistics {
  const userName = user.name;
  
  // Ensure we have valid data
  if (!transactions || !Array.isArray(transactions)) {
    transactions = [];
  }
  
  if (!groups || !Array.isArray(groups)) {
    groups = [];
  }
  
  // Filter transactions where user is involved
  const userTransactions = transactions.filter(
    t => t && (t.paidBy === userName || (t.splitBetween && t.splitBetween.includes(userName)))
  );

  // Calculate total groups user is part of
  const totalGroups = groups.filter(g => g && g.members && g.members.includes(userName)).length;

  // Calculate total transactions
  const totalTransactions = userTransactions.filter(t => t && t.type === TransactionType.EXPENSE).length;

  // Calculate total amount spent (only what user actually paid)
  const totalAmountSpent = userTransactions
    .filter(t => t && t.paidBy === userName && t.amount && typeof t.amount === 'number')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  // Find most active group (by transaction count)
  const groupActivity = new Map<string, number>();
  userTransactions.forEach(t => {
    if (t.groupName) {
      groupActivity.set(t.groupName, (groupActivity.get(t.groupName) || 0) + 1);
    }
  });

  const mostActiveGroup = Array.from(groupActivity.entries())
    .sort(([, a], [, b]) => b - a)[0];

  // Find group where user spent the most
  const groupSpending = new Map<string, number>();
  userTransactions
    .filter(t => t.paidBy === userName && t.groupName && t.amount)
    .forEach(t => {
      const current = groupSpending.get(t.groupName!) || 0;
      groupSpending.set(t.groupName!, current + (t.amount || 0));
    });

  const mostSpentInGroup = Array.from(groupSpending.entries())
    .sort(([, a], [, b]) => b - a)[0];

  // Calculate average transaction amount
  const expenseTransactions = userTransactions.filter(
    t => t.type === TransactionType.EXPENSE && t.amount && t.paidBy === userName
  );
  const averageTransactionAmount = expenseTransactions.length > 0
    ? expenseTransactions.reduce((sum, t) => sum + (t.amount || 0), 0) / expenseTransactions.length
    : 0;

  // Find largest transaction
  const largestTransaction = expenseTransactions
    .filter(t => t.amount)
    .sort((a, b) => (b.amount || 0) - (a.amount || 0))[0];

  // Count groups where user is the first member (admin/creator)
  const groupsAsAdmin = groups.filter(g => g.members[0] === userName).length;

  // Count settled vs pending transactions
  const settledTransactions = userTransactions.filter(t => t.status === TransactionStatus.SETTLED).length;
  const pendingTransactions = userTransactions.filter(t => t.status === TransactionStatus.PENDING).length;

  // Calculate monthly stats
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthSpending = userTransactions
    .filter(t => {
      const tDate = new Date(t.date);
      return t.paidBy === userName && 
             t.amount && 
             tDate.getMonth() === currentMonth && 
             tDate.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const lastMonthSpending = userTransactions
    .filter(t => {
      const tDate = new Date(t.date);
      return t.paidBy === userName && 
             t.amount && 
             tDate.getMonth() === lastMonth && 
             tDate.getFullYear() === lastMonthYear;
    })
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const trend = currentMonthSpending > lastMonthSpending ? 'up' : 
                currentMonthSpending < lastMonthSpending ? 'down' : 'same';

  return {
    totalGroups,
    totalTransactions,
    totalAmountSpent,
    mostActiveGroup: mostActiveGroup ? {
      name: mostActiveGroup[0],
      transactionCount: mostActiveGroup[1]
    } : null,
    mostSpentInGroup: mostSpentInGroup ? {
      name: mostSpentInGroup[0],
      amount: mostSpentInGroup[1]
    } : null,
    averageTransactionAmount,
    largestTransaction: largestTransaction ? {
      description: largestTransaction.description,
      amount: largestTransaction.amount || 0,
      date: largestTransaction.date
    } : null,
    groupsAsAdmin,
    settledTransactions,
    pendingTransactions,
    monthlyStats: {
      currentMonth: currentMonthSpending,
      lastMonth: lastMonthSpending,
      trend
    }
  };
}