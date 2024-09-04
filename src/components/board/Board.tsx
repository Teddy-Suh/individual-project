import { useCallback, useEffect, useState } from "react";
import { getPostList, LastVisible, PostListItem } from "../../firebase/post";
import { Link, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";

const Board = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [lastVisible, setLastVisible] = useState<LastVisible>(null);
  const [hasMore, setHasMore] = useState(true);
  const [ref, inView] = useInView();

  const fetchPosts = useCallback(async () => {
    try {
      const { postList: newPostList, lastDoc } = await getPostList(lastVisible);
      setPosts((prevPostList) => [...prevPostList, ...newPostList]);
      setLastVisible(lastDoc);

      if (newPostList.length < 15) {
        setHasMore(false);
        console.log("마지막 페이지입니다.");
      }

      console.log("게시글 목록 불러오기 성공");
    } catch (error) {
      console.error("게시글 목록 불러오기 실패", error);
    }
  }, [lastVisible]);

  useEffect(() => {
    if (inView && hasMore) {
      fetchPosts();
    }
  }, [inView, hasMore, fetchPosts]);

  const handlePostClick = (postId: string) => {
    navigate(`/board/${postId}`);
  };

  return (
    <>
      <Link to="/board/create">게시글 작성</Link>
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
        <div ref={ref} style={{ height: "1px", margin: "10px 0" }}>
          {hasMore ? <p>불러오는 중...</p> : <p>더 이상 게시글이 없습니다.</p>}
        </div>
      </div>
    </>
  );
};

export default Board;
