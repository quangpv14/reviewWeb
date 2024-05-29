// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "webreview-e7b38.firebaseapp.com",
  projectId: "webreview-e7b38",
  storageBucket: "webreview-e7b38.appspot.com",
  messagingSenderId: "975581743369",
  appId: "1:975581743369:web:f84aebfb57415b54412bd8",
  //measurementId: "G-EYT2QBBT74"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
