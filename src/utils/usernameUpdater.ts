import { Transaction, Group } from '../types/schema';

export interface UsernameUpdateResult {
  updatedTransactions: Transaction[];
  updatedGroups: Group[];
}

export function updateUsernameInData(
  oldUsername: string,
  newUsername: string,
  transactions: Transaction[],
  groups: Group[]
): UsernameUpdateResult {
  console.log('Updating username from', oldUsername, 'to', newUsername);
  
  // Update transactions
  const updatedTransactions = transactions.map(transaction => {
    const updatedTransaction = { ...transaction };
    
    // Update paidBy field
    if (updatedTransaction.paidBy === oldUsername) {
      updatedTransaction.paidBy = newUsername;
    }
    
    // Update splitBetween array
    if (updatedTransaction.splitBetween && updatedTransaction.splitBetween.includes(oldUsername)) {
      updatedTransaction.splitBetween = updatedTransaction.splitBetween.map(member => 
        member === oldUsername ? newUsername : member
      );
    }
    
    return updatedTransaction;
  });
  
  // Update groups
  const updatedGroups = groups.map(group => {
    const updatedGroup = { ...group };
    
    // Update members array
    if (updatedGroup.members && updatedGroup.members.includes(oldUsername)) {
      updatedGroup.members = updatedGroup.members.map(member => 
        member === oldUsername ? newUsername : member
      );
    }
    
    // Update memberDetails if it exists
    if (updatedGroup.memberDetails) {
      updatedGroup.memberDetails = updatedGroup.memberDetails.map(memberDetail => 
        memberDetail.name === oldUsername 
          ? { ...memberDetail, name: newUsername }
          : memberDetail
      );
    }
    
    return updatedGroup;
  });
  
  console.log('Username update completed:', {
    transactionsUpdated: updatedTransactions.filter((t, i) => 
      t.paidBy !== transactions[i].paidBy || 
      JSON.stringify(t.splitBetween) !== JSON.stringify(transactions[i].splitBetween)
    ).length,
    groupsUpdated: updatedGroups.filter((g, i) => 
      JSON.stringify(g.members) !== JSON.stringify(groups[i].members)
    ).length
  });
  
  return {
    updatedTransactions,
    updatedGroups
  };
}