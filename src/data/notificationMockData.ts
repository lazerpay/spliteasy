import { NotificationType, NotificationStatus } from '../types/enums';
import { Notification, CashbackData } from '../types/schema';

// Mock data for notifications and cashback system
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: NotificationType.REFERRAL_ACCEPTED,
    title: 'Referral Bonus',
    message: 'john.doe@example.com has accepted your referral',
    amount: 10,
    date: new Date(),
    status: NotificationStatus.UNREAD,
    email: 'john.doe@example.com'
  }
];

export const mockCashbackData: CashbackData = {
  totalEarned: 0,
  referralCount: 0,
  lastEarned: null
};

export const mockRootProps = {
  notifications: mockNotifications,
  cashbackData: mockCashbackData,
  unreadCount: 1
};