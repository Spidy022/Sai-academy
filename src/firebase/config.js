import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration matching existing PoliceFeeManager2 / Sai Police Academy app
const firebaseConfig = {
  apiKey: "AIzaSyD_Jekdct7ZENYRilg6d_pGTCn1bE_5x4U",
  authDomain: "sai-police-academy-63356.firebaseapp.com",
  projectId: "sai-police-academy-63356",
  storageBucket: "sai-police-academy-63356.firebasestorage.app",
  messagingSenderId: "715156746314",
  appId: "1:715156746314:web:158bb38f877a3d92f72c3d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
