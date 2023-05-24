// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1o7CTfsfy18KbRnO5HSIL8nEeJlxarRQ",
  authDomain: "pascal-bea2e.firebaseapp.com",
  projectId: "pascal-bea2e",
  storageBucket: "pascal-bea2e.appspot.com",
  messagingSenderId: "604096447531",
  appId: "1:604096447531:web:b2b5f970500ab7b4d2966e",
  measurementId: "G-5V3F82VRMP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Export the Firestore instance
export const firestore = app.firestore();