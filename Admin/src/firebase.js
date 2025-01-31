// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore"; // Import doc and getDoc
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCtsTsPHg9T98_YEuVYmg-eatCI5wabnBk",
  authDomain: "bank-app-74a38.firebaseapp.com",
  projectId: "bank-app-74a38",
  storageBucket: "bank-app-74a38.firebasestorage.app",
  messagingSenderId: "1055027567056",
  appId: "1:1055027567056:web:8dc1570807e18d9e65c1d5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export the necessary Firestore functions
export { db, auth, doc, getDoc, collection, query, where, getDocs };
