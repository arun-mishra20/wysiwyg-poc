import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const COMMENT_START_DELIMITER = '‹‹';
export const COMMENT_END_DELIMITER = '››';

export function wrapWithComment(text: string, commentId: string): string {
  return `${COMMENT_START_DELIMITER}${commentId}${text}${COMMENT_END_DELIMITER}`;
}

export function unwrapComment(text: string): string {
  return text.replace(
    new RegExp(`${COMMENT_START_DELIMITER}[\\w-]+|${COMMENT_END_DELIMITER}`, 'g'),
    ''
  );
}

export function extractCommentId(text: string): string | null {
  const match = text.match(new RegExp(`${COMMENT_START_DELIMITER}([\\w-]+)`));
  return match ? match[1] : null;
}