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