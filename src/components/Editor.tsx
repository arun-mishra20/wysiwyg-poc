import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { Link } from "@tiptap/extension-link";
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { useCommentStore } from "../stores/comment-store";
import { Toolbar } from "./Toolbar";
import { CommentSidebar } from "./CommentSidebar";
import { useState, useEffect } from "react";
import { CommentExtension } from "./extensions/CommentExtension";
import { nanoid } from "nanoid";

export function Editor() {
  const [showSidebar, setShowSidebar] = useState(true);
  const { addComment, comments } = useCommentStore();

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem,
      Link.configure({
        openOnClick: false,
      }),
      Highlight,
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CommentExtension,
    ],
    content:
      "<h1>Welcome to the Editor!</h1><p>Try selecting some text to comment on it.</p>",
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      if (from === to) return false;

      const selectedText = editor.state.doc.textBetween(from, to);
      return selectedText.length > 0;
    },
  });

  useEffect(() => {
    if (editor) {
      editor.view.updateState(editor.view.state);
    }
  }, [comments, editor]);

  if (!editor) return null;

  const getHTMLContent = () => {
    if (editor) {
      const html = editor.getHTML();
      console.log(html);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex flex-col flex-1">
        <Toolbar editor={editor} />
        <div className="flex-1 p-4 overflow-auto">
          <EditorContent editor={editor} className="prose max-w-none" />
        </div>
        <button
          onClick={getHTMLContent}
          className="p-2 m-4 text-white bg-blue-500 rounded"
        >
          Get HTML Content
        </button>
      </div>

      {showSidebar && <CommentSidebar onClose={() => setShowSidebar(false)} />}

      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="flex items-center gap-1 p-1 bg-white border rounded-lg shadow-lg">
          <button
            onClick={() => {
              const { from, to } = editor.state.selection;
              const selectedText = editor.state.doc.textBetween(from, to);
              const commentId = nanoid();

              editor.chain().focus().setComment(commentId).run();

              addComment({
                id: commentId,
                text: "",
                selection: {
                  from,
                  to,
                  content: selectedText,
                },
                resolved: false,
              });
            }}
            className="p-2 rounded hover:bg-gray-100"
          >
            Add Comment
          </button>
        </div>
      </BubbleMenu>
    </div>
  );
}
