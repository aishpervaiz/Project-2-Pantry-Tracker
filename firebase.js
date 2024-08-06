// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6MnFbNxmlwPWgYsPCI-JQrvKdVqc0Ttg",
  authDomain: "pantry-b60fc.firebaseapp.com",
  projectId: "pantry-b60fc",
  storageBucket: "pantry-b60fc.appspot.com",
  messagingSenderId: "499639123653",
  appId: "1:499639123653:web:6cf2642313a2ba0c11baac",
  measurementId: "G-9QJWHV0HZ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}