import { useEffect, useState } from "react";
import { getPosts } from "../../firebase/post";
import { useNavigate } from "react-router-dom";

interface Post {
  postId: string;
  title: string;
  createdAt: Date;
  nickname: string;
}

const Board = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getPosts();
        setPosts(postsData);
        console.log("게시글 목록 불러오기 성공");
      } catch (error) {
        console.error("게시글 목록 불러오기 실패", error);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = (postId: string) => {
    navigate(`/board/${postId}`);
  };

  return (
    <div>
      <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
        {posts.map((post) => (
          <li
            key={post.postId}
            style={{ border: "1px solid white", cursor: "pointer" }}
            onClick={() => handlePostClick(post.postId)}
          >
            <b>{post.title} </b>
            <span>{post.nickname} </span>
            <span>{post.createdAt.toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Board;
