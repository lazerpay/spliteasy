import { useState, useEffect } from 'react';
import { 
  Stack, 
  TextInput, 
  NumberInput, 
  Select, 
  Button, 
  Group, 
  Text,
  Checkbox,
  Paper,
  Divider
} from '@mantine/core';
import { 
  DollarSign, 
  FileText, 
  Users, 
  Tag, 
  User,
  Receipt,
  CreditCard,
  Coffee,
  Car,
  Home,
  ShoppingBag,
  Utensils,
  Plus
} from 'lucide-react';
import { Group as GroupType } from '../types/schema';

interface ExpenseFormProps {
  onSubmit: (data: {
    amount: number;
    description: string;
    groupId: string;
    expenseType: 'you_owe' | 'you_are_owed' | 'settled' | 'personal';
    paidBy: string;
    splitBetween: string[];
    category: string;
  }) => void;
  onCancel: () => void;
  groups: GroupType[];
  currentUser: string;
  onGroupCreate: (group: GroupType) => void;
  onOpenCreateGroupModal: () => void;
  newlyCreatedGroupId?: string;
  preselectedGroupId?: string;
}

const expenseCategories = [
  { value: 'food', label: 'Food & Dining', icon: <Utensils size={16} /> },
  { value: 'groceries', label: 'Groceries', icon: <ShoppingBag size={16} /> },
  { value: 'transportation', label: 'Transportation', icon: <Car size={16} /> },
  { value: 'entertainment', label: 'Entertainment', icon: <Coffee size={16} /> },
  { value: 'utilities', label: 'Utilities', icon: <Home size={16} /> },
  { value: 'shopping', label: 'Shopping', icon: <CreditCard size={16} /> },
  { value: 'other', label: 'Other', icon: <Receipt size={16} /> }
];

const expenseTypes = [
  { value: 'you_owe', label: 'You owe money', description: 'Someone else paid, you owe them' },
  { value: 'you_are_owed', label: 'You are owed money', description: 'You paid, others owe you' },
  { value: 'settled', label: 'Already settled', description: 'Everyone has paid their share' },
  { value: 'personal', label: 'Personal expense', description: 'Your own expense, not shared with others' }
];

