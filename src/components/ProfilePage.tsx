import { 
  AppShell, 
  Container, 
  Title, 
  Stack, 
  Paper,
  Group,
  Avatar,
  Text,
  Button,
  LoadingOverlay,
  Modal
} from '@mantine/core';
import { User, Settings, Trash2, AlertTriangle } from 'lucide-react';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ProfileForm } from './ProfileForm';
import { ProfileStatistics } from './ProfileStatistics';
import { DangerZone } from './DangerZone';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function ProfilePage() {
  const [opened, { toggle }] = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const {
    user,
    transactions,
    groups,
    isLoading,
    updateUser
  } = useLocalStorage();

  const handleEditUsername = () => {
    setIsEditing(true);
  };

  const handleSaveUsername = (newUsername: string) => {
    if (user) {
      const oldUsername = user.name;
      const updatedUser = {
        ...user,
        name: newUsername,
        email: `${newUsername.toLowerCase().replace(/\s+/g, '')}@example.com`
      };
      
      console.log(`Updating username from "${oldUsername}" to "${newUsername}"`);
      updateUser(updatedUser);
      
      // Show success feedback (could be enhanced with notifications)
      console.log('Username updated successfully. All historical data has been updated.');
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <AppShell
        header={{ height: 70 }}
        navbar={{
          width: 250,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <LoadingOverlay visible />
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell
        header={{ height: 70 }}
        navbar={{
          width: 250,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <Container size="xl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <Text>No user data found</Text>
        </Container>
      </AppShell>
    );
  }

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <Header user={user} opened={opened} toggle={toggle} />
      <Sidebar opened={opened} />

      <AppShell.Main>
        <Container size="md">
          <Stack gap="xl">
            {/* Page Header */}
            <Group gap="md">
              <Settings size={32} color="var(--mantine-color-orange-6)" />
              <Title order={1}>Profile Settings</Title>
            </Group>

            {/* Profile Section */}
            <Paper p="xl" radius="md" withBorder>
              <Stack gap="lg">
                <Group gap="md">
                  <User size={24} color="var(--mantine-color-dimmed)" />
                  <Title order={3}>Profile Information</Title>
                </Group>

                <Group gap="xl" align="flex-start">
                  <Avatar
                    src={user.avatar}
                    size={80}
                    radius="md"
                    alt={user.name}
                  />
                  
                  <Stack gap="md" style={{ flex: 1 }}>
                    {isEditing ? (
                      <ProfileForm
                        currentUsername={user.name}
                        onSave={handleSaveUsername}
                        onCancel={handleCancelEdit}
                      />
                    ) : (
                      <Stack gap="xs">
                        <Group justify="space-between" align="center">
                          <div>
                            <Text fw={600} fz="lg">{user.name}</Text>
                            <Text c="dimmed" fz="sm">{user.email}</Text>
                          </div>
                          <Button
                            variant="light"
                            size="sm"
                            onClick={handleEditUsername}
                            leftSection={<User size={16} />}
                          >
                            Edit Username
                          </Button>
                        </Group>
                      </Stack>
                    )}
                  </Stack>
                </Group>
              </Stack>
            </Paper>

            {/* Statistics Section */}
            <ProfileStatistics 
              user={user}
              transactions={transactions}
              groups={groups}
            />

            {/* Danger Zone */}
            <DangerZone />
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}