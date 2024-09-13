import { useLocation, useNavigate } from "react-router-dom";

interface PostHeaderProps {
  postId: string | undefined;
  authorId: string | undefined;
  uid: string | undefined;
  role: string | null;
  onCreate: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const PostHeader = ({
  postId,
  authorId,
  uid,
  role,
  onCreate,
  onEdit,
  onDelete,
}: PostHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClickEdit = () => {
    navigate(`/board/post/${postId}/edit`, {
      state: { from: location.pathname },
      replace: true,
    });
  };

  const handleClickBack = () => {
    if (location.pathname.endsWith("/edit")) {
      // 수정 페이지: 수정하기 전에 있던 페이지(게시글)로 돌아감
      const previousPage = location.state?.from || `/board/post/${postId}`;
      navigate(previousPage, { replace: true });
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="fixed top-0 z-50 h-16 max-w-md px-5 mx-auto navbar bg-base-100 bd-">
      <div className="flex-none">
        <button
          type="button"
          onClick={handleClickBack}
          className="p-0 pr-3 border-0 btn btn-accent btn-outline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
      </div>

      {/* 게시글 작성 페이지에서만 작성 버튼을 표시 */}
      {location.pathname.endsWith("/create") && (
        <>
          <h1 className="flex-grow text-xl font-bold text-accent">
            Write Post
          </h1>
          <button
            className="p-0 border-0 btn btn-accent btn-outline"
            onClick={onCreate}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
          </button>
        </>
      )}

      {/* 게시글 수정 페이지에서만 수정 버튼을 표시 */}
      {location.pathname.endsWith("/edit") && (
        <>
          <h1 className="flex-grow text-xl font-bold text-accent">Edit Post</h1>
          <button
            className="border-0 btn btn-accent btn-outline"
            onClick={onEdit}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>
        </>
      )}

      {/* 게시글 페이지일때 작성자면 수정/삭제 버튼을 표시 */}
      {!location.pathname.endsWith("/create") &&
        !location.pathname.endsWith("/edit") &&
        (authorId === uid || role === "admin") && (
          <>
            <h1 className="flex-grow text-xl font-bold text-accent">Post</h1>
            <button
              type="button"
              onClick={handleClickEdit}
              className="border-0 btn btn-accent btn-outline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
            <button
              className="border-0 btn btn-accent btn-outline"
              onClick={onDelete}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </>
        )}
    </header>
  );
};

export default PostHeader;
