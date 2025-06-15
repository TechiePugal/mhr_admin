import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc,
  doc,
  Timestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import type { User } from "../types";

// User Authentication
export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error("User not found");
    }
    
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    
    // Check if user is active
    if (!userData.isActive) {
      throw new Error("Account is inactive. Please contact your administrator.");
    }
    
    // In production, use proper password hashing
    if (userData.password !== password) {
      throw new Error("Invalid credentials");
    }
    
    // Update last login
    await updateDoc(doc(db, "users", userDoc.id), {
      lastLogin: Timestamp.now()
    });
    
    return {
      id: userDoc.id,
      email: userData.email,
      password: userData.password,
      companyName: userData.companyName,
      contactPerson: userData.contactPerson,
      phone: userData.phone,
      address: userData.address,
      licenseExpiry: userData.licenseExpiry?.toDate() || new Date(),
      licenseDuration: userData.licenseDuration,
      isActive: userData.isActive,
      createdAt: userData.createdAt?.toDate() || new Date(),
      updatedAt: userData.updatedAt?.toDate() || new Date(),
      lastLogin: new Date() // Set to current time since we just updated it
    };
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

// Create demo user if none exists
export const createDemoUser = async () => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", "demo@company.com"));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Demo user doesn't exist, create it
      const { createUser } = await import('./adminService');
      
      await createUser({
        email: "demo@company.com",
        password: "demo123",
        companyName: "Demo Company Ltd.",
        contactPerson: "John Demo",
        phone: "+1 (555) 123-4567",
        address: "123 Demo Street, Demo City, DC 12345",
        licenseDuration: 365 // 1 year license
      });
    }
  } catch (error) {
    console.error("Error creating demo user:", error);
  }
};

// Initialize demo user on service load
createDemoUser();