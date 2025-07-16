import { uniqueNamesGenerator, Config, colors, animals } from 'unique-names-generator';
import { User } from '../types/schema';

const nameConfig: Config = {
  dictionaries: [colors, animals],
  separator: '',
  style: 'capital',
  length: 2,
};

export class UserService {
  static generateUsername(): string {
    return uniqueNamesGenerator(nameConfig);
  }

  static createNewUser(): User {
    const username = this.generateUsername();
    return {
      id: Date.now().toString(),
      name: username,
      email: `${username.toLowerCase()}@example.com`,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
    };
  }

  static updateUsername(user: User, newName: string): User {
    return {
      ...user,
      name: newName,
      email: `${newName.toLowerCase().replace(/\s+/g, '')}@example.com`
    };
  }
}