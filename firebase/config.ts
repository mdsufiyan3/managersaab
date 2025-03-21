import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC6TOFswJJa3W7Iri248zTz8xBFEyLvcZE",
  authDomain: "hasutara2.firebaseapp.com",
  projectId: "hasutara2",
  storageBucket: "hasutara2.firebasestorage.app",
  messagingSenderId: "768296807675",
  appId: "1:768296807675:web:dcb5f9dded67a89402145e",
  measurementId: "G-3LR9QFCKBY"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
