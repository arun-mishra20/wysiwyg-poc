import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Strikethrough,
  Link,
  CheckSquare,
  Image as ImageIcon,
  Table as TableIcon,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { FileImportButton } from './FileImportButton';

type ToolbarProps = {
  editor: Editor;
};

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="flex flex-wrap gap-2 p-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            'p-2 hover:bg-gray-100 rounded',
            editor.isActive('bold') && 'bg-gray-100'
          )}
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            'p-2 hover:bg-gray-100 rounded',
            editor.isActive('italic') && 'bg-gray-100'
          )}
        >
          <Italic className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn(
            'p-2 hover:bg-gray-100 rounded',
            editor.isActive('strike') && 'bg-gray-100'
          )}
        >
          <Strikethrough className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            'p-2 hover:bg-gray-100 rounded',
            editor.isActive('heading', { level: 1 }) && 'bg-gray-100'
          )}
        >
          <Heading1 className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            'p-2 hover:bg-gray-100 rounded',
            editor.isActive('heading', { level: 2 }) && 'bg-gray-100'
          )}
        >
          <Heading2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            'p-2 hover:bg-gray-100 rounded',
            editor.isActive('bulletList') && 'bg-gray-100'
          )}
        >
          <List className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            'p-2 hover:bg-gray-100 rounded',
            editor.isActive('orderedList') && 'bg-gray-100'
          )}
        >
          <ListOrdered className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={cn(
            'p-2 hover:bg-gray-100 rounded',
            editor.isActive('taskList') && 'bg-gray-100'
          )}
        >
          <CheckSquare className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Enter URL');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={cn(
            'p-2 hover:bg-gray-100 rounded',
            editor.isActive('link') && 'bg-gray-100'
          )}
        >
          <Link className="w-5 h-5" />
        </button>
        <button
          onClick={addImage}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <button
          onClick={addTable}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <TableIcon className="w-5 h-5" />
        </button>
        <FileImportButton editor={editor} />
      </div>
    </div>
  );
}