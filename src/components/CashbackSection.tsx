import { 
  Paper, 
  Title, 
  Stack, 
  Group,
  Text,
  Button
} from '@mantine/core';
import { Gift, UserPlus } from 'lucide-react';
import { CashbackData } from '../types/schema';
import { formatCashbackAmount } from '../utils/formatters';

interface CashbackSectionProps {
  cashbackData: CashbackData;
  onInviteFriends: () => void;
}

export function CashbackSection({ cashbackData, onInviteFriends }: CashbackSectionProps) {
  const hasEarnings = cashbackData.totalEarned > 0;

  return (
    <Paper p="xl" radius="md" withBorder>
      <Stack gap="lg">
        <Group gap="md">
          <Gift size={24} color="var(--mantine-color-orange-6)" />
          <Title order={3}>Cashback Earned</Title>
        </Group>

        {hasEarnings ? (
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <div>
                <Text fz="xs" c="dimmed" tt="uppercase" fw={600}>
                  Total Earned
                </Text>
                <Text fz="2xl" fw={700} c="green">
                  {formatCashbackAmount(cashbackData.totalEarned)}
                </Text>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Text fz="xs" c="dimmed" tt="uppercase" fw={600}>
                  Successful Referrals
                </Text>
                <Text fz="xl" fw={600}>
                  {cashbackData.referralCount}
                </Text>
              </div>
            </Group>

            {cashbackData.lastEarned && (
              <Text fz="sm" c="dimmed">
                Last earned on {new Date(cashbackData.lastEarned).toLocaleDateString()}
              </Text>
            )}

            <Button
              leftSection={<UserPlus size={16} />}
              onClick={onInviteFriends}
              variant="light"
              fullWidth
            >
              Invite More Friends
            </Button>
          </Stack>
        ) : (
          <Stack align="center" gap="md" py="lg">
            <Gift size={48} color="var(--mantine-color-gray-5)" />
            <div style={{ textAlign: 'center' }}>
              <Text fw={600} mb="xs">
                You haven't earned any cashback yet
              </Text>
              <Text fz="sm" c="dimmed" mb="lg">
                Start inviting friends to earn up to $50 in cashback!
              </Text>
              <Button
                leftSection={<UserPlus size={16} />}
                onClick={onInviteFriends}
                size="md"
              >
                Invite Friends
              </Button>
            </div>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}