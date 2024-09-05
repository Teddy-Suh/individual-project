import { useCallback, useEffect, useState, useRef } from "react";
import { getPostList, LastVisible, PostListItem } from "../../firebase/post";
import { Link, useNavigate } from "react-router-dom";

const Board = () => {
  const navigate = useNavigate();
  const [postList, setPostList] = useState<PostListItem[]>([]);
  const [lastVisible, setLastVisible] = useState<LastVisible>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const { postList: newPostList, lastDoc } = await getPostList(lastVisible);
      setPostList((prevPostList) => [...prevPostList, ...newPostList]);
      setLastVisible(lastDoc);

      if (newPostList.length < 3) {
        setHasMore(false);
        console.log("마지막 페이지입니다.");
      }

      console.log("게시글 목록 불러오기 성공", newPostList);
    } catch (error) {
      console.error("게시글 목록 불러오기 실패", error);
    } finally {
      setIsLoading(false);
    }
  }, [lastVisible]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !isLoading && hasMore) {
        fetchPosts();
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchPosts, isLoading, hasMore]);

  const handlePostClick = (postId: string) => {
    navigate(`/board/${postId}`);
  };

  return (
    <>
      <Link to="/board/create">게시글 작성</Link>
      <div>
        <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
          {postList.map((postListItem) => (
            <li
              key={postListItem.postId}
              style={{
                border: "1px solid black",
                cursor: "pointer",
                height: "200px",
              }}
              onClick={() => handlePostClick(postListItem.postId)}
            >
              <b>{postListItem.title} </b>
              <span>{postListItem.nickname} </span>
              <span>{postListItem.createdAt.toLocaleDateString()}</span>
            </li>
          ))}
        </ul>

        <div ref={observerRef} style={{ height: "1px", margin: "10px 0" }}>
          {hasMore ? <p>불러오는 중...</p> : <p>마지막 페이지 입니다.</p>}
        </div>
      </div>
    </>
  );
};

export default Board;
