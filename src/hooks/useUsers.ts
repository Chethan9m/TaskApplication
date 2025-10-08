import { useState, useEffect } from 'react';
import { User } from '../types';

const initialUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    fullName: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'user@example.com',
    fullName: 'Regular User',
    role: 'user',
  },
];

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(initialUsers);
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }
    setIsLoading(false);
  }, []);

  const saveUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const updateUserRole = (userId: string, newRole: 'admin' | 'user') => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    );
    saveUsers(updatedUsers);
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    saveUsers(updatedUsers);
  };

  return {
    users,
    isLoading,
    updateUserRole,
    deleteUser,
  };
}
