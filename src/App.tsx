import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';

type View = 'login' | 'register' | 'dashboard' | 'admin';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [view, setView] = useState<View>('login');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    if (view === 'register') {
      return <Register onSwitchToLogin={() => setView('login')} />;
    }
    return <Login onSwitchToRegister={() => setView('register')} />;
  }

  if (view === 'admin' && user.role === 'admin') {
    return <AdminDashboard />;
  }

  return <Dashboard onNavigateToAdmin={() => setView('admin')} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
