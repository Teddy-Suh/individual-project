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
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { getUser } from "./user";
import { getLatestSelectedMovie } from "./movie";

interface DbPost {
  content: string;
  createdAt: Timestamp;
  keywords: string[];
  selectedAt: { month: number; week: number };
  selectedMovieId: string;
  selectedMovieTitle: string;
  title: string;
  uid: string;
}

interface ReturnPost extends Omit<DbPost, "createdAt"> {
  postId: string;
  nickname: string;
  createdAt: Date;
}

// 게시글 목록에서 보여줄 PostHeader
interface PostHeader {
  postId: string;
  selectedMovieId: string;
  selectedAt: { month: number; week: number };
  selectedMovieTitle: string;
  title: string;
  createdAt: Date;
  nickname: string;
}

type LastVisible = QueryDocumentSnapshot<DocumentData> | null;

interface PostHeaders {
  postHeaders: PostHeader[];
  lastDoc: LastVisible;
}

interface GetPostHeaders {
  (lastVisible: LastVisible): Promise<PostHeaders>;
}

interface GetFilteredPostHeaders {
  (keyword?: string, movieTagId?: string): Promise<{
    postHeaders: PostHeader[];
  }>;
}

// posts 컬렉션 참조
const postsCollectionRef = collection(db, "posts");

// tiptap으로 작성한 content에 태그들 제거하는 함수
// 게시글 검색을 위해 만든 kwerods필드에 넣기 전에 태그 제거
const removeHTMLTags = (content: string) => {
  const div = document.createElement("div");
  div.innerHTML = content;
  return div.textContent || "";
};

// 게시글 작성
const createPost = async (
  uid: string,
  title: string,
  content: string
): Promise<string> => {
  const cleanContent = removeHTMLTags(content);
  const keywords = [
    ...new Set([
      ...title.toLowerCase().split(" "),
      ...cleanContent.toLowerCase().split(" "),
    ]),
  ];

  const selectedMovie = await getLatestSelectedMovie();
  const docRef = await addDoc(postsCollectionRef, {
    uid,
    title,
    content,
    createdAt: Timestamp.now(),
    selectedMovieId: selectedMovie.selectedMovieId,
    selectedAt: selectedMovie.selectedAt,
    selectedMovieTitle: selectedMovie.title,
    keywords,
  });
  return docRef.id;
};

// 게시글 가져오기
const getPost = async (postId: string): Promise<ReturnPost> => {
  const postDoc = await getDoc(doc(db, "posts", postId));

  if (!postDoc.exists()) {
    throw new Error("게시글을 찾을 수 없습니다.");
  }

  const postData = postDoc.data() as DbPost;
  const userData = await getUser(postData.uid);
  return {
    postId,
    ...postData,
    createdAt: postData.createdAt.toDate(),
    nickname: userData?.nickname || "알 수 없는 사용자",
  };
};

// 게시글 수정
const updatePost = async (postId: string, title: string, content: string) => {
  const cleanContent = removeHTMLTags(content);

  const keywords = [
    ...new Set([
      ...title.toLowerCase().split(" "),
      ...cleanContent.toLowerCase().split(" "),
    ]),
  ];

  await updateDoc(doc(db, "posts", postId), {
    title,
    content,
    keywords,
  });
};

// 게시글 삭제
const deletePost = async (postId: string) => {
  await deleteDoc(doc(db, "posts", postId));
};

// 게시글 목록 가져오기 (페이지네이션)
const getPostHeaders: GetPostHeaders = async (lastVisible) => {
  let q = query(postsCollectionRef, orderBy("createdAt", "desc"), limit(12));

  // 페이지네이션 처리
  if (lastVisible) {
    q = query(q, startAfter(lastVisible));
  }

  const querySnapshot = await getDocs(q);

  const postHeaders = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const postData = doc.data();
      const userData = await getUser(postData.uid);
      return {
        postId: doc.id,
        selectedMovieId: postData.selectedMovieId,
        selectedAt: postData.selectedAt,
        selectedMovieTitle: postData.selectedMovieTitle,
        title: postData.title,
        createdAt: postData.createdAt.toDate(),
        nickname: userData?.nickname || "알 수 없는 계정",
      };
    })
  );

  const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

  return { postHeaders, lastDoc };
};

const getFilteredPostHeaders: GetFilteredPostHeaders = async (
  keyword,
  movieTagId
) => {
  let q = query(postsCollectionRef, orderBy("createdAt", "desc"));

  if (movieTagId !== "") {
    q = query(q, where("selectedMovieId", "==", movieTagId));
  }

  if (keyword && keyword.trim() !== "") {
    q = query(q, where("keywords", "array-contains", keyword.toLowerCase()));
  }

  const querySnapshot = await getDocs(q);

  const postHeaders = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const postData = doc.data();
      const userData = await getUser(postData.uid);
      return {
        postId: doc.id,
        selectedMovieId: postData.selectedMovieId,
        selectedAt: postData.selectedAt,
        selectedMovieTitle: postData.selectedMovieTitle,
        title: postData.title,
        createdAt: postData.createdAt.toDate(),
        nickname: userData?.nickname || "알 수 없는 계정",
      };
    })
  );

  return { postHeaders };
};

export type {
  DbPost,
  ReturnPost,
  PostHeader,
  PostHeaders,
  LastVisible,
  GetPostHeaders,
  GetFilteredPostHeaders,
};

export {
  createPost,
  getPost,
  updatePost,
  deletePost,
  getPostHeaders,
  getFilteredPostHeaders,
};
