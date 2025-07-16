import { 
  TextInput, 
  Button, 
  Group, 
  Stack,
  Text
} from '@mantine/core';
import { useState } from 'react';
import { Check, X } from 'lucide-react';

interface ProfileFormProps {
  currentUsername: string;
  onSave: (newUsername: string) => void;
  onCancel: () => void;
}

export function ProfileForm({ currentUsername, onSave, onCancel }: ProfileFormProps) {
  const [username, setUsername] = useState(currentUsername);
  const [error, setError] = useState('');

  const handleSave = () => {
    const trimmedUsername = username.trim();
    
    if (!trimmedUsername) {
      setError('Username cannot be empty');
      return;
    }
    
    if (trimmedUsername.length < 2) {
      setError('Username must be at least 2 characters long');
      return;
    }
    
    if (trimmedUsername.length > 50) {
      setError('Username must be less than 50 characters');
      return;
    }
    
    // Basic validation for special characters
    const validUsernameRegex = /^[a-zA-Z0-9\s\-_\.]+$/;
    if (!validUsernameRegex.test(trimmedUsername)) {
      setError('Username can only contain letters, numbers, spaces, hyphens, underscores, and periods');
      return;
    }
    
    setError('');
    onSave(trimmedUsername);
  };

  const handleCancel = () => {
    setUsername(currentUsername);
    setError('');
    onCancel();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <Stack gap="md">
      <TextInput
        label="Username"
        placeholder="Enter your username"
        value={username}
        onChange={(event) => {
          setUsername(event.currentTarget.value);
          if (error) setError(''); // Clear error when user starts typing
        }}
        onKeyDown={handleKeyPress}
        error={error}
        autoFocus
        maxLength={50}
      />
      
      {error && (
        <Text c="red" fz="sm">
          {error}
        </Text>
      )}
      
      <Group gap="sm">
        <Button
          leftSection={<Check size={16} />}
          onClick={handleSave}
          disabled={!username.trim() || username.trim() === currentUsername}
        >
          Save
        </Button>
        <Button
          variant="light"
          leftSection={<X size={16} />}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Group>
    </Stack>
  );
}