import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB-Zp6wJox8dCuPjl9ELtLRA9hmWVbGgso",
  authDomain: "scheduler3-be34d.firebaseapp.com",
  projectId: "scheduler3-be34d",
  storageBucket: "scheduler3-be34d.firebasestorage.app",
  messagingSenderId: "295993424459",
  appId: "1:295993424459:web:644b6747b10ba934db6bce",
  measurementId: "G-D17GW8G167"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
