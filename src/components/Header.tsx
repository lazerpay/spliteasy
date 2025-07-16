import { AppShell, Group, ActionIcon, Menu, Avatar, Text, Burger } from '@mantine/core';
import { Bell, LogOut, User, Settings } from 'lucide-react';
import { User as UserType } from '../types/schema';
import { Logo } from './Logo';

interface HeaderProps {
  user: UserType;
  opened: boolean;
  toggle: () => void;
}

export function Header({ user, opened, toggle }: HeaderProps) {
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

        <Group gap="md">
          <ActionIcon variant="light" color="gray" size="lg">
            <Bell size={20} />
          </ActionIcon>

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
              <Menu.Item leftSection={<User size={16} />}>
                Profile
              </Menu.Item>
              <Menu.Item leftSection={<Settings size={16} />}>
                Settings
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<LogOut size={16} />} color="red">
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </AppShell.Header>
  );
}