export function ExpenseForm({ onSubmit, onCancel, groups, currentUser, onGroupCreate, onOpenCreateGroupModal, newlyCreatedGroupId, preselectedGroupId }: ExpenseFormProps) {
  const [amount, setAmount] = useState<number | string>('');
  const [description, setDescription] = useState('');
  const [groupId, setGroupId] = useState<string>('');
  const [expenseType, setExpenseType] = useState<'you_owe' | 'you_are_owed' | 'settled' | 'personal'>('personal');
  const [paidBy, setPaidBy] = useState(currentUser);
  const [splitBetween, setSplitBetween] = useState<string[]>([currentUser]);
  const [category, setCategory] = useState('food');

  const selectedGroup = groups.find(g => g.id === groupId);
  const groupMembers = selectedGroup?.members || [];

  // Auto-select newly created group or preselected group
  useEffect(() => {
    if (newlyCreatedGroupId && groups.find(g => g.id === newlyCreatedGroupId)) {
      setGroupId(newlyCreatedGroupId);
      setExpenseType('you_are_owed'); // Default to "you are owed" for new groups
    } else if (preselectedGroupId && groups.find(g => g.id === preselectedGroupId)) {
      setGroupId(preselectedGroupId);
      setExpenseType('you_are_owed'); // Default to "you are owed" for preselected groups
    }
  }, [newlyCreatedGroupId, preselectedGroupId, groups]);

  // Filter expense types based on whether a group is selected
  const availableExpenseTypes = groupId 
    ? expenseTypes 
    : expenseTypes.filter(type => type.value === 'personal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For personal expenses, groupId is not required
    if (!amount || !description) return;
    if (expenseType !== 'personal' && !groupId) return;

    onSubmit({
      amount: Number(amount),
      description,
      groupId: groupId || '', // Empty string for personal expenses
      expenseType,
      paidBy,
      splitBetween,
      category
    });
  };

  const handleMemberToggle = (member: string) => {
    setSplitBetween(prev => 
      prev.includes(member) 
        ? prev.filter(m => m !== member)
        : [...prev, member]
    );
  };

  // Reset expense type to personal when group is deselected
  const handleGroupChange = (value: string | null) => {
    if (value === 'create-new-group') {
      onOpenCreateGroupModal();
      return;
    }
    
    setGroupId(value || '');
    if (!value) {
      setExpenseType('personal');
      setSplitBetween([currentUser]);
      setPaidBy(currentUser);
    }
  };

  // Prepare dropdown data with create option
  const groupDropdownData = [
    { value: 'create-new-group', label: '+ Create a new group' },
    ...groups.map(group => ({
      value: group.id,
      label: group.name
    }))
  ];

  const isFormValid = amount && description && 
    (expenseType === 'personal' || (groupId && splitBetween.length > 0));

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <NumberInput
          label="Amount"
          placeholder="0.00"
          value={amount}
          onChange={setAmount}
          leftSection={<DollarSign size={16} />}
          decimalScale={2}
          fixedDecimalScale
          required
          min={0}
        />

        <TextInput
          label="Description"
          placeholder="What was this expense for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          leftSection={<FileText size={16} />}
          required
        />

        <Select
          label="Group"
          placeholder="Select a group or create new"
          value={groupId}
          onChange={handleGroupChange}
          data={groupDropdownData}
          leftSection={<Users size={16} />}
        />

        <Select
          label="Category"
          value={category}
          onChange={(value) => setCategory(value || 'food')}
          data={expenseCategories}
          leftSection={<Tag size={16} />}
        />

        <Stack gap="xs">
          <Text fw={500} fz="sm">Expense Type</Text>
          <Stack gap="xs">
            {availableExpenseTypes.map((type) => (
              <Paper
                key={type.value}
                p="sm"
                withBorder
                style={{
                  cursor: 'pointer',
                  backgroundColor: expenseType === type.value ? 'var(--mantine-color-blue-0)' : undefined,
                  borderColor: expenseType === type.value ? 'var(--mantine-color-blue-4)' : undefined
                }}
                onClick={() => setExpenseType(type.value as any)}
              >
                <Group gap="xs">
                  <input
                    type="radio"
                    checked={expenseType === type.value}
                    onChange={() => setExpenseType(type.value as any)}
                    style={{ margin: 0 }}
                  />
                  <Stack gap={2} style={{ flex: 1 }}>
                    <Text fz="sm" fw={500}>{type.label}</Text>
                    <Text fz="xs" c="dimmed">{type.description}</Text>
                  </Stack>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Stack>

        {groupId && (
          <>
            <Select
              label="Paid by"
              value={paidBy}
              onChange={(value) => setPaidBy(value || currentUser)}
              data={groupMembers.map(member => ({
                value: member,
                label: member
              }))}
              leftSection={<User size={16} />}
            />

            <Stack gap="xs">
              <Text fw={500} fz="sm">Split between</Text>
              <Stack gap="xs">
                {groupMembers.map((member) => (
                  <Checkbox
                    key={member}
                    label={member}
                    checked={splitBetween.includes(member)}
                    onChange={() => handleMemberToggle(member)}
                  />
                ))}
              </Stack>
              <Text fz="xs" c="dimmed">
                Split amount: ${splitBetween.length > 0 ? (Number(amount) / splitBetween.length).toFixed(2) : '0.00'} per person
              </Text>
            </Stack>
          </>
        )}

        <Divider />

        <Group justify="flex-end" gap="sm">
          <Button variant="subtle" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isFormValid}>
            Add Expense
          </Button>
        </Group>
      </Stack>
    </form>
  );
}