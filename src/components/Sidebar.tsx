import { AppShell, NavLink } from '@mantine/core';
import { LayoutDashboard, History, Users, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  opened: boolean;
}

export function Sidebar({ opened }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { id: 'history', label: 'History', icon: History, path: '/history' },
    { id: 'groups', label: 'Groups', icon: Users, path: '/groups' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  // Update active link based on current route
  useEffect(() => {
    const currentItem = navItems.find(item => item.path === location.pathname);
    if (currentItem) {
      setActiveLink(currentItem.id);
    }
  }, [location.pathname]);

  const handleNavigation = (item: typeof navItems[0]) => {
    setActiveLink(item.id);
    navigate(item.path);
  };

  return (
    <AppShell.Navbar p="md">
      {navItems.map((item) => (
        <NavLink
          key={item.id}
          active={activeLink === item.id}
          label={item.label}
          leftSection={<item.icon size={20} />}
          onClick={() => handleNavigation(item)}
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