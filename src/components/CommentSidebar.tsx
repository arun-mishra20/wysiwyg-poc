import { useCommentStore } from '../stores/comment-store';
import { X } from 'lucide-react';

type CommentSidebarProps = {
  onClose: () => void;
};

export function CommentSidebar({ onClose }: CommentSidebarProps) {
  const { comments, updateComment, resolveComment, deleteComment } = useCommentStore();

  return (
    <div className="w-80 border-l border-gray-200 bg-gray-50 p-4 overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Comments</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`bg-white p-3 rounded-lg shadow-sm ${
                comment.resolved ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">
                    "{comment.selection.content}"
                  </p>
                  <textarea
                    value={comment.text}
                    onChange={(e) =>
                      updateComment(comment.id, { text: e.target.value })
                    }
                    placeholder="Add a comment..."
                    className="w-full p-2 border rounded-md text-sm"
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => resolveComment(comment.id)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {comment.resolved ? 'Unresolve' : 'Resolve'}
                </button>
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}