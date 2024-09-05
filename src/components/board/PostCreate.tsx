import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { createPost } from "../../firebase/post";
import { useNavigate } from "react-router-dom";

const PostCreate = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { state } = useContext(AuthContext);
  const { user } = state;

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const postId = await createPost(user?.uid as string, title, content);
      console.log("게시글 작성 성공");
      navigate(`/board/${postId}`);
    } catch (error) {
      console.error("게시글 작성 실패:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <button type="submit">게시글 작성</button>
    </form>
  );
};

export default PostCreate;
