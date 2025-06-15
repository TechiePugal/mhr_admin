import React, { useState } from 'react';
import { ArrowLeft, Building, Mail, Eye, EyeOff, UserPlus, Calendar } from 'lucide-react';
import { createUser } from '../services/adminService';
import type { CreateUserData } from '../types';

interface CreateUserProps {
  onBack: () => void;
  onUserCreated: () => void;
}

export default function CreateUser({ onBack, onUserCreated }: CreateUserProps) {
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    password: '',
    companyName: '',
    contactPerson: '',
    phone: '',
    address: '',
    licenseDuration: 365 // Default 1 year
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person name is required';
    }

    if (formData.licenseDuration < 1) {
      newErrors.licenseDuration = 'License duration must be at least 1 day';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CreateUserData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      await createUser(formData);
      setSuccess(true);
      
      setTimeout(() => {
        onUserCreated();
        onBack();
      }, 2000);
    } catch (error: any) {
      if (error.message === 'Email already registered') {
        setErrors({ email: 'This email is already registered. Please use a different email.' });
      } else {
        setErrors({ general: 'Failed to create user. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const getLicenseExpiryDate = () => {
    const now = new Date();
    const expiryDate = new Date(now.getTime() + (formData.licenseDuration * 24 * 60 * 60 * 1000));
    return expiryDate.toLocaleDateString();
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">User Created Successfully!</h2>
            <p className="text-gray-600 mb-4">
              The new user account for {formData.companyName} has been created and is now active.
            </p>
            <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mr-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Create New User</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">User Information</h2>
            <p className="text-sm text-gray-600">Fill in the details to create a new user account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
                {errors.general}
              </div>
            )}

            {/* Company Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                <Building className="w-4 h-4" />
                <span>Company Information</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Enter company name"
                    className={`w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.companyName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.companyName && <p className="text-sm text-red-600">{errors.companyName}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contactPerson"
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    placeholder="Enter contact person name"
                    className={`w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.contactPerson ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.contactPerson && <p className="text-sm text-red-600">{errors.contactPerson}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Company Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter company address"
                    className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                <Mail className="w-4 h-4" />
                <span>Account Information</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                    className={`w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter password"
                      className={`w-full h-11 px-4 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                </div>
              </div>
            </div>

            {/* License Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                <Calendar className="w-4 h-4" />
                <span>License Information</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="licenseDuration" className="block text-sm font-medium text-gray-700">
                    License Duration (Days) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="licenseDuration"
                    type="number"
                    min="1"
                    value={formData.licenseDuration}
                    onChange={(e) => handleInputChange('licenseDuration', parseInt(e.target.value, 10))}
                    placeholder="Enter license duration in days"
                    className={`w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.licenseDuration ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.licenseDuration && <p className="text-sm text-red-600">{errors.licenseDuration}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">License Expiry Date</label>
                  <div className="w-full h-11 px-4 border border-gray-300 rounded-lg bg-gray-50 flex items-center text-gray-600">
                    {getLicenseExpiryDate()}
                  </div>
                </div>
              </div>

              {/* Quick Duration Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleInputChange('licenseDuration', 30)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  30 Days
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('licenseDuration', 90)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  90 Days
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('licenseDuration', 365)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  1 Year
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('licenseDuration', 730)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  2 Years
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                <span>{loading ? 'Creating...' : 'Create User'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}