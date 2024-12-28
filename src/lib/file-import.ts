import { FileHandler, FileImportConfig } from './types/file-import';
import { docxHandler } from './handlers/docx-handler';
import { csvHandler } from './handlers/csv-handler';
import { pdfHandler } from './handlers/pdf-handler';

const handlers: Record<string, FileHandler> = {
  '.docx': docxHandler,
  '.csv': csvHandler,
  '.pdf': pdfHandler,
};

export async function handleFileImport(
  file: File,
  config: FileImportConfig
): Promise<void> {
  try {
    if (file.size > config.maxSize) {
      throw new Error(`File is too large. Maximum size is ${config.maxSize / (1024 * 1024)}MB.`);
    }

    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const handler = handlers[extension];

    if (!handler) {
      throw new Error(`Unsupported file type. Please use ${config.supportedTypes.join(', ')} files.`);
    }

    if (handler.validate) {
      const isValid = await handler.validate(file);
      if (!isValid) {
        throw new Error('Invalid file format.');
      }
    }

    const content = await handler.handle(file);
    
    if (!content.trim()) {
      throw new Error('No content could be extracted from the file');
    }

    config.editor.commands.insertContent(content);
  } catch (error) {
    console.error('File import error:', error);
    throw error;
  }
}