import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { getUser } from "./user";

const commentsCollectionRef = collection(db, "comments");

// 댓글 작성
const createComment = async (postId: string, uid: string, content: string) => {
  await addDoc(commentsCollectionRef, {
    postId,
    uid,
    content,
    createdAt: Timestamp.now(),
  });
};

// 댓글 수정
const updateComment = async (commentId: string, content: string) => {
  await updateDoc(doc(db, "comments", commentId), {
    content,
  });
};

// 댓글 삭제
const deleteComment = async (commentId: string) => {
  await deleteDoc(doc(db, "comments", commentId));
};

// 댓글 목록 가져오기
const getCommentList = async (postId: string) => {
  const q = query(
    commentsCollectionRef,
    where("postId", "==", postId),
    orderBy("createdAt", "asc")
  );
  const querySnapshot = await getDocs(q);
  const commentList = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const commentData = doc.data();
      const userData = await getUser(commentData.uid);
      return {
        commentId: doc.id,
        ...commentData,
        createdAt: commentData.createdAt.toDate(),
        nickname: userData?.nickname || "알 수 없는 계정",
      };
    })
  );
  return commentList;
};

export { createComment, updateComment, deleteComment, getCommentList };
