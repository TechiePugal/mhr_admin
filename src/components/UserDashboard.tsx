import React, { useState, useEffect } from 'react';
import { 
  User, 
  Building, 
  Calendar, 
  LogOut, 
  CheckCircle,
  AlertCircle,
  Clock,
  Settings
} from 'lucide-react';
import { getDaysRemaining, getLicenseStatus, formatDate } from '../utils/dateUtils';
import type { User as UserType } from '../types';

interface UserDashboardProps {
  user: UserType;
  onLogout: () => void;
}

export default function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const licenseStatus = getLicenseStatus(user.licenseExpiry);
  const daysRemaining = getDaysRemaining(user.licenseExpiry);

  const getStatusColor = () => {
    switch (licenseStatus) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'expiring':
        return 'text-yellow-600 bg-yellow-100';
      case 'expired':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = () => {
    switch (licenseStatus) {
      case 'active':
        return <CheckCircle className="w-5 h-5" />;
      case 'expiring':
        return <Clock className="w-5 h-5" />;
      case 'expired':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getStatusMessage = () => {
    switch (licenseStatus) {
      case 'active':
        return `Your license is active with ${daysRemaining} days remaining.`;
      case 'expiring':
        return `Your license expires in ${daysRemaining} days. Please contact your administrator.`;
      case 'expired':
        return 'Your license has expired. Please contact your administrator to renew.';
      default:
        return 'License status unknown.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">User Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.contactPerson}</span>
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
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg text-white p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, {user.contactPerson}!</h2>
              <p className="text-blue-100">
                {formatDate(currentTime)} • {currentTime.toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Company</p>
              <p className="text-xl font-semibold">{user.companyName}</p>
            </div>
          </div>
        </div>

        {/* License Status Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">License Status</h3>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="capitalize">{licenseStatus}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-600">{getStatusMessage()}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">License Expiry</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{formatDate(user.licenseExpiry)}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Days Remaining</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {daysRemaining > 0 ? daysRemaining : 0} days
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Account Status</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {user.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Building className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Company Name</label>
                <p className="text-gray-900">{user.companyName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Contact Person</label>
                <p className="text-gray-900">{user.contactPerson}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                <p className="text-gray-900">{user.phone || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                <p className="text-gray-900">{user.address || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Account Created</label>
                <p className="text-gray-900">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* License Expiry Warning */}
        {licenseStatus === 'expiring' && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-yellow-600" />
              <div>
                <h4 className="text-lg font-semibold text-yellow-800">License Expiring Soon</h4>
                <p className="text-yellow-700 mt-1">
                  Your license will expire in {daysRemaining} days. Please contact your system administrator 
                  to renew your license and avoid service interruption.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* License Expired Warning */}
        {licenseStatus === 'expired' && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h4 className="text-lg font-semibold text-red-800">License Expired</h4>
                <p className="text-red-700 mt-1">
                  Your license has expired. Please contact your system administrator immediately 
                  to renew your license and restore access to all features.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}