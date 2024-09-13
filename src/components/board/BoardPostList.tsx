import { PostListItem } from "../../firebase/post";

interface BoardPostListProps {
  postList: PostListItem[];
  handlePostClick: (postId: string) => void;
}

const BoardPostList = ({ postList, handlePostClick }: BoardPostListProps) => {
  return (
    <ul className="p-0 m-0 list-none border-t-2 border-t-warning">
      {postList.map((postListItem) => {
        const weekColor = (() => {
          switch (postListItem.selectedAt?.week) {
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
            key={postListItem.postId}
            className="px-1 py-2 border-b-2 rounded-none border-b-warning card"
            onClick={() => handlePostClick(postListItem.postId)}
          >
            <div className="p-2 card-body">
              <div className="flex justify-between">
                <div className={`badge badge-${weekColor} badge-outline`}>
                  {postListItem.selectedAt?.month}월&nbsp;
                  {postListItem.selectedAt?.week}주차&nbsp;-&nbsp;
                  {postListItem.selectedMovieTitle}
                </div>
                <div className="text-sm">
                  {postListItem.createdAt.toLocaleDateString()}
                </div>
              </div>
              <div className="">
                <div className="w-40 overflow-hidden text-sm card-title text-ellipsis whitespace-nowrap">
                  {postListItem.title}
                </div>
                <div className="text-sm text-end whitespace-nowrap">
                  {postListItem.nickname}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default BoardPostList;
