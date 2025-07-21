import { MantineProvider, Notification } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './src/components/Dashboard';
import { History } from './src/components/History';
import { Groups } from './src/components/Groups';
import { ProfilePage } from './src/components/ProfilePage';
import { RecurringBillsPage } from './src/components/RecurringBillsPage';
import theme from './src/theme/theme';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Notification />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/bills" element={<RecurringBillsPage />} />
          <Route path="/settings" element={<ProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}