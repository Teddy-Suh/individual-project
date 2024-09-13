import { useOutletContext } from "react-router-dom";
import Comment from "./Comment";
import { ReturnPost } from "../../../firebase/post";

interface PostContext {
  post: ReturnPost;
  uid: string;
  role: string;
  isLoading: boolean;
}

const Post = () => {
  const { post, uid, role, isLoading } = useOutletContext<PostContext>();
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center">
          <span className="loading loading-bars loading-lg text-accent"></span>
        </div>
      ) : (
        <>
          <div className="p-4 border-t-2 border-t-warning">
            <h2 className="mb-2 text-xl font-bold">{post.title}</h2>
            <div className="mb-2 text-end">
              <span className="">{post.nickname} </span>
              <span className="">{post.createdAt.toLocaleDateString()}</span>
            </div>
            <div
              className="mb-2"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></div>
          </div>
          <Comment postId={post.postId} uid={uid} role={role} />
        </>
      )}
    </>
  );
};
export default Post;
