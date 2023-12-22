// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator } from "firebase/firestore";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
} from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";
import {
  browserLocalPersistence,
  getAuth,
  initializeAuth,
} from "firebase/auth";
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
// const db = getFirestore(app);
const auth = getAuth(app);

const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager(),
  }),
});

// uncomment below code to use app in emulator/test mode.
// connectFirestoreEmulator(db, "127.0.0.1", 8080);

const messaging = getMessaging(app);

export { db, auth, app, messaging, getToken };
