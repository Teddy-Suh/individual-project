import { useState } from "react";
import ReactQuill from "react-quill";

const PostCreate = () => {
  const [value, setValue] = useState("");

  return (
    <div>
      <ReactQuill value={value} onChange={setValue} />;
    </div>
  );
};

export default PostCreate;
