import { AppShell, NavLink, Indicator } from '@mantine/core';
import { LayoutDashboard, History, Users, Settings, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BillsStorageService } from '../services/billsStorageService';
import { formatPaymentStatus } from '../utils/formatters';

interface SidebarProps {
  opened: boolean;
}

export function Sidebar({ opened }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState('dashboard');
  const [hasUrgentBills, setHasUrgentBills] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { id: 'history', label: 'History', icon: History, path: '/history' },
    { id: 'groups', label: 'Groups', icon: Users, path: '/groups' },
    { id: 'bills', label: 'Recurring Bills', icon: FileText, path: '/bills' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  // Update active link based on current route
  useEffect(() => {
    const currentItem = navItems.find(item => item.path === location.pathname);
    if (currentItem) {
      setActiveLink(currentItem.id);
    }
  }, [location.pathname]);

  // Check for urgent bills (due today or tomorrow)
  useEffect(() => {
    const checkUrgentBills = () => {
      const bills = BillsStorageService.getBills();
      const urgentBills = bills.filter(bill => {
        const status = formatPaymentStatus(bill.nextPaymentDate);
        return status === 'Due Today' || status === 'Due Tomorrow';
      });
      setHasUrgentBills(urgentBills.length > 0);
    };

    checkUrgentBills();
    // Check every minute for updates
    const interval = setInterval(checkUrgentBills, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (item: typeof navItems[0]) => {
    setActiveLink(item.id);
    navigate(item.path);
  };

  return (
    <AppShell.Navbar p="md">
      {navItems.map((item) => (
        <div key={item.id} style={{ position: 'relative' }}>
          <NavLink
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
          {item.id === 'bills' && hasUrgentBills && (
            <div
              style={{
                position: 'absolute',
                top: '43%',
                right: '8px',
                transform: 'translateY(-50%)',
                width: '8px',
                height: '8px',
                backgroundColor: '#ff4757',
                borderRadius: '50%',
                zIndex: 10
              }}
            />
          )}
        </div>
      ))}
    </AppShell.Navbar>
  );
}