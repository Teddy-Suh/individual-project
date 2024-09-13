import { useEffect, useState } from "react";
import {
  createComment,
  deleteComment,
  getCommentList,
  ReturnComment,
  updateComment,
} from "../../../firebase/comment";

interface CommentProps {
  postId: string;
  uid: string;
  role: string;
}

const Comment = ({ postId, uid, role }: CommentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [commentList, setCommentList] = useState<ReturnComment[]>([]);
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
    await createComment(postId, uid, content);
    setContent("");
    setRefreshCommentList((prev) => !prev);
  };

  const handleClickEditComment = (comment: ReturnComment) => {
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

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId);
    setRefreshCommentList((prev) => !prev);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setContent("");
    setEditCommentId("");
  };

  const handleCommentFormClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!uid) {
      e.preventDefault(); // ProtectedRoute로 로그인 페이지로 바로 리디렉션 하는거 방지
      const loginModal = document.getElementById("login_modal");
      (loginModal as HTMLDialogElement).showModal();
    }
  };

  return (
    <>
      <div className="p-6">
        <h4 className="mb-4 text-lg font-semibold text-accent">댓글</h4>

        {isLoading ? (
          <div className="flex justify-center">
            <span className="loading loading-bars loading-lg text-accent"></span>
          </div>
        ) : (
          <ul className="space-y-4 ">
            {commentList.map((comment) => (
              <li
                key={comment.commentId}
                className="pb-4 border-b border-warning"
              >
                <div className="flex">
                  <p className="flex-1 pb-2 font-bold">{comment.nickname}</p>
                  <p>{comment.createdAt.toLocaleDateString()}</p>
                </div>
                <div className="pb-2">{comment.content}</div>
                {(comment.uid === uid || role === "admin") && (
                  <div className="flex justify-end space-x-2">
                    <button
                      className="btn btn-sm btn-outline btn-warning"
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
        className="fixed bottom-0 w-full max-w-md p-6 mt-6"
        onClick={handleCommentFormClick}
      >
        <form
          className="flex"
          onSubmit={(e) => {
            e.preventDefault();
            if (isEditing) {
              handleEditComment();
            } else {
              handleCreateComment();
            }
          }}
        >
          <div className="flex-1 form-control">
            <input
              type="text"
              placeholder="댓글을 입력해 주세요"
              className="w-full input input-bordered input-accent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="flex-none">
            <button className="ml-1 btn btn-accent btn-outline">
              {isEditing ? "수정" : "작성"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="ml-1 btn btn-error btn-outline"
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
