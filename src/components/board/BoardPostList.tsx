import { PostHeader } from "../../firebase/post";

interface BoardPostListProps {
  postHeaders: PostHeader[];
  handlePostClick: (postId: string) => void;
}

const BoardPostList = ({
  postHeaders,
  handlePostClick,
}: BoardPostListProps) => {
  return (
    <ul className="p-0 m-0 list-none border-t-2 border-t-warning">
      {postHeaders.map((postHeader) => {
        const weekColor = (() => {
          switch (postHeader.selectedAt.week) {
            case 1:
              return "error";
            case 2:
              return "primary";
            case 3:
              return "secondary";
            case 4:
              return "success";
            case 5:
              return "accent";
          }
        })();

        return (
          <li
            key={postHeader.postId}
            className="px-1 py-2 border-b-2 rounded-none border-b-warning card"
            onClick={() => handlePostClick(postHeader.postId)}
          >
            <div className="p-2">
              <div className="flex justify-between mb-1">
                <div className={`badge badge-${weekColor} badge-outline`}>
                  {postHeader.selectedAt?.month}월&nbsp;
                  {postHeader.selectedAt?.week}주차&nbsp;
                  {postHeader.selectedMovieTitle}
                </div>
                <div className="text-sm">
                  {postHeader.createdAt.toLocaleDateString()}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="flex-none w-64 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                  {postHeader.title}
                </div>
                <div className="text-sm text-end">{postHeader.nickname}</div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default BoardPostList;
