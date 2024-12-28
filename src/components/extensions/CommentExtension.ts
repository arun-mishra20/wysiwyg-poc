import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { COMMENT_START_DELIMITER, COMMENT_END_DELIMITER } from '../../lib/utils';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    comment: {
      setComment: (commentId: string) => ReturnType;
      removeComment: (commentId: string) => ReturnType;
    }
  }
}

export const CommentExtension = Extension.create({
  name: 'comment',

  addCommands() {
    return {
      setComment: (commentId: string) => ({ tr, state, dispatch }) => {
        const { from, to } = state.selection;
        if (from === to) return false;

        const content = state.doc.textBetween(from, to);
        const wrappedContent = `${COMMENT_START_DELIMITER}${commentId}${content}${COMMENT_END_DELIMITER}`;
        
        if (dispatch) {
          tr.replaceWith(from, to, state.schema.text(wrappedContent));
        }
        
        return true;
      },
      removeComment: (commentId: string) => ({ tr, state, dispatch }) => {
        let removed = false;
        const pattern = new RegExp(
          `${COMMENT_START_DELIMITER}${commentId}(.*?)${COMMENT_END_DELIMITER}`,
          'g'
        );

        state.doc.descendants((node, pos) => {
          if (node.isText) {
            const matches = [...node.text!.matchAll(pattern)];
            matches.forEach(match => {
              const from = pos + match.index!;
              const to = from + match[0].length;
              if (dispatch) {
                tr.replaceWith(from, to, state.schema.text(match[1]));
              }
              removed = true;
            });
          }
        });

        return removed;
      },
    };
  },

  addProseMirrorPlugins() {
    const commentPlugin = new Plugin({
      key: new PluginKey('comment'),
      props: {
        decorations: (state) => {
          const decorations: Decoration[] = [];
          const pattern = new RegExp(
            `${COMMENT_START_DELIMITER}([\\w-]+)(.*?)${COMMENT_END_DELIMITER}`,
            'g'
          );

          state.doc.descendants((node, pos) => {
            if (node.isText) {
              const matches = [...node.text!.matchAll(pattern)];
              matches.forEach(match => {
                const [fullMatch, commentId, content] = match;
                const from = pos + match.index!;
                const to = from + fullMatch.length;
                
                decorations.push(
                  Decoration.inline(from, to, {
                    class: 'comment-highlight',
                    'data-comment-id': commentId,
                  })
                );
              });
            }
          });

          return DecorationSet.create(state.doc, decorations);
        },
      },
    });

    return [commentPlugin];
  },
});