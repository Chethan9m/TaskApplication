import { useState } from 'react';
import { Plus, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { TaskDetailsModal } from '../components/TaskDetailsModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { useTasks } from '../hooks/useTasks';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../contexts/AuthContext';
import { Task, TaskFormData } from '../types';

interface DashboardProps {
  onNavigateToAdmin: () => void;
}

export function Dashboard({ onNavigateToAdmin }: DashboardProps) {
  const { user, logout } = useAuth();
  const { tasks, createTask, updateTask, deleteTask, toggleTaskStatus } = useTasks();
  const { users } = useUsers();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const handleCreateTask = (data: TaskFormData) => {
    createTask(data);
    setShowTaskForm(false);
  };

  const handleEditTask = (data: TaskFormData) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
      setEditingTask(null);
    }
  };

  const handleDeleteTask = () => {
    if (deletingTaskId) {
      deleteTask(deletingTaskId);
      setDeletingTaskId(null);
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.fullName || 'Unknown User';
  };

  const deletingTask = tasks.find(t => t.id === deletingTaskId);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Task Dashboard</h1>
                  <p className="text-gray-600">Welcome back, {user?.fullName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {user?.role === 'admin' && (
                  <button
                    onClick={onNavigateToAdmin}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                  >
                    <Shield className="w-5 h-5" />
                    Admin Panel
                  </button>
                )}
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Create New Task
            </button>
          </div>

          <TaskList
            tasks={tasks}
            users={users}
            onEdit={task => setEditingTask(task)}
            onDelete={id => setDeletingTaskId(id)}
            onToggleStatus={toggleTaskStatus}
            onViewDetails={task => setViewingTask(task)}
          />
        </div>

        {showTaskForm && (
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowTaskForm(false)}
            users={users}
          />
        )}

        {editingTask && (
          <TaskForm
            onSubmit={handleEditTask}
            onCancel={() => setEditingTask(null)}
            users={users}
            initialData={{
              title: editingTask.title,
              description: editingTask.description,
              dueDate: editingTask.dueDate,
              priority: editingTask.priority,
              assignedTo: editingTask.assignedTo,
            }}
            isEdit
          />
        )}

        {viewingTask && (
          <TaskDetailsModal
            task={viewingTask}
            onClose={() => setViewingTask(null)}
            creatorName={getUserName(viewingTask.createdBy)}
            assigneeName={getUserName(viewingTask.assignedTo)}
          />
        )}

        {deletingTask && (
          <DeleteConfirmModal
            taskTitle={deletingTask.title}
            onConfirm={handleDeleteTask}
            onCancel={() => setDeletingTaskId(null)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
