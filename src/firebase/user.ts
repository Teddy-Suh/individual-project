import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

// 유저 문서 생성
const createUser = async (uid: string) => {
  const randomNickname = generateRandomNickname();
  await setDoc(doc(db, "users", uid), {
    nickname: randomNickname,
    role: "user",
  });
};

// 유저 문서 가져오기
const getUser = async (uid: string) => {
  const user = await getDoc(doc(db, "users", uid));
  return user.data();
};

// 닉네임 변경
const updateNickname = async (uid: string, nickname: string) => {
  // 닉네임 중복 검사
  const q = query(collection(db, "users"), where("nickname", "==", nickname));
  const querySnapshot = await getDocs(q);
  // 닉네임 중복 아니면 업데이트
  if (querySnapshot.empty) {
    await updateDoc(doc(db, "users", uid), {
      nickname,
    });
  }
  return !querySnapshot.empty;
};

// 역할 변경하기
const updateRole = async (uid: string, role: string) => {
  await updateDoc(doc(db, "users", uid), {
    role: role,
  });
};

// 회원가입 시 랜덤 닉네임 주기
const generateRandomNickname = () => {
  const nickList = ["Nick", "nIck", "niCk", "nicK", "Nick", "nick"];
  const nameList = ["Name", "nAme", "naMe", "namE", "NAME", "name"];

  const nick = nickList[Math.floor(Math.random() * nickList.length)];
  const name = nameList[Math.floor(Math.random() * nameList.length)];

  const number = Math.floor(Math.random() * 90) + 10;

  return `${nick}${name}${number}`;
};

export { createUser, getUser, updateNickname, updateRole };
