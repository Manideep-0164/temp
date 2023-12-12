// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAj6Emf0FwaafBmd2iAiWGlWKbIQBVQwFo",
  authDomain: "todo-31b17.firebaseapp.com",
  projectId: "todo-31b17",
  storageBucket: "todo-31b17.appspot.com",
  messagingSenderId: "643550332455",
  appId: "1:643550332455:web:0d8666332a7c02de51b002",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };
