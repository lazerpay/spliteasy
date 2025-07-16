import { Modal, Stack, Button, Group } from '@mantine/core';
import { X } from 'lucide-react';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { ExpenseForm } from './ExpenseForm';
import { CreateGroupModal } from './CreateGroupModal';
import { Transaction, Group as GroupType } from '../types/schema';
import { TransactionType, TransactionStatus } from '../types/enums';

interface AddExpenseModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (transaction: Transaction) => void;
  groups: GroupType[];
  currentUser: string;
  onGroupCreate: (group: GroupType) => void;
  preselectedGroupId?: string;
}

export function AddExpenseModal({ 
  opened, 
  onClose, 
  onSubmit, 
  groups, 
  currentUser,
  onGroupCreate,
  preselectedGroupId 
}: AddExpenseModalProps) {
  const [createGroupModalOpened, { open: openCreateGroupModal, close: closeCreateGroupModal }] = useDisclosure(false);
  const [newlyCreatedGroupId, setNewlyCreatedGroupId] = useState<string>('');
  const handleSubmit = (formData: {
    amount: number;
    description: string;
    groupId: string;
    expenseType: 'you_owe' | 'you_are_owed' | 'settled' | 'personal';
    paidBy: string;
    splitBetween: string[];
    category: string;
  }) => {
    const selectedGroup = groups.find(g => g.id === formData.groupId);
    
    // Handle different expense types
    let paidBy = formData.paidBy;
    let splitBetween = formData.splitBetween;
    let status = TransactionStatus.PENDING;
    let groupName = selectedGroup?.name;
    
    if (formData.expenseType === 'personal') {
      paidBy = currentUser;
      splitBetween = [currentUser];
      status = TransactionStatus.SETTLED;
      groupName = undefined; // Personal expenses don't belong to a group
    } else if (formData.expenseType === 'you_owe') {
      // Someone else paid, you owe them
      paidBy = formData.paidBy;
      splitBetween = formData.splitBetween;
    } else if (formData.expenseType === 'you_are_owed') {
      // You paid, others owe you
      paidBy = currentUser;
      splitBetween = formData.splitBetween;
    } else if (formData.expenseType === 'settled') {
      status = TransactionStatus.SETTLED;
    }
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: TransactionType.EXPENSE,
      description: formData.description,
      amount: formData.amount,
      paidBy: paidBy,
      splitBetween: splitBetween,
      date: new Date(),
      status: status,
      groupName: groupName
    };

    onSubmit(newTransaction);
    onClose();
  };

  const handleGroupCreate = (newGroup: GroupType) => {
    onGroupCreate(newGroup);
    setNewlyCreatedGroupId(newGroup.id);
    closeCreateGroupModal();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title="Add New Expense"
        size="md"
        centered
        closeButtonProps={{
          icon: <X size={20} />
        }}
      >
        <ExpenseForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          groups={groups}
          currentUser={currentUser}
          onGroupCreate={handleGroupCreate}
          onOpenCreateGroupModal={openCreateGroupModal}
          newlyCreatedGroupId={newlyCreatedGroupId}
          preselectedGroupId={preselectedGroupId}
        />
      </Modal>

      <CreateGroupModal
        opened={createGroupModalOpened}
        onClose={closeCreateGroupModal}
        onSubmit={handleGroupCreate}
        currentUser={currentUser}
      />
    </>
  );
}