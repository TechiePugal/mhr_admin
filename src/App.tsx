import React, { useState, useEffect } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import CreateUser from './components/CreateUser';
import ManageUsers from './components/ManageUsers';
import UserLogin from './components/UserLogin';
import UserDashboard from './components/UserDashboard';

type AppMode = 'admin' | 'user';
type AdminPage = 'dashboard' | 'create-user' | 'manage-users';

function App() {
  const [mode, setMode] = useState<AppMode>('admin');
  const [admin, setAdmin] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');

  // Check for existing sessions on component mount
  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin');
    const savedUser = localStorage.getItem('user');
    const savedMode = localStorage.getItem('appMode') as AppMode;
    
    if (savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
        setMode('admin');
      } catch (error) {
        localStorage.removeItem('admin');
      }
    } else if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setMode('user');
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  const handleAdminLogin = (adminData: any) => {
    setAdmin(adminData);
    setMode('admin');
    localStorage.setItem('admin', JSON.stringify(adminData));
    localStorage.setItem('appMode', 'admin');
  };

  const handleUserLogin = (userData: any) => {
    setUser(userData);
    setMode('user');
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('appMode', 'user');
  };

  const handleAdminLogout = () => {
    setAdmin(null);
    setCurrentPage('dashboard');
    localStorage.removeItem('admin');
    localStorage.removeItem('appMode');
  };

  const handleUserLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('appMode');
  };

  const handleNavigate = (page: AdminPage) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage('dashboard');
  };

  const handleUserCreated = () => {
    console.log('User created successfully');
  };

  const switchMode = () => {
    const newMode = mode === 'admin' ? 'user' : 'admin';
    setMode(newMode);
    localStorage.setItem('appMode', newMode);
  };

  // Mode selection screen
  if (!admin && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Access Portal</h1>
            <p className="text-purple-200">Choose your login type</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setMode('admin')}
              className="w-full p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 text-left"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Administrator</h3>
              <p className="text-purple-200 text-sm">Manage users, licenses, and system settings</p>
            </button>

            <button
              onClick={() => setMode('user')}
              className="w-full p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 text-left"
            >
              <h3 className="text-xl font-semibold text-white mb-2">User</h3>
              <p className="text-purple-200 text-sm">Access your company dashboard and information</p>
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-purple-300 text-sm">
              Select the appropriate portal for your role
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Admin flow
  if (mode === 'admin') {
    if (!admin) {
      return (
        <div>
          <AdminLogin onLogin={handleAdminLogin} />
          <div className="fixed bottom-4 right-4">
            <button
              onClick={switchMode}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Switch to User Login
            </button>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'create-user':
        return (
          <CreateUser 
            onBack={handleBack}
            onUserCreated={handleUserCreated}
          />
        );
      
      case 'manage-users':
        return (
          <ManageUsers 
            onBack={handleBack}
          />
        );
      
      case 'dashboard':
      default:
        return (
          <AdminDashboard 
            admin={admin}
            onLogout={handleAdminLogout}
            onNavigate={handleNavigate}
          />
        );
    }
  }

  // User flow
  if (mode === 'user') {
    if (!user) {
      return (
        <div>
          <UserLogin onLogin={handleUserLogin} />
          <div className="fixed bottom-4 right-4">
            <button
              onClick={switchMode}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              Switch to Admin Login
            </button>
          </div>
        </div>
      );
    }

    return (
      <UserDashboard 
        user={user}
        onLogout={handleUserLogout}
      />
    );
  }

  return null;
}

export default App;