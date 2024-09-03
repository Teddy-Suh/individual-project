import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { getUser } from "./user";

// posts 컬렉션 참조
const postsCollectionRef = collection(db, "posts");

// 게시글 작성
const createPost = async (uid: string, title: string, content: string) => {
  const docRef = await addDoc(postsCollectionRef, {
    uid,
    title,
    content,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

// 게시글 가져오기
const getPost = async (postId: string) => {
  const postDoc = await getDoc(doc(db, "posts", postId));
  return { id: postDoc.id, ...postDoc.data() };
};

// 게시글 수정
const updatePost = async (postId: string, title: string, content: string) => {
  await updateDoc(doc(db, "posts", postId), {
    title,
    content,
  });
};

// 게시글 삭제
const deletePost = async (postId: string) => {
  await deleteDoc(doc(db, "posts", postId));
};

// 게시글 목록 가져오기 (게시판)
const getPosts = async () => {
  const querySnapshot = await getDocs(postsCollectionRef);
  const posts = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const postData = doc.data();
      const userData = await getUser(postData.uid);
      return {
        postId: doc.id,
        title: postData.title,
        createdAt: postData.createdAt.toDate(),
        nickname: userData?.nickname || "알 수 없는 계정",
      };
    })
  );
  return posts;
};

export { createPost, getPost, updatePost, deletePost, getPosts };
