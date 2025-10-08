export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'completed';
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  createdBy: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  assignedTo: string;
}
