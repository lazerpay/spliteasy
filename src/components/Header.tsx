import { AppShell, Group, ActionIcon, Menu, Avatar, Text, Burger } from '@mantine/core';
import { Bell, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { User as UserType } from '../types/schema';
import { Logo } from './Logo';
import { NotificationBadge } from './NotificationBadge';
import { NotificationsDropdown } from './NotificationsDropdown';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface HeaderProps {
  user: UserType;
  opened: boolean;
  toggle: () => void;
}

export function Header({ user, opened, toggle }: HeaderProps) {
  const navigate = useNavigate();
  const [notificationsOpened, { toggle: toggleNotifications, close: closeNotifications }] = useDisclosure(false);
  
  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications
  } = useLocalStorage();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };
  return (
    <AppShell.Header p="md">
      <Group justify="space-between" h="100%">
        <Group>
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
          />
          <Logo size="lg" />
        </Group>

        <Group gap="md" style={{ overflow: 'visible' }}>
          <Menu 
            shadow="md" 
            opened={notificationsOpened} 
            onChange={toggleNotifications}
            position="bottom-end"
            offset={5}
          >
            <Menu.Target>
              <ActionIcon 
                variant="light" 
                color="gray" 
                size="lg"
                style={{ 
                  position: 'relative',
                  overflow: 'visible'
                }}
              >
                <Bell size={20} />
                <NotificationBadge count={unreadNotificationCount} />
              </ActionIcon>
            </Menu.Target>
            
            <NotificationsDropdown
              notifications={notifications}
              onMarkAsRead={markNotificationAsRead}
              onMarkAllAsRead={markAllNotificationsAsRead}
              onClearAll={clearAllNotifications}
            />
          </Menu>

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Group style={{ cursor: 'pointer' }} gap="sm">
                <Avatar src={user.avatar} size="sm" radius="xl" />
                <Text size="sm" fw={500} visibleFrom="xs">
                  {user.name}
                </Text>
              </Group>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item 
                leftSection={<User size={16} />}
                onClick={handleProfileClick}
              >
                Profile
              </Menu.Item>
              <Menu.Item 
                leftSection={<Settings size={16} />}
                onClick={handleSettingsClick}
              >
                Settings
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </AppShell.Header>
  );
}