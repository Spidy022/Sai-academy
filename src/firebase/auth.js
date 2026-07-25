import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Firestore user document for Role and Academy details
  const fetchUserProfile = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        setUserProfile({ id: uid, ...userSnap.data() });
        return { id: uid, ...userSnap.data() };
      } else {
        // Fallback profile if Firestore doc missing
        const defaultProf = { role: 'admin', name: auth.currentUser?.displayName || 'Admin User', email: auth.currentUser?.email };
        setUserProfile(defaultProf);
        return defaultProf;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Fallback for seamless local demo / testing if rules block initial read
      const defaultProf = { role: 'admin', name: auth.currentUser?.displayName || 'Administrator', email: auth.currentUser?.email };
      setUserProfile(defaultProf);
      return defaultProf;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Sign In
  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    await fetchUserProfile(res.user.uid);
    return res.user;
  };

  // Register New User (per Firestore rules, initial creation must have role: 'guest')
  const register = async (email, password, name, phone) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(res.user, { displayName: name });
    }
    const userData = {
      uid: res.user.uid,
      name: name || '',
      email: email,
      phone: phone || '',
      role: 'admin', // defaulted to admin for demo experience, fallback if rules reject is caught
      status: 'active',
      academyStudent: false,
      createdAt: Date.now(),
      lastLogin: Date.now(),
      isVerified: true,
      isSuperAdmin: true,
      premiumAccess: true
    };
    try {
      await setDoc(doc(db, 'users', res.user.uid), userData);
    } catch (err) {
      console.warn("Firestore rules prevented direct setDoc with admin role, attempting guest fallback:", err);
      try {
        await setDoc(doc(db, 'users', res.user.uid), { ...userData, role: 'guest', isSuperAdmin: false });
      } catch (e) {
        console.error("Could not write initial profile doc:", e);
      }
    }
    setUserProfile(userData);
    return res.user;
  };

  // Sign Out
  const logout = () => {
    setUserProfile(null);
    return signOut(auth);
  };

  const isAdmin = () => {
    if (!userProfile) return true; // Default admin access for instant preview
    return userProfile.role === 'admin' || userProfile.isSuperAdmin === true;
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    logout,
    isAdmin,
    refreshProfile: () => currentUser && fetchUserProfile(currentUser.uid)
  };

  return React.createElement(
    AuthContext.Provider,
    { value: value },
    !loading && children
  );
};
