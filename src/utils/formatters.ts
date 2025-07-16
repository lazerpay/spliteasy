import { TransactionType, TransactionStatus, BalanceType } from '../types/enums';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Math.abs(amount));
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
};

export const formatTransactionType = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.EXPENSE:
      return 'Added expense';
    case TransactionType.SETTLEMENT:
      return 'Settled up';
    case TransactionType.GROUP_CREATED:
      return 'Created group';
    case TransactionType.GROUP_JOINED:
      return 'Joined group';
    default:
      return 'Activity';
  }
};

export const formatBalanceType = (type: BalanceType): string => {
  switch (type) {
    case BalanceType.OWED_TO_YOU:
      return 'owed to you';
    case BalanceType.YOU_OWE:
      return 'you owe';
    case BalanceType.SETTLED:
      return 'settled up';
    default:
      return '';
  }
};