import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCU4M5qsCYXPIuBmKiHH3toxD3yOn-J4aQ",
  authDomain: "zephyrn-a214a.firebaseapp.com",
  projectId: "zephyrn-a214a",
  storageBucket: "zephyrn-a214a.firebasestorage.app",
  messagingSenderId: "694088777312",
  appId: "1:694088777312:web:bc662713eb2c140d088d05",
  measurementId: "G-WESTC87HE5"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics and Auth
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, analytics };

// Database types for TypeScript
export interface User {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    avatar_url?: string
  }
  created_at: string
}

export interface EncryptionLog {
  id: string
  user_id: string
  file_name: string
  operation: "encrypt" | "decrypt"
  file_size: number
  created_at: string
}
