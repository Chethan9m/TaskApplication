import { useState, useEffect } from 'react';
import { Task, TaskFormData } from '../types';
import { useAuth } from '../contexts/AuthContext';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete Project Documentation',
    description: 'Write comprehensive documentation for the new feature',
    dueDate: '2025-10-15',
    priority: 'high',
    status: 'pending',
    createdBy: '1',
    assignedTo: '2',
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-10-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Review Pull Requests',
    description: 'Review and approve pending pull requests',
    dueDate: '2025-10-10',
    priority: 'medium',
    status: 'pending',
    createdBy: '1',
    assignedTo: '1',
    createdAt: '2025-10-02T09:00:00Z',
    updatedAt: '2025-10-02T09:00:00Z',
  },
  {
    id: '3',
    title: 'Update Dependencies',
    description: 'Update all npm packages to latest versions',
    dueDate: '2025-10-20',
    priority: 'low',
    status: 'completed',
    createdBy: '2',
    assignedTo: '2',
    createdAt: '2025-10-03T14:00:00Z',
    updatedAt: '2025-10-05T16:00:00Z',
  },
];

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      setTasks(mockTasks);
      localStorage.setItem('tasks', JSON.stringify(mockTasks));
    }
    setIsLoading(false);
  }, []);

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const getFilteredTasks = () => {
    if (!user) return [];
    if (user.role === 'admin') return tasks;
    return tasks.filter(task => task.assignedTo === user.id || task.createdBy === user.id);
  };

  const createTask = (taskData: TaskFormData) => {
    if (!user) throw new Error('User not authenticated');

    const newTask: Task = {
      id: String(Date.now()),
      ...taskData,
      status: 'pending',
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveTasks([...tasks, newTask]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    );
    saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    saveTasks(updatedTasks);
  };

  const toggleTaskStatus = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      updateTask(id, {
        status: task.status === 'pending' ? 'completed' : 'pending',
      });
    }
  };

  return {
    tasks: getFilteredTasks(),
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  };
}
