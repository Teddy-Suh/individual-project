import { useCallback, useEffect, useState, useRef } from "react";
import { getPostHeaders, LastVisible, PostHeader } from "../../firebase/post";
import { useNavigate } from "react-router-dom";
import BoardPostList from "./BoardPostList";

const Board = () => {
  const [postList, setPostList] = useState<PostHeader[]>([]);
  const [lastVisible, setLastVisible] = useState<LastVisible>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef(null);
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const { postHeaders: newPostList, lastDoc } = await getPostHeaders(
        lastVisible
      );
      setPostList((prevPostList) => [...prevPostList, ...newPostList]);
      setLastVisible(lastDoc);

      if (newPostList.length < 12) {
        setHasMore(false);
        console.log("마지막 페이지입니다.");
      }
    } catch (error) {
      console.error("게시글 목록 불러오기 실패", error);
    } finally {
      setIsLoading(false);
    }
  }, [lastVisible]);

  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !isLoading && hasMore) {
        fetchPosts();
      }
    });
    observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchPosts, isLoading, hasMore]);

  const handlePostClick = (postId: string) => {
    navigate(`/board/post/${postId}`);
  };

  return (
    <>
      <div>
        <BoardPostList
          postHeaders={postList}
          handlePostClick={handlePostClick}
        />

        <div ref={observerRef} className="my-6">
          {hasMore ? (
            <div className="flex justify-center">
              <span className="loading loading-bars loading-lg text-accent"></span>
            </div>
          ) : (
            <p className="text-center text-accent">더 이상 게시글이 없습니다</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Board;
