import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase 설정
const firebaseConfig = {
  apiKey: 'AIzaSyBwJCCIxUU_c6OExDhbrjJwRfRzzHzmLrU',
  authDomain: 'individual-project-37cd0.firebaseapp.com',
  projectId: 'individual-project-37cd0',
  storageBucket: 'individual-project-37cd0.appspot.com',
  messagingSenderId: '236117415858',
  appId: '1:236117415858:web:2ab74e71be3da59f9236ab',
  measurementId: 'G-SKKX18YE2Z',
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
