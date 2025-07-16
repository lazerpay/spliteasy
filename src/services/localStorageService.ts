import { User, FinancialSummary, Transaction, Group, Friend } from '../types/schema';

const STORAGE_KEYS = {
  USER: 'splitease_user',
  SUMMARY: 'splitease_summary',
  TRANSACTIONS: 'splitease_transactions',
  GROUPS: 'splitease_groups',
  FRIENDS: 'splitease_friends',
  IS_FIRST_TIME: 'splitease_first_time'
};

export class LocalStorageService {
  static setUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  static getUser(): User | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  }

  static setSummary(summary: FinancialSummary): void {
    localStorage.setItem(STORAGE_KEYS.SUMMARY, JSON.stringify(summary));
  }

  static getSummary(): FinancialSummary | null {
    const summaryData = localStorage.getItem(STORAGE_KEYS.SUMMARY);
    return summaryData ? JSON.parse(summaryData) : null;
  }

  static setTransactions(transactions: Transaction[]): void {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }

  static getTransactions(): Transaction[] {
    const transactionsData = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (transactionsData) {
      const transactions = JSON.parse(transactionsData);
      // Convert date strings back to Date objects
      return transactions.map((t: any) => ({
        ...t,
        date: new Date(t.date)
      }));
    }
    return [];
  }

  static setGroups(groups: Group[]): void {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  }

  static getGroups(): Group[] {
    const groupsData = localStorage.getItem(STORAGE_KEYS.GROUPS);
    return groupsData ? JSON.parse(groupsData) : [];
  }

  static setFriends(friends: Friend[]): void {
    localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(friends));
  }

  static getFriends(): Friend[] {
    const friendsData = localStorage.getItem(STORAGE_KEYS.FRIENDS);
    return friendsData ? JSON.parse(friendsData) : [];
  }

  static setFirstTime(isFirstTime: boolean): void {
    localStorage.setItem(STORAGE_KEYS.IS_FIRST_TIME, JSON.stringify(isFirstTime));
  }

  static isFirstTime(): boolean {
    const firstTimeData = localStorage.getItem(STORAGE_KEYS.IS_FIRST_TIME);
    return firstTimeData ? JSON.parse(firstTimeData) : true;
  }

  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  static addTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions();
    transactions.unshift(transaction);
    this.setTransactions(transactions);
  }

  static addGroup(group: Group): void {
    const groups = this.getGroups();
    groups.push(group);
    this.setGroups(groups);
  }

  static addFriend(friend: Friend): void {
    const friends = this.getFriends();
    friends.push(friend);
    this.setFriends(friends);
  }
}