import { useEffect, useState } from "react";
import {
  createComment,
  deleteComment,
  getCommentList,
  updateComment,
} from "../../firebase/comment";

const Comment = ({ postId, uid }) => {
  const [commentList, setCommentList] = useState([]);
  const [content, setContent] = useState("");
  const [refreshCommentList, setRefreshCommentList] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editCommentId, setEditCommentId] = useState("");

  useEffect(() => {
    const fetchCommentList = async () => {
      try {
        const commentListData = await getCommentList(postId);
        setCommentList(commentListData);
        console.log("댓글 목록 가져오기 성공", commentListData);
      } catch (error) {
        console.error("댓글 목록 가져오기 실패", error);
      }
    };
    fetchCommentList();
  }, [postId, refreshCommentList]);

  const handleCreateComment = async () => {
    await createComment(postId, uid, content);
    setContent("");
    setRefreshCommentList((prev) => !prev);
  };

  const handleClickEditComment = (comment) => {
    setIsEditing(true);
    setContent(comment.content);
    setEditCommentId(comment.commentId);
  };

  const handleEditComment = async () => {
    await updateComment(editCommentId, content);
    setContent("");
    setRefreshCommentList((prev) => !prev);
    setIsEditing(false);
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    setRefreshCommentList((prev) => !prev);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setContent("");
    setEditCommentId("");
  };

  return (
    <>
      <div>
        <h4>댓글</h4>
        <ul>
          {commentList.map((comment) => (
            <li key={comment.commentId}>
              <p>{comment.nickname}</p>
              <p>{comment.content}</p>
              <p>{comment.createdAt.toLocaleDateString()}</p>
              {comment.uid === uid && (
                <>
                  <button onClick={() => handleClickEditComment(comment)}>
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.commentId)}
                  >
                    삭제
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isEditing) {
              handleEditComment();
            } else {
              handleCreateComment();
            }
          }}
        >
          <input
            type="text"
            placeholder="댓글을 입력해 주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button>{isEditing ? "수정" : "작성"}</button>
          {isEditing && (
            <button type="button" onClick={handleCancelEdit}>
              X
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default Comment;
