import { useEffect, useState } from "react";
import {
  createComment,
  deleteComment,
  getCommentList,
  updateComment,
} from "../../../firebase/comment";

const Comment = ({ postId, user, role }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [content, setContent] = useState("");
  const [refreshCommentList, setRefreshCommentList] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editCommentId, setEditCommentId] = useState("");

  useEffect(() => {
    setIsLoading(true);
    const fetchCommentList = async () => {
      try {
        const commentListData = await getCommentList(postId);
        setCommentList(commentListData);
        console.log("댓글 목록 가져오기 성공", commentListData);
      } catch (error) {
        console.error("댓글 목록 가져오기 실패", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCommentList();
  }, [postId, refreshCommentList]);

  const handleCreateComment = async () => {
    await createComment(postId, user?.uid, content);
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
  const handleCommentFormClick = (e) => {
    if (!user) {
      document.getElementById("login_modal").showModal();
    }
  };

  return (
    <>
      <div className="p-6 rounded-lg shadow-md bg-base-100">
        <h4 className="mb-4 text-lg font-semibold text-primary">댓글</h4>

        {isLoading ? (
          <div className="flex justify-center">
            <span className="loading loading-bars loading-lg text-accent"></span>
          </div>
        ) : (
          <ul className="space-y-4">
            {commentList.map((comment) => (
              <li
                key={comment.commentId}
                className="pb-4 border-b border-gray-200"
              >
                <p className="font-bold">{comment.nickname}</p>
                <p>{comment.content}</p>
                <p>{comment.createdAt.toLocaleDateString()}</p>
                {(comment.uid === user.uid || role === "admin") && (
                  <div className="mt-2 space-x-2">
                    <button
                      className="btn btn-sm btn-outline btn-primary"
                      onClick={() => handleClickEditComment(comment)}
                    >
                      수정
                    </button>
                    <button
                      className="btn btn-sm btn-outline btn-error"
                      onClick={() => handleDeleteComment(comment.commentId)}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        className="p-6 mt-6 rounded-lg shadow-md bg-base-100"
        onClick={handleCommentFormClick}
      >
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
          <div className="mb-4 form-control">
            <input
              type="text"
              placeholder="댓글을 입력해 주세요"
              className="w-full input input-bordered"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="space-x-2">
            <button className="btn btn-primary">
              {isEditing ? "수정" : "작성"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancelEdit}
              >
                취소
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default Comment;
