export interface User {
  id: string;
  email: string;
  password: string;
  companyName: string;
  contactPerson: string;
  phone?: string;
  address?: string;
  licenseExpiry: Date;
  licenseDuration: number; // in days
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface Admin {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  companyName: string;
  contactPerson: string;
  phone?: string;
  address?: string;
  licenseDuration: number;
}

export interface UpdateUserData {
  email?: string;
  companyName?: string;
  contactPerson?: string;
  phone?: string;
  address?: string;
  licenseDuration?: number;
  isActive?: boolean;
}

export interface LicenseInfo {
  userId: string;
  companyName: string;
  licenseExpiry: Date;
  licenseDuration: number;
  isActive: boolean;
  daysRemaining: number;
  status: 'active' | 'expiring' | 'expired';
}