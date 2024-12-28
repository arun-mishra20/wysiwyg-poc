import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { DecorationSet, Decoration } from '@tiptap/pm/view';
import { Comment } from '../../stores/comment-store';

interface CommentHighlightOptions {
  HTMLAttributes?: Record<string, any>;
  comments: Comment[];
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    commentHighlight: {
      setCommentHighlight: (commentId: string) => ReturnType;
    };
  }
}

export const CommentHighlight = Extension.create<CommentHighlightOptions>({
  name: 'commentHighlight',

  addOptions() {
    return {
      HTMLAttributes: {},
      comments: [],
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('commentHighlight'),
        props: {
          decorations: (state) => {
            const { comments } = this.options;
            const decorations: Decoration[] = [];

            comments.forEach((comment) => {
              if (!comment.resolved) {
                // Create an inline decoration that wraps the exact selected text
                const decoration = Decoration.inline(
                  comment.selection.from,
                  comment.selection.to,
                  {
                    class: 'comment-highlight',
                    'data-comment-id': comment.id,
                  }
                );
                decorations.push(decoration);
              }
            });

            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },
});