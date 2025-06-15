import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Settings, 
  LogOut, 
  Calendar, 
  AlertCircle, 
  CheckCircle,
  TrendingUp,
  Clock
} from 'lucide-react';
import { getAllUsers } from '../services/adminService';
import { getDaysRemaining, getLicenseStatus, formatDate } from '../utils/dateUtils';
import type { User, LicenseInfo } from '../types';

interface AdminDashboardProps {
  admin: any;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export default function AdminDashboard({ admin, onLogout, onNavigate }: AdminDashboardProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    expiredUsers: 0,
    expiringUsers: 0
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
      
      // Calculate stats
      const totalUsers = usersData.length;
      const activeUsers = usersData.filter(user => 
        user.isActive && getLicenseStatus(user.licenseExpiry) === 'active'
      ).length;
      const expiredUsers = usersData.filter(user => 
        getLicenseStatus(user.licenseExpiry) === 'expired'
      ).length;
      const expiringUsers = usersData.filter(user => 
        getLicenseStatus(user.licenseExpiry) === 'expiring'
      ).length;
      
      setStats({
        totalUsers,
        activeUsers,
        expiredUsers,
        expiringUsers
      });
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecentUsers = () => {
    return users
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const getExpiringUsers = () => {
    return users
      .filter(user => getLicenseStatus(user.licenseExpiry) === 'expiring')
      .sort((a, b) => new Date(a.licenseExpiry).getTime() - new Date(b.licenseExpiry).getTime())
      .slice(0, 5);
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {trend && (
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {admin.name}</span>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="text-blue-600"
            trend="+12% from last month"
          />
          <StatCard
            title="Active Licenses"
            value={stats.activeUsers}
            icon={CheckCircle}
            color="text-green-600"
            trend="+5% from last month"
          />
          <StatCard
            title="Expiring Soon"
            value={stats.expiringUsers}
            icon={Clock}
            color="text-yellow-600"
            trend="Within 7 days"
          />
          <StatCard
            title="Expired"
            value={stats.expiredUsers}
            icon={AlertCircle}
            color="text-red-600"
            trend="Requires attention"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => onNavigate('create-user')}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <UserPlus className="w-5 h-5" />
            <span>Create New User</span>
          </button>
          
          <button
            onClick={() => onNavigate('manage-users')}
            className="flex items-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Users className="w-5 h-5" />
            <span>Manage Users</span>
          </button>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
            </div>
            <div className="p-6">
              {getRecentUsers().length === 0 ? (
                <p className="text-gray-500 text-center py-8">No users created yet</p>
              ) : (
                <div className="space-y-4">
                  {getRecentUsers().map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{user.companyName}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{formatDate(user.createdAt)}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Expiring Licenses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Expiring Licenses</h2>
            </div>
            <div className="p-6">
              {getExpiringUsers().length === 0 ? (
                <p className="text-gray-500 text-center py-8">No licenses expiring soon</p>
              ) : (
                <div className="space-y-4">
                  {getExpiringUsers().map((user) => {
                    const daysRemaining = getDaysRemaining(user.licenseExpiry);
                    return (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div>
                          <p className="font-medium text-gray-900">{user.companyName}</p>
                          <p className="text-sm text-gray-600">{user.contactPerson}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-yellow-800">
                            {daysRemaining} days left
                          </p>
                          <p className="text-xs text-gray-500">
                            Expires {formatDate(user.licenseExpiry)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}