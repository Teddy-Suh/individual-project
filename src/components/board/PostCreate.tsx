import { useEffect, useRef, useState } from "react";
import {
  DecoupledEditor,
  Bold,
  Essentials,
  Italic,
  Paragraph,
} from "ckeditor5";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import "ckeditor5/ckeditor5.css";

function PostCreate() {
  const editorToolbarRef = useRef(null);
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  return (
    <>
      <div>
        {isMounted && (
          <CKEditor
            editor={DecoupledEditor}
            data="<p>Hello from CKEditor 5 decoupled editor!</p>"
            config={{
              plugins: [Bold, Italic, Paragraph, Essentials],
              toolbar: ["undo", "redo", "|", "bold", "italic"],
            }}
            onReady={(editor) => {
              if (editorToolbarRef.current) {
                editorToolbarRef.current.appendChild(
                  editor.ui.view.toolbar.element
                );
              }
            }}
            onAfterDestroy={(editor) => {
              if (editorToolbarRef.current) {
                Array.from(editorToolbarRef.current.children).forEach((child) =>
                  child.remove()
                );
              }
            }}
          />
        )}
      </div>
      <div
        ref={editorToolbarRef}
        style={{ position: "fixed", bottom: "0", width: "100%" }}
      />
    </>
  );
}

export default PostCreate;
