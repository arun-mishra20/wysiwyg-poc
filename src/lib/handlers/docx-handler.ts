import mammoth from 'mammoth';
import { FileHandler } from '../types/file-import';

export const docxHandler: FileHandler = {
  async handle(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return result.value;
  },
}