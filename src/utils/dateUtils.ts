import { format, differenceInDays, isAfter, isBefore, addDays } from 'date-fns';

export const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'MMM dd, yyyy HH:mm');
};

export const getDaysRemaining = (expiryDate: Date): number => {
  const today = new Date();
  return differenceInDays(expiryDate, today);
};

export const isLicenseExpired = (expiryDate: Date): boolean => {
  return isBefore(expiryDate, new Date());
};

export const isLicenseExpiringSoon = (expiryDate: Date, warningDays: number = 7): boolean => {
  const today = new Date();
  const warningDate = addDays(today, warningDays);
  return isBefore(expiryDate, warningDate) && isAfter(expiryDate, today);
};

export const getLicenseStatus = (expiryDate: Date): 'active' | 'expiring' | 'expired' => {
  if (isLicenseExpired(expiryDate)) {
    return 'expired';
  } else if (isLicenseExpiringSoon(expiryDate)) {
    return 'expiring';
  } else {
    return 'active';
  }
};