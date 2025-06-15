import React, { useState, useEffect } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import CreateUser from './components/CreateUser';
import ManageUsers from './components/ManageUsers';

function App() {
  const [admin, setAdmin] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'create-user' | 'manage-users'>('dashboard');

  // Check for existing admin session on component mount
  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin');
    if (savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch (error) {
        localStorage.removeItem('admin');
      }
    }
  }, []);

  const handleLogin = (adminData: any) => {
    setAdmin(adminData);
    localStorage.setItem('admin', JSON.stringify(adminData));
  };

  const handleLogout = () => {
    setAdmin(null);
    setCurrentPage('dashboard');
    localStorage.removeItem('admin');
  };

  const handleNavigate = (page: 'dashboard' | 'create-user' | 'manage-users') => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage('dashboard');
  };

  const handleUserCreated = () => {
    // Could show a success notification here
    console.log('User created successfully');
  };

  // If no admin is logged in, show login screen
  if (!admin) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Render the appropriate page based on current page state
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
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
  }
}

export default App;