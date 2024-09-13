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
  (
    lastVisible: LastVisible,
    keyword?: string,
    movieTagId?: string
  ): Promise<PostList>;
}

interface GetFilteredPostList {
  (keyword?: string, movieTagId?: string): Promise<{
    postList: PostListItem[];
  }>;
}

// posts 컬렉션 참조
const postsCollectionRef = collection(db, "posts");

// 게시글 검색을 위해 kwerod필드 만듬

// tiptap으로 작성한 content에 태그들 제거하는 함수
const removeHTMLTags = (content: string) => {
  const div = document.createElement("div");
  div.innerHTML = content;
  return div.textContent || "";
};

// 게시글 작성
const createPost = async (uid: string, title: string, content: string) => {
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
const getPost = async (postId: string) => {
  const postDoc = await getDoc(doc(db, "posts", postId));
  const postData = postDoc.data();
  const userData = await getUser(postData.uid);
  return {
    postId,
    ...postData,
    createdAt: postData.createdAt.toDate(),
    nickname: userData.nickname,
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
const getPostList: GetPostList = async (lastVisible) => {
  let q = query(postsCollectionRef, orderBy("createdAt", "desc"), limit(12));

  // 페이지네이션 처리
  if (lastVisible) {
    q = query(q, startAfter(lastVisible));
  }

  const querySnapshot = await getDocs(q);

  const postList = await Promise.all(
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

  return { postList, lastDoc };
};

const getFilteredPostList: GetFilteredPostList = async (
  keyword,
  movieTagId
) => {
  let q = query(postsCollectionRef, orderBy("createdAt", "desc"));

  // movieTagId 조건 추가
  if (movieTagId && movieTagId.trim() !== "") {
    q = query(q, where("selectedMovieId", "==", movieTagId));
  }

  // keyword 조건 추가
  if (keyword && keyword.trim() !== "") {
    q = query(q, where("keywords", "array-contains", keyword.toLowerCase()));
  }

  const querySnapshot = await getDocs(q);

  const postList = await Promise.all(
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

  return { postList };
};

export type { PostListItem, LastVisible };

export {
  createPost,
  getPost,
  updatePost,
  deletePost,
  getPostList,
  getFilteredPostList,
};
