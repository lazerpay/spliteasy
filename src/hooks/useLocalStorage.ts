import { useState, useEffect } from 'react';
import { LocalStorageService } from '../services/localStorageService';
import { UserService } from '../services/userService';
import { User, FinancialSummary, Transaction, Group, Friend } from '../types/schema';
import { TransactionStatus } from '../types/enums';
import { updateUsernameInData } from '../utils/usernameUpdater';

export function useLocalStorage() {
  const [user, setUser] = useState<User | null>(null);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    
    const storedUser = LocalStorageService.getUser();
    const storedSummary = LocalStorageService.getSummary();
    const storedTransactions = LocalStorageService.getTransactions();
    const storedGroups = LocalStorageService.getGroups();
    const storedFriends = LocalStorageService.getFriends();
    const firstTime = LocalStorageService.isFirstTime();

    if (!storedUser && firstTime) {
      // First time user - create new user
      const newUser = UserService.createNewUser();
      const defaultSummary: FinancialSummary = {
        totalBalance: 0,
        youOwe: 0,
        youAreOwed: 0,
        monthlySpending: 0
      };

      setUser(newUser);
      setSummary(defaultSummary);
      setTransactions([]);
      setGroups([]);
      setFriends([]);
      setIsFirstTime(true);

      LocalStorageService.setUser(newUser);
      LocalStorageService.setSummary(defaultSummary);
      LocalStorageService.setTransactions([]);
      LocalStorageService.setGroups([]);
      LocalStorageService.setFriends([]);
    } else {
      setUser(storedUser);
      setSummary(storedSummary);
      setTransactions(storedTransactions);
      setGroups(storedGroups);
      setFriends(storedFriends);
      setIsFirstTime(firstTime);
    }

    setIsLoading(false);
  };

  const updateUser = (updatedUser: User) => {
    const oldUsername = user?.name;
    const newUsername = updatedUser.name;
    
    // If username changed, update all references in transactions and groups
    if (oldUsername && newUsername && oldUsername !== newUsername) {
      const { updatedTransactions, updatedGroups } = updateUsernameInData(
        oldUsername,
        newUsername,
        transactions,
        groups
      );
      
      // Update transactions and groups with new username references
      setTransactions(updatedTransactions);
      setGroups(updatedGroups);
      LocalStorageService.setTransactions(updatedTransactions);
      LocalStorageService.setGroups(updatedGroups);
      
      // Recalculate summary with updated data
      const newSummary = calculateSummary(updatedTransactions, newUsername);
      setSummary(newSummary);
      LocalStorageService.setSummary(newSummary);
      
      // Recalculate group balances with updated data
      const recalculatedGroups = calculateGroupBalances(updatedTransactions, updatedGroups, newUsername);
      setGroups(recalculatedGroups);
      LocalStorageService.setGroups(recalculatedGroups);
    }
    
    setUser(updatedUser);
    LocalStorageService.setUser(updatedUser);
  };

  const updateSummary = (updatedSummary: FinancialSummary) => {
    setSummary(updatedSummary);
    LocalStorageService.setSummary(updatedSummary);
  };

  const calculateSummary = (transactionList: Transaction[], currentUser: string): FinancialSummary => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    let youOwe = 0;
    let youAreOwed = 0;
    let monthlySpending = 0;
    
    transactionList.forEach(transaction => {
      if (!transaction.amount) return;
      
      const transactionMonth = new Date(transaction.date).getMonth();
      const transactionYear = new Date(transaction.date).getFullYear();
      
      // Calculate monthly spending for current month
      if (transactionMonth === currentMonth && transactionYear === currentYear) {
        if (transaction.splitBetween && transaction.splitBetween.includes(currentUser)) {
          // Calculate your share of the expense
          const yourShare = transaction.amount / transaction.splitBetween.length;
          
          if (transaction.paidBy === currentUser) {
            // You paid for the group
            if (transaction.status === TransactionStatus.SETTLED) {
              // If settled, you only spent your share
              monthlySpending += yourShare;
            } else {
              // If not settled, you spent the full amount (but are owed back)
              monthlySpending += transaction.amount;
            }
          } else {
            // Someone else paid, but if settled, you effectively spent your share
            if (transaction.status === TransactionStatus.SETTLED) {
              monthlySpending += yourShare;
            }
            // If not settled, you haven't actually spent anything yet (you owe but haven't paid)
          }
        } else if (transaction.paidBy === currentUser) {
          // Personal expense or you paid but not in split (shouldn't happen but handle it)
          monthlySpending += transaction.amount;
        }
      }
      
      // Calculate balances based on expense type and who paid
      if (transaction.splitBetween && transaction.splitBetween.includes(currentUser)) {
        const splitAmount = transaction.amount / transaction.splitBetween.length;
        
        if (transaction.paidBy === currentUser) {
          // You paid, others owe you their share
          const othersShare = transaction.amount - splitAmount;
          if (othersShare > 0 && transaction.status !== TransactionStatus.SETTLED) {
            youAreOwed += othersShare;
          }
        } else {
          // Someone else paid, you owe your share
          if (transaction.status !== TransactionStatus.SETTLED) {
            youOwe += splitAmount;
          }
        }
      }
    });
    
    const totalBalance = youAreOwed - youOwe;
    
    return {
      totalBalance,
      youOwe,
      youAreOwed,
      monthlySpending
    };
  };

  const calculateGroupBalances = (transactionList: Transaction[], groupsList: Group[], currentUser: string): Group[] => {
    return groupsList.map(group => {
      const groupTransactions = transactionList.filter(t => t.groupName === group.name);
      let userBalance = 0;
      
      groupTransactions.forEach(transaction => {
        if (!transaction.amount || !transaction.splitBetween?.includes(currentUser)) return;
        
        const splitAmount = transaction.amount / transaction.splitBetween.length;
        
        if (transaction.paidBy === currentUser) {
          // User paid, others owe them
          const othersShare = transaction.amount - splitAmount;
          if (othersShare > 0 && transaction.status !== TransactionStatus.SETTLED) {
            userBalance += othersShare;
          }
        } else {
          // Someone else paid, user owes their share
          if (transaction.status !== TransactionStatus.SETTLED) {
            userBalance -= splitAmount;
          }
        }
      });
      
      return {
        ...group,
        totalBalance: userBalance,
        expenses: groupTransactions
      };
    });
  };

  const addTransaction = (transaction: Transaction) => {
    const updatedTransactions = [transaction, ...transactions];
    setTransactions(updatedTransactions);
    LocalStorageService.setTransactions(updatedTransactions);
    
    // Recalculate and update summary
    if (user) {
      const newSummary = calculateSummary(updatedTransactions, user.name);
      setSummary(newSummary);
      LocalStorageService.setSummary(newSummary);
      
      // Update group balances
      const updatedGroups = calculateGroupBalances(updatedTransactions, groups, user.name);
      setGroups(updatedGroups);
      LocalStorageService.setGroups(updatedGroups);
    }
  };

  const updateTransaction = (transactionId: string, updates: Partial<Transaction>) => {
    const updatedTransactions = transactions.map(t => 
      t.id === transactionId ? { ...t, ...updates } : t
    );
    setTransactions(updatedTransactions);
    LocalStorageService.setTransactions(updatedTransactions);
    
    // Recalculate and update summary and group balances
    if (user) {
      const newSummary = calculateSummary(updatedTransactions, user.name);
      setSummary(newSummary);
      LocalStorageService.setSummary(newSummary);
      
      const updatedGroups = calculateGroupBalances(updatedTransactions, groups, user.name);
      setGroups(updatedGroups);
      LocalStorageService.setGroups(updatedGroups);
    }
  };

  const deleteTransaction = (transactionId: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== transactionId);
    setTransactions(updatedTransactions);
    LocalStorageService.setTransactions(updatedTransactions);
    
    // Recalculate and update summary and group balances
    if (user) {
      const newSummary = calculateSummary(updatedTransactions, user.name);
      setSummary(newSummary);
      LocalStorageService.setSummary(newSummary);
      
      const updatedGroups = calculateGroupBalances(updatedTransactions, groups, user.name);
      setGroups(updatedGroups);
      LocalStorageService.setGroups(updatedGroups);
    }
  };

  const addGroup = (group: Group) => {
    const updatedGroups = [...groups, group];
    setGroups(updatedGroups);
    LocalStorageService.setGroups(updatedGroups);
  };

  const deleteAllGroups = () => {
    setGroups([]);
    LocalStorageService.setGroups([]);
    
    // Also remove group references from transactions
    const updatedTransactions = transactions.map(transaction => ({
      ...transaction,
      groupName: undefined
    }));
    setTransactions(updatedTransactions);
    LocalStorageService.setTransactions(updatedTransactions);
    
    // Recalculate summary without group data
    if (user) {
      const newSummary = calculateSummary(updatedTransactions, user.name);
      setSummary(newSummary);
      LocalStorageService.setSummary(newSummary);
    }
  };

  const deleteGroup = (groupId: string) => {
    const groupToDelete = groups.find(g => g.id === groupId);
    if (!groupToDelete) return;

    const updatedGroups = groups.filter(g => g.id !== groupId);
    setGroups(updatedGroups);
    LocalStorageService.setGroups(updatedGroups);
    
    // Remove group references from transactions
    const updatedTransactions = transactions.map(transaction => 
      transaction.groupName === groupToDelete.name 
        ? { ...transaction, groupName: undefined }
        : transaction
    );
    setTransactions(updatedTransactions);
    LocalStorageService.setTransactions(updatedTransactions);
    
    // Recalculate summary
    if (user) {
      const newSummary = calculateSummary(updatedTransactions, user.name);
      setSummary(newSummary);
      LocalStorageService.setSummary(newSummary);
    }
  };

  const removeMemberFromGroup = (groupId: string, memberName: string) => {
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        const updatedMembers = group.members.filter(member => member !== memberName);
        return {
          ...group,
          members: updatedMembers,
          memberCount: updatedMembers.length
        };
      }
      return group;
    });
    
    setGroups(updatedGroups);
    LocalStorageService.setGroups(updatedGroups);
    
    // Remove member from group transactions
    const updatedTransactions = transactions.map(transaction => {
      if (transaction.groupName === groups.find(g => g.id === groupId)?.name && 
          transaction.splitBetween?.includes(memberName)) {
        return {
          ...transaction,
          splitBetween: transaction.splitBetween.filter(member => member !== memberName)
        };
      }
      return transaction;
    });
    
    setTransactions(updatedTransactions);
    LocalStorageService.setTransactions(updatedTransactions);
    
    // Recalculate balances
    if (user) {
      const newSummary = calculateSummary(updatedTransactions, user.name);
      setSummary(newSummary);
      LocalStorageService.setSummary(newSummary);
      
      const recalculatedGroups = calculateGroupBalances(updatedTransactions, updatedGroups, user.name);
      setGroups(recalculatedGroups);
      LocalStorageService.setGroups(recalculatedGroups);
    }
  };

  const markMemberAsSettled = (groupId: string, memberName: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group || !user) return;

    // Find all pending transactions in this group involving this member
    const updatedTransactions = transactions.map(transaction => {
      if (transaction.groupName === group.name && 
          transaction.splitBetween?.includes(memberName) &&
          transaction.status !== TransactionStatus.SETTLED) {
        return { ...transaction, status: TransactionStatus.SETTLED };
      }
      return transaction;
    });
    
    setTransactions(updatedTransactions);
    LocalStorageService.setTransactions(updatedTransactions);
    
    // Recalculate balances
    const newSummary = calculateSummary(updatedTransactions, user.name);
    setSummary(newSummary);
    LocalStorageService.setSummary(newSummary);
    
    const updatedGroups = calculateGroupBalances(updatedTransactions, groups, user.name);
    setGroups(updatedGroups);
    LocalStorageService.setGroups(updatedGroups);
  };

  const clearGroupActivity = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group || !user) return;

    // Remove all transactions for this group
    const updatedTransactions = transactions.filter(transaction => 
      transaction.groupName !== group.name
    );
    
    setTransactions(updatedTransactions);
    LocalStorageService.setTransactions(updatedTransactions);
    
    // Recalculate balances
    const newSummary = calculateSummary(updatedTransactions, user.name);
    setSummary(newSummary);
    LocalStorageService.setSummary(newSummary);
    
    // Update group to remove expenses
    const updatedGroups = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          totalBalance: 0,
          expenses: []
        };
      }
      return g;
    });
    
    const recalculatedGroups = calculateGroupBalances(updatedTransactions, updatedGroups, user.name);
    setGroups(recalculatedGroups);
    LocalStorageService.setGroups(recalculatedGroups);
  };

  const addFriend = (friend: Friend) => {
    const updatedFriends = [...friends, friend];
    setFriends(updatedFriends);
    LocalStorageService.setFriends(updatedFriends);
  };

  const completeOnboarding = () => {
    setIsFirstTime(false);
    LocalStorageService.setFirstTime(false);
  };

  const clearAllData = () => {
    LocalStorageService.clearAllData();
    loadData();
  };

  return {
    user,
    summary,
    transactions,
    groups,
    friends,
    isFirstTime,
    isLoading,
    updateUser,
    updateSummary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addGroup,
    deleteGroup,
    deleteAllGroups,
    removeMemberFromGroup,
    markMemberAsSettled,
    clearGroupActivity,
    addFriend,
    completeOnboarding,
    clearAllData,
    loadData
  };
}