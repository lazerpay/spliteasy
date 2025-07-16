import { TransactionType, TransactionStatus, BalanceType } from '../types/enums';

// Data passed as props to the root component
export const mockRootProps = {
  user: {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  summary: {
    totalBalance: -25.50,
    youOwe: 125.75,
    youAreOwed: 100.25,
    monthlySpending: 456.80
  },
  recentTransactions: [
    {
      id: '1',
      type: TransactionType.EXPENSE,
      description: 'Dinner at Italian Restaurant',
      amount: 85.60,
      paidBy: 'Sarah Chen',
      splitBetween: ['Alex Johnson', 'Sarah Chen', 'Mike Wilson'],
      date: new Date('2024-01-15T19:30:00'),
      status: TransactionStatus.PENDING,
      groupName: 'Weekend Friends'
    },
    {
      id: '2', 
      type: TransactionType.SETTLEMENT,
      description: 'Settled up with John',
      amount: 45.00,
      paidBy: 'Alex Johnson',
      date: new Date('2024-01-14T10:15:00'),
      status: TransactionStatus.SETTLED
    },
    {
      id: '3',
      type: TransactionType.EXPENSE,
      description: 'Grocery shopping',
      amount: 67.89,
      paidBy: 'Alex Johnson',
      splitBetween: ['Alex Johnson', 'Emma Davis'],
      date: new Date('2024-01-13T16:45:00'),
      status: TransactionStatus.PARTIALLY_SETTLED,
      groupName: 'Roommates'
    },
    {
      id: '4',
      type: TransactionType.GROUP_CREATED,
      description: 'Created "Ski Trip 2024"',
      date: new Date('2024-01-12T09:20:00'),
      groupName: 'Ski Trip 2024'
    }
  ],
  groups: [
    {
      id: '1',
      name: 'Weekend Friends',
      members: ['Alex Johnson', 'Sarah Chen', 'Mike Wilson', 'Lisa Park'],
      totalBalance: -15.25,
      memberCount: 4,
      avatar: 'https://i.pravatar.cc/150?img=10'
    },
    {
      id: '2',
      name: 'Roommates',
      members: ['Alex Johnson', 'Emma Davis'],
      totalBalance: 33.95,
      memberCount: 2,
      avatar: 'https://i.pravatar.cc/150?img=11'
    },
    {
      id: '3',
      name: 'Work Lunch Group',
      members: ['Alex Johnson', 'David Kim', 'Rachel Green', 'Tom Brown', 'Anna White'],
      totalBalance: 0,
      memberCount: 5,
      avatar: 'https://i.pravatar.cc/150?img=12'
    }
  ],
  friends: [
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      balance: -25.50,
      balanceType: BalanceType.YOU_OWE,
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: '2',
      name: 'Mike Wilson', 
      email: 'mike.wilson@email.com',
      balance: 45.75,
      balanceType: BalanceType.OWED_TO_YOU,
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      balance: 0,
      balanceType: BalanceType.SETTLED,
      avatar: 'https://i.pravatar.cc/150?img=4'
    }
  ]
};