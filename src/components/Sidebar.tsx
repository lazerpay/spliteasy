import { AppShell, NavLink } from '@mantine/core';
import { LayoutDashboard, History, Users, Settings } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  opened: boolean;
}

export function Sidebar({ opened }: SidebarProps) {
  const [activeLink, setActiveLink] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'History', icon: History },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <AppShell.Navbar p="md">
      {navItems.map((item) => (
        <NavLink
          key={item.id}
          active={activeLink === item.id}
          label={item.label}
          leftSection={<item.icon size={20} />}
          onClick={() => setActiveLink(item.id)}
          mb="xs"
          styles={{
            root: {
              borderRadius: '8px'
            }
          }}
        />
      ))}
    </AppShell.Navbar>
  );
}