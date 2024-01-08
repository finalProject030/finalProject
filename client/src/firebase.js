// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-3cab3.firebaseapp.com",
  projectId: "mern-estate-3cab3",
  storageBucket: "mern-estate-3cab3.appspot.com",
  messagingSenderId: "343294743659",
  appId: "1:343294743659:web:65cf5ff524a1741ddd4d2e",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
