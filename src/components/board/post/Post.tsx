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
          <div className="p-6 mb-6 rounded-lg bg-base-100">
            <h2 className="mb-2 text-2xl font-bold text-primary">
              {post.title}
            </h2>
            <span className="mb-2">{post.nickname}</span>
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
