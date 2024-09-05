import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deletePost, getPost } from "../../firebase/post";
import { AuthContext } from "../../context/AuthContext";
import Comment from "./Comment";

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { state } = useContext(AuthContext);
  const { user } = state;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPost(id);
        setPost(postData);
        console.log("게시글 가져오기 성공", postData);
      } catch (error) {
        console.error("게시글을 가져오기 실패", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deletePost(id);
      console.log("게시글 삭제 성공");
      navigate("/board");
    } catch {
      console.log("게시글 삭제 실패");
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      <div>
        {user.uid === post.uid && (
          <>
            <button onClick={() => navigate(`/board/${id}/edit`)}>수정</button>
            <button onClick={handleDelete}>삭제</button>
          </>
        )}
        <h2>제목: {post.title}</h2>
        <p>내용: {post.content}</p>
        <p>작성자: {post.nickname}</p>
        <span>작성일: {post.createdAt.toLocaleDateString()}</span>
      </div>
      <Comment postId={id} uid={user.uid} />
    </>
  );
};

export default Post;
