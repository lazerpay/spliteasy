// Enums for bill splitting app
export enum TransactionType {
  EXPENSE = 'expense',
  SETTLEMENT = 'settlement',
  GROUP_CREATED = 'group_created',
  GROUP_JOINED = 'group_joined'
}

export enum TransactionStatus {
  PENDING = 'pending',
  SETTLED = 'settled',
  PARTIALLY_SETTLED = 'partially_settled'
}

export enum BalanceType {
  OWED_TO_YOU = 'owed_to_you',
  YOU_OWE = 'you_owe',
  SETTLED = 'settled'
}

// Notification types and status enums
export enum NotificationType {
  REFERRAL_ACCEPTED = 'referral_accepted',
  CASHBACK_EARNED = 'cashback_earned',
  GENERAL = 'general'
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read'
}

// Payment method types for recurring bills
export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card'
}

export enum RecurringBillStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  CANCELLED = 'cancelled'
}

export enum RecurringFrequency {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

// Bill status and payment tracking enums
export enum BillPaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue'
}

export enum PaymentConfirmationStatus {
  CONFIRMING = 'confirming',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error'
}