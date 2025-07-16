import { TextInput, Paper } from '@mantine/core';
import { Search } from 'lucide-react';

interface HistorySearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

export function HistorySearchBar({ 
  searchQuery, 
  onSearchChange, 
  placeholder = "Search by description or group name..." 
}: HistorySearchBarProps) {
  return (
    <Paper p="md" radius="md" withBorder>
      <TextInput
        placeholder={placeholder}
        leftSection={<Search size={16} />}
        value={searchQuery}
        onChange={(event) => onSearchChange(event.currentTarget.value)}
        size="md"
      />
    </Paper>
  );
}