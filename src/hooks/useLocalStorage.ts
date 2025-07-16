import { useState, useEffect } from 'react';
import { LocalStorageService } from '../services/localStorageService';
import { UserService } from '../services/userService';
import { User, FinancialSummary, Transaction, Group, Friend } from '../types/schema';
import { TransactionStatus } from '../types/enums';

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
    addFriend,
    completeOnboarding,
    clearAllData,
    loadData
  };
}