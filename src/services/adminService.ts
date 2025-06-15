import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import type { User, CreateUserData, UpdateUserData, Admin } from "../types";

// Admin Authentication
export const loginAdmin = async (email: string, password: string): Promise<Admin | null> => {
  try {
    const adminsRef = collection(db, "admins");
    const q = query(adminsRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error("Admin not found");
    }
    
    const adminDoc = querySnapshot.docs[0];
    const adminData = adminDoc.data();
    
    // In production, use proper password hashing
    if (adminData.password !== password) {
      throw new Error("Invalid credentials");
    }
    
    return {
      id: adminDoc.id,
      email: adminData.email,
      password: adminData.password,
      name: adminData.name,
      createdAt: adminData.createdAt?.toDate() || new Date()
    };
  } catch (error) {
    console.error("Error logging in admin:", error);
    throw error;
  }
};

// Create default admin if none exists
export const createDefaultAdmin = async () => {
  try {
    const adminsRef = collection(db, "admins");
    const querySnapshot = await getDocs(adminsRef);
    
    if (querySnapshot.empty) {
      await addDoc(adminsRef, {
        email: "kannan300866@gmail.com",
        password: "kannan@2025", // In production, hash this
        name: "System Administrator",
        createdAt: Timestamp.now()
      });
    }
  } catch (error) {
    console.error("Error creating default admin:", error);
  }
};

// User Management Functions
export const createUser = async (userData: CreateUserData): Promise<string> => {
  try {
    // Check if email already exists
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", userData.email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error("Email already registered");
    }
    
    const now = new Date();
    const licenseExpiry = new Date(now.getTime() + (userData.licenseDuration * 24 * 60 * 60 * 1000));
    
    const docRef = await addDoc(usersRef, {
      email: userData.email,
      password: userData.password, // In production, hash this
      companyName: userData.companyName,
      contactPerson: userData.contactPerson,
      phone: userData.phone || "",
      address: userData.address || "",
      licenseExpiry: Timestamp.fromDate(licenseExpiry),
      licenseDuration: userData.licenseDuration,
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email,
        password: data.password,
        companyName: data.companyName,
        contactPerson: data.contactPerson,
        phone: data.phone,
        address: data.address,
        licenseExpiry: data.licenseExpiry?.toDate() || new Date(),
        licenseDuration: data.licenseDuration,
        isActive: data.isActive,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        lastLogin: data.lastLogin?.toDate()
      };
    });
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (!userDoc.exists()) {
      return null;
    }
    
    const data = userDoc.data();
    return {
      id: userDoc.id,
      email: data.email,
      password: data.password,
      companyName: data.companyName,
      contactPerson: data.contactPerson,
      phone: data.phone,
      address: data.address,
      licenseExpiry: data.licenseExpiry?.toDate() || new Date(),
      licenseDuration: data.licenseDuration,
      isActive: data.isActive,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      lastLogin: data.lastLogin?.toDate()
    };
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const updateUser = async (userId: string, updateData: UpdateUserData): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    const updates: any = {
      ...updateData,
      updatedAt: Timestamp.now()
    };
    
    // If license duration is updated, recalculate expiry
    if (updateData.licenseDuration) {
      const now = new Date();
      const licenseExpiry = new Date(now.getTime() + (updateData.licenseDuration * 24 * 60 * 60 * 1000));
      updates.licenseExpiry = Timestamp.fromDate(licenseExpiry);
    }
    
    await updateDoc(userRef, updates);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "users", userId));
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const extendUserLicense = async (userId: string, additionalDays: number): Promise<void> => {
  try {
    const user = await getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const newExpiry = new Date(user.licenseExpiry.getTime() + (additionalDays * 24 * 60 * 60 * 1000));
    const newDuration = user.licenseDuration + additionalDays;
    
    await updateUser(userId, {
      licenseDuration: newDuration
    });
  } catch (error) {
    console.error("Error extending license:", error);
    throw error;
  }
};

// Initialize admin on service load
createDefaultAdmin();