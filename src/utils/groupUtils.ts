import { Transaction, Group } from '../types/schema';
import { BalanceType, TransactionStatus } from '../types/enums';

export interface GroupMemberBalance {
  name: string;
  balance: number;
  balanceType: BalanceType;
}

export function calculateGroupMemberBalances(
  group: Group, 
  transactions: Transaction[], 
  currentUser: string
): GroupMemberBalance[] {
  const groupTransactions = transactions.filter(t => t.groupName === group.name);
  
  return group.members.map((memberName, index) => {
    let memberBalance = 0;
    
    groupTransactions.forEach(transaction => {
      if (!transaction.amount || !transaction.splitBetween?.includes(memberName)) return;
      
      const splitAmount = transaction.amount / transaction.splitBetween.length;
      
      if (transaction.paidBy === currentUser && memberName !== currentUser) {
        // Current user paid, this member owes their share
        if (transaction.status !== TransactionStatus.SETTLED) {
          memberBalance += splitAmount; // Member owes current user
        }
      } else if (transaction.paidBy === memberName && memberName !== currentUser) {
        // This member paid, current user owes their share
        if (transaction.status !== TransactionStatus.SETTLED) {
          memberBalance -= splitAmount; // Current user owes this member
        }
      }
    });
    
    // Determine balance type from current user's perspective
    let balanceType: BalanceType;
    if (Math.abs(memberBalance) < 0.01) {
      balanceType = BalanceType.SETTLED;
    } else if (memberBalance > 0) {
      balanceType = BalanceType.OWED_TO_YOU; // Member owes current user
    } else {
      balanceType = BalanceType.YOU_OWE; // Current user owes member
    }
    
    return {
      name: memberName,
      balance: Math.abs(memberBalance),
      balanceType
    };
  });
}