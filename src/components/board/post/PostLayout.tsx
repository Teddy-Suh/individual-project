import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import {
  createPost,
  deletePost,
  getPost,
  ReturnPost,
  updatePost,
} from "../../../firebase/post";
import PostHeader from "./PostHeader";
import { AuthContext } from "../../../context/AuthContext";

const PostLayout = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { state } = useContext(AuthContext);
  const { user, role } = state;
  const uid = user?.uid;

  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [post, setPost] = useState<ReturnPost | null>(null); // 작성일땐 제목, 내용만 있는걸로 초기화
  const [isLoading, setIsLoading] = useState(!!postId); // 작성일땐 로딩 필요 없음

  const fetchPost = async (id: string) => {
    try {
      const postData = await getPost(id);
      setPost(postData);
      setPostTitle(postData.title);
      setPostContent(postData.content);
      console.log("게시글 가져오기 성공", postData);
    } catch (error) {
      console.error("게시글을 가져오기 실패", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // postId 있는 게시글 보기, 수정 때만 post받아옴
    // 작성일땐 안 받아옴
    if (postId) {
      fetchPost(postId);
    } else {
      setIsLoading(false);
    }
  }, [postId]);

  const handleCreate = async () => {
    if (!uid) {
      console.error("사용자가 로그인되지 않았습니다.");
      return;
    }

    try {
      const postId = await createPost(uid, postTitle, postContent);
      console.log("게시글 작성 성공");
      await fetchPost(postId);
      navigate(`/board/post/${postId}`, { replace: true });
    } catch (error) {
      console.error("게시글 작성 실패", error);
    }
  };

  const handleEdit = async () => {
    if (!postId) {
      console.error("게시글 정보가 없습니다.");
      return;
    }

    try {
      await updatePost(postId, postTitle, postContent);
      console.log("게시글 수정 성공");
      await fetchPost(postId);
      navigate(`/board/post/${postId}`, { replace: true });
    } catch (error) {
      console.error("게시글 수정 실패", error);
    }
  };

  const handleDelete = async () => {
    if (!postId) {
      console.error("게시글 정보가 없습니다.");
      return;
    }

    try {
      await deletePost(postId);
      console.log("게시글 삭제 성공");
      navigate("/board");
    } catch {
      console.log("게시글 삭제 실패");
    }
  };

  return (
    <>
      <PostHeader
        postId={postId}
        authorId={post?.uid}
        uid={uid}
        role={role}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <main className="pt-16">
        <Outlet
          context={{
            post,
            postTitle,
            postContent,
            setPostTitle,
            setPostContent,
            uid,
            role,
            isLoading,
          }}
        />
      </main>
    </>
  );
};

export default PostLayout;
