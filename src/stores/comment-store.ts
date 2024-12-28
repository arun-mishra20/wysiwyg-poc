import { create } from 'zustand';

export interface Comment {
  id: string;
  text: string;
  selection: {
    from: number;
    to: number;
    content: string;
  };
  resolved: boolean;
}

interface CommentStore {
  comments: Comment[];
  addComment: (comment: Comment) => void;
  updateComment: (id: string, updates: Partial<Comment>) => void;
  resolveComment: (id: string) => void;
  deleteComment: (id: string) => void;
}

export const useCommentStore = create<CommentStore>((set) => ({
  comments: [],
  addComment: (comment) =>
    set((state) => ({ comments: [...state.comments, comment] })),
  updateComment: (id, updates) =>
    set((state) => ({
      comments: state.comments.map((comment) =>
        comment.id === id ? { ...comment, ...updates } : comment
      ),
    })),
  resolveComment: (id) =>
    set((state) => ({
      comments: state.comments.map((comment) =>
        comment.id === id
          ? { ...comment, resolved: !comment.resolved }
          : comment
      ),
    })),
  deleteComment: (id) =>
    set((state) => ({
      comments: state.comments.filter((comment) => comment.id !== id),
    })),
}));