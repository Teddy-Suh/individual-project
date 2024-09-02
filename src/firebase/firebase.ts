import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTaNaS65uCJp6_6cLhb_gxONOjVmimiIk",
  authDomain: "moveek-5b228.firebaseapp.com",
  projectId: "moveek-5b228",
  storageBucket: "moveek-5b228.appspot.com",
  messagingSenderId: "819038203316",
  appId: "1:819038203316:web:887c22dfc9d1a8c02196e1",
  measurementId: "G-GNSZDCC5B8",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleAuthProvider, db };
