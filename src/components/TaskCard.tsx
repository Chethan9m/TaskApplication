import { Calendar, User, CreditCard as Edit2, Trash2, CheckCircle, Circle } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onViewDetails: (task: Task) => void;
  userName: string;
}

const priorityColors = {
  high: 'border-l-red-500 bg-red-50',
  medium: 'border-l-yellow-500 bg-yellow-50',
  low: 'border-l-green-500 bg-green-50',
};

const priorityBadges = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

export function TaskCard({ task, onEdit, onDelete, onToggleStatus, onViewDetails, userName }: TaskCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status === 'pending';

  return (
    <div
      className={`bg-white border-l-4 ${priorityColors[task.priority]} rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer`}
      onClick={() => onViewDetails(task)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityBadges[task.priority]}`}>
              {task.priority.toUpperCase()}
            </span>
          </div>
          {task.description && (
            <p className="text-gray-600 text-sm line-clamp-2">{task.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            {formatDate(task.dueDate)}
            {isOverdue && ' (Overdue)'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span>{userName}</span>
        </div>
      </div>

      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => onToggleStatus(task.id)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            task.status === 'completed'
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {task.status === 'completed' ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Completed
            </>
          ) : (
            <>
              <Circle className="w-4 h-4" />
              Pending
            </>
          )}
        </button>

        <button
          onClick={() => onEdit(task)}
          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit task"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
