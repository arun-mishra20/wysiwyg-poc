import { Editor } from '@tiptap/react';

export interface FileHandler {
  handle: (file: File) => Promise<string>;
  validate?: (file: File) => boolean | Promise<boolean>;
}

export interface FileImportConfig {
  maxSize: number;
  supportedTypes: string[];
  editor: Editor;
}

export interface ImportResult {
  content: string;
  metadata?: Record<string, unknown>;
}