// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { siteConfig } from "@/config/site";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = siteConfig.firebase;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
