import { 
  Menu, 
  Stack, 
  Text, 
  Button, 
  Group,
  Divider,
  ScrollArea
} from '@mantine/core';
import { CheckCheck, Trash2, Clock } from 'lucide-react';
import { Notification } from '../types/schema';
import { NotificationStatus } from '../types/enums';
import { NotificationItem } from './NotificationItem';

interface NotificationsDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export function NotificationsDropdown({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onClearAll 
}: NotificationsDropdownProps) {
  const hasNotifications = notifications.length > 0;
  const hasUnread = notifications.some(n => n.status === NotificationStatus.UNREAD);

  return (
    <Menu.Dropdown style={{ width: '400px', maxWidth: '90vw' }}>
      <Menu.Label>
        <Group justify="space-between">
          <Text fw={600}>Notifications</Text>
          {hasUnread && (
            <Button
              size="xs"
              variant="subtle"
              leftSection={<CheckCheck size={14} />}
              onClick={onMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </Group>
      </Menu.Label>
      
      <Divider />
      
      {hasNotifications ? (
        <>
          <ScrollArea.Autosize mah={400} mx="-xs" px="xs">
            <Stack gap="xs" p="xs">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                />
              ))}
            </Stack>
          </ScrollArea.Autosize>
          
          <Divider />
          
          <Menu.Item
            leftSection={<Trash2 size={16} />}
            color="red"
            onClick={onClearAll}
          >
            Clear all notifications
          </Menu.Item>
        </>
      ) : (
        <Stack align="center" p="xl" gap="md">
          <Clock size={32} color="var(--mantine-color-gray-5)" />
          <div style={{ textAlign: 'center' }}>
            <Text fw={600} fz="sm">No notifications</Text>
            <Text fz="xs" c="dimmed">
              You're all caught up! Check back later for updates.
            </Text>
          </div>
        </Stack>
      )}
    </Menu.Dropdown>
  );
}