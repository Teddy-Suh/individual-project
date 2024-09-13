import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import {
  createPost,
  deletePost,
  getPost,
  updatePost,
} from "../../../firebase/post";
import PostHeader from "./PostHeader";
import { AuthContext } from "../../../context/AuthContext";

const PostLayout = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState(postId ? {} : { title: "", content: "" }); // 작성일땐 제목, 내용만 있는걸로 초기화
  const [isLoading, setIsLoading] = useState(!!postId); // 작성일땐 로딩 필요 없음
  const { state } = useContext(AuthContext);
  const { user, role } = state;

  useEffect(() => {
    // postId 있는 게시글 보기, 수정 때만 post받아옴
    // 작성일땐 안 받아옴
    if (postId) {
      const fetchPost = async () => {
        try {
          const postData = await getPost(postId);
          setPost(postData);
          console.log("게시글 가져오기 성공", postData);
        } catch (error) {
          console.error("게시글을 가져오기 실패", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPost();
    } else {
      setIsLoading(false);
    }
  }, [postId]);

  const handleCreate = async () => {
    try {
      const postId = await createPost(user.uid, post.title, post.content);
      console.log("게시글 작성 성공");
      navigate(`/board/post/${postId}`, { replace: true });
    } catch (error) {
      console.error("게시글 작성 실패", error);
    }
  };

  const handleEdit = async () => {
    try {
      await updatePost(post.postId, post.title, post.content);
      console.log("게시글 수정 성공");
      navigate(`/board/post/${postId}`, { replace: true });
    } catch (error) {
      console.error("게시글 수정 실패", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post.postId);
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
        authorId={post.uid}
        user={user}
        role={role}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <main className="pt-16">
        <Outlet context={{ post, setPost, user, role, isLoading }} />
      </main>
    </>
  );
};

export default PostLayout;
