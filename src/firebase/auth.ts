import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, googleAuthProvider } from "./firebase";

// 로컬 로그인
const localLogin = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential;
};

// 로컬 회원가입
const localSignup = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential;
};

// 구글 소셜 로그인
const googleLogin = async () => {
  const userCredential = await signInWithPopup(auth, googleAuthProvider);
  return userCredential;
};

// 로그아웃
const logout = async () => {
  await signOut(auth);
};

// 로그인 상태 확인
const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { localLogin, localSignup, googleLogin, logout, onAuthStateChange };
