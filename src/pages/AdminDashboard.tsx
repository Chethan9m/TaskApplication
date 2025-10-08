import { useState } from 'react';
import { Users, Shield, User, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../contexts/AuthContext';
import { User as UserType } from '../types';

export function AdminDashboard() {
  const { users, updateUserRole, deleteUser } = useUsers();
  const { user: currentUser } = useAuth();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const handleRoleToggle = (userId: string, currentRole: 'admin' | 'user') => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    updateUserRole(userId, newRole);
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
    setDeleteConfirm(null);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage users and system settings</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                <span className="ml-auto px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {users.length} {users.length === 1 ? 'User' : 'Users'}
                </span>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {users.map((user: UserType) => (
                <div key={user.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        user.role === 'admin' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {user.role === 'admin' ? (
                          <Shield className="w-5 h-5 text-blue-600" />
                        ) : (
                          <User className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{user.fullName}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.role === 'admin'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role.toUpperCase()}
                          </span>
                          {currentUser?.id === user.id && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {expandedUser === user.id ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedUser === user.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 flex gap-3">
                      <button
                        onClick={() => handleRoleToggle(user.id, user.role)}
                        disabled={currentUser?.id === user.id}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          currentUser?.id === user.id
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : user.role === 'admin'
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                      </button>

                      {currentUser?.id !== user.id && (
                        <>
                          {deleteConfirm === user.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                              >
                                Confirm Delete
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(user.id)}
                              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete User
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You cannot modify your own account. Only admins can manage other users.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
