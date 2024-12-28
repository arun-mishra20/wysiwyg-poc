import { Upload } from 'lucide-react';
import { handleFileImport } from '../lib/file-import';
import { Editor } from '@tiptap/react';
import { FileImportConfig } from '../lib/types/file-import';

type FileImportButtonProps = {
  editor: Editor;
};

const config: Omit<FileImportConfig, 'editor'> = {
  maxSize: 10 * 1024 * 1024, // 10MB
  supportedTypes: ['.docx', '.csv', '.pdf'],
};

export function FileImportButton({ editor }: FileImportButtonProps) {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await handleFileImport(file, { ...config, editor });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error importing file. Please try again.');
    }

    // Reset the input
    event.target.value = '';
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept={config.supportedTypes.join(',')}
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        title="Import file"
      />
      <button className="p-2 hover:bg-gray-100 rounded">
        <Upload className="w-5 h-5" />
      </button>
    </div>
  );
}