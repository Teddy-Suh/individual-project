import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { getUser } from "./user";

interface PostListItem {
  postId: string;
  title: string;
  createdAt: Date;
  nickname: string;
}

type LastVisible = QueryDocumentSnapshot<DocumentData> | null;

interface PostList {
  postList: PostListItem[];
  lastDoc: LastVisible;
}

interface GetPostList {
  (lastVisible: LastVisible): Promise<PostList>;
}

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

// 게시글 목록 가져오기 (페이지네이션)
// lastVisible = null 자료혈 잘 넣기
const getPostList: GetPostList = async (lastVisible) => {
  const q = lastVisible
    ? // 다음 페이지 가져오기 (lastVisible 있음)
      query(
        postsCollectionRef,
        orderBy("createdAt", "desc"),
        startAfter(lastVisible), // lastVisible 다음 문저부터 가져옴
        limit(20)
      )
    : // 처음 페이지 가져오기 (lastVisible 없음)
      query(postsCollectionRef, orderBy("createdAt", "desc"), limit(20));

  const querySnapshot = await getDocs(q);
  const postList = await Promise.all(
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

  const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

  return { postList, lastDoc };
};

export type { PostListItem, LastVisible };
export { createPost, getPost, updatePost, deletePost, getPostList };
