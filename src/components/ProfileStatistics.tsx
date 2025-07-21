import { 
  Paper, 
  Title, 
  SimpleGrid, 
  Stack,
  Group as MantineGroup,
  Text
} from '@mantine/core';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  Target,
  CheckCircle,
  Clock,
  Crown,
  Activity
} from 'lucide-react';

import { StatisticCard } from './StatisticCard';
import { calculateUserStatistics, UserStatistics } from '../utils/profileStats';
import type { User, Transaction, Group } from '../types/schema';

interface ProfileStatisticsProps {
  user: User;
  transactions: Transaction[];
  groups: Group[];
}

export function ProfileStatistics({ user, transactions, groups }: ProfileStatisticsProps) {
  const stats = calculateUserStatistics(user, transactions, groups);

  const formatTrendText = (stats: UserStatistics) => {
    const { currentMonth, lastMonth, trend } = stats.monthlyStats;
    const difference = Math.abs(currentMonth - lastMonth);
    const percentage = lastMonth > 0 ? ((difference / lastMonth) * 100).toFixed(1) : '0';
    
    if (trend === 'up') {
      return `↗ ${percentage}% from last month`;
    } else if (trend === 'down') {
      return `↘ ${percentage}% from last month`;
    } else {
      return 'Same as last month';
    }
  };

  return (
    <Paper p="xl" radius="md" withBorder>
      <Stack gap="lg">
        <MantineGroup gap="md">
          <BarChart3 size={24} color="var(--mantine-color-dimmed)" />
          <Title order={3}>Activity Statistics</Title>
        </MantineGroup>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          <StatisticCard
            title="Groups Joined"
            value={stats.totalGroups}
            subtitle={`${stats.groupsAsAdmin} as admin`}
            icon={<Users size={16} />}
            color="blue"
          />
          
          <StatisticCard
            title="Total Transactions"
            value={stats.totalTransactions}
            subtitle={`${stats.settledTransactions} settled, ${stats.pendingTransactions} pending`}
            icon={<Activity size={16} />}
            color="green"
          />
          
          <StatisticCard
            title="Total Amount Spent"
            value={stats.totalAmountSpent}
            subtitle={formatTrendText(stats)}
            icon={<DollarSign size={16} />}
            color="orange"
            trend={stats.monthlyStats.trend}
          />
          
          {stats.averageTransactionAmount > 0 && (
            <StatisticCard
              title="Average Transaction"
              value={stats.averageTransactionAmount}
              subtitle="Per expense you paid"
              icon={<Target size={16} />}
              color="purple"
            />
          )}
          
          {stats.mostActiveGroup && (
            <StatisticCard
              title="Most Active Group"
              value={stats.mostActiveGroup.name}
              subtitle={`${stats.mostActiveGroup.transactionCount} transactions`}
              icon={<TrendingUp size={16} />}
              color="teal"
            />
          )}
          
          {stats.mostSpentInGroup && (
            <StatisticCard
              title="Highest Spending Group"
              value={stats.mostSpentInGroup.name}
              subtitle={`$${stats.mostSpentInGroup.amount.toFixed(2)} total`}
              icon={<Crown size={16} />}
              color="yellow"
            />
          )}
        </SimpleGrid>

        {stats.largestTransaction && (
          <Paper p="md" radius="md" bg="gray.0" style={{ border: '1px solid var(--mantine-color-gray-3)' }}>
            <Stack gap="xs">
                <MantineGroup gap="sm">
                <CheckCircle size={16} color="var(--mantine-color-green-6)" />
                <Text fw={600} fz="sm">Largest Transaction</Text>
              </MantineGroup>
              <Text fz="lg" fw={700} c="green">
                ${stats.largestTransaction.amount.toFixed(2)}
              </Text>
              <Text fz="sm" c="dimmed">
                {stats.largestTransaction.description} • {new Date(stats.largestTransaction.date).toLocaleDateString()}
              </Text>
            </Stack>
          </Paper>
        )}

        {stats.totalTransactions === 0 && (
          <Paper p="xl" ta="center" c="dimmed" bg="gray.0">
            <Stack gap="md" align="center">
              <Clock size={32} color="var(--mantine-color-gray-5)" />
              <div>
                <Text fw={600}>No Activity Yet</Text>
                <Text fz="sm">Start adding expenses to see your statistics!</Text>
              </div>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Paper>
  );
}