import { 
  Paper, 
  Group, 
  Text, 
  ActionIcon, 
  Stack,
  Badge
} from '@mantine/core';
import { Check, Gift } from 'lucide-react';
import { Notification } from '../types/schema';
import { NotificationStatus } from '../types/enums';
import { formatNotificationTime, formatCashbackAmount } from '../utils/formatters';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const isUnread = notification.status === NotificationStatus.UNREAD;

  const handleMarkAsRead = () => {
    if (isUnread) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <Paper
      p="sm"
      radius="md"
      withBorder
      style={{
        backgroundColor: isUnread ? 'var(--mantine-color-blue-0)' : 'transparent',
        borderColor: isUnread ? 'var(--mantine-color-blue-2)' : 'var(--mantine-color-gray-3)',
        cursor: isUnread ? 'pointer' : 'default'
      }}
      onClick={handleMarkAsRead}
    >
      <Group justify="space-between" align="flex-start">
        <Group gap="sm" align="flex-start" style={{ flex: 1 }}>
          <Gift size={20} color="var(--mantine-color-orange-6)" />
          <Stack gap="xs" style={{ flex: 1 }}>
            <Group justify="space-between" align="flex-start">
              <Text fw={600} fz="sm" c={isUnread ? 'blue.7' : 'dark'}>
                {notification.title}
              </Text>
              {isUnread && (
                <Badge size="xs" color="blue" variant="filled">
                  New
                </Badge>
              )}
            </Group>
            <Text fz="xs" c="dimmed">
              {notification.message}
            </Text>
            {notification.amount && (
              <Text fz="sm" fw={600} c="green">
                You earned {formatCashbackAmount(notification.amount)} cashback!
              </Text>
            )}
            <Text fz="xs" c="dimmed">
              {formatNotificationTime(notification.date)}
            </Text>
          </Stack>
        </Group>
        
        {isUnread && (
          <ActionIcon
            size="sm"
            variant="light"
            color="blue"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
          >
            <Check size={14} />
          </ActionIcon>
        )}
      </Group>
    </Paper>
  );
}