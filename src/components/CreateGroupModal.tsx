import { useState } from 'react';
import { Modal, Stack, TextInput, Button, Group, ActionIcon } from '@mantine/core';
import { X, Plus, Users, User } from 'lucide-react';
import { Group as GroupType, GroupMember } from '../types/schema';

interface CreateGroupModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (group: GroupType) => void;
  currentUser: string;
}

export function CreateGroupModal({ opened, onClose, onSubmit, currentUser }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [participants, setParticipants] = useState<string[]>([currentUser, '']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupName.trim()) return;
    
    // Filter out empty participants and remove duplicates
    const validParticipants = [...new Set(participants.filter(p => p.trim() !== ''))];
    
    if (validParticipants.length === 0) return;

    const newGroup: GroupType = {
      id: 'group-' + Date.now(),
      name: groupName.trim(),
      members: validParticipants,
      memberDetails: validParticipants.map(member => ({
        name: member,
        settled: false
      })),
      totalBalance: 0,
      memberCount: validParticipants.length,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50) + 1}`
    };

    onSubmit(newGroup);
    handleClose();
  };

  const handleClose = () => {
    setGroupName('');
    setParticipants([currentUser, '']);
    onClose();
  };

  const addParticipant = () => {
    setParticipants([...participants, '']);
  };

  const updateParticipant = (index: number, value: string) => {
    const updated = [...participants];
    updated[index] = value;
    setParticipants(updated);
  };

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      const updated = participants.filter((_, i) => i !== index);
      setParticipants(updated);
    }
  };

  const isFormValid = groupName.trim() && participants.some(p => p.trim() !== '');

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Create New Group"
      size="md"
      centered
      closeButtonProps={{
        icon: <X size={20} />
      }}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Group Name"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            leftSection={<Users size={16} />}
            required
          />

          <Stack gap="xs">
            <Group justify="space-between" align="center">
              <span style={{ fontSize: '14px', fontWeight: 500 }}>Participants</span>
              <ActionIcon
                variant="light"
                size="sm"
                onClick={addParticipant}
                color="blue"
              >
                <Plus size={16} />
              </ActionIcon>
            </Group>
            
            <Stack gap="xs">
              {participants.map((participant, index) => (
                <Group key={index} gap="xs">
                  <TextInput
                    placeholder={index === 0 ? "You (current user)" : "Enter participant name"}
                    value={participant}
                    onChange={(e) => updateParticipant(index, e.target.value)}
                    leftSection={<User size={16} />}
                    style={{ flex: 1 }}
                    disabled={index === 0} // Current user field is disabled
                  />
                  {participants.length > 1 && index !== 0 && (
                    <ActionIcon
                      variant="light"
                      size="sm"
                      color="red"
                      onClick={() => removeParticipant(index)}
                    >
                      <X size={16} />
                    </ActionIcon>
                  )}
                </Group>
              ))}
            </Stack>
          </Stack>

          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid}>
              Create Group
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}