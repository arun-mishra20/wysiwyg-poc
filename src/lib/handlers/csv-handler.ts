import Papa from 'papaparse';
import { FileHandler } from '../types/file-import';

export const csvHandler: FileHandler = {
  async handle(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (results) => {
          const html = convertCsvToHtml(results.data);
          resolve(html);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  },
};

function convertCsvToHtml(data: any[][]): string {
  if (!data.length) return '';

  const headers = data[0];
  const rows = data.slice(1);

  return `
    <table>
      <thead>
        <tr>
          ${headers.map((header) => `<th>${header}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `
          <tr>
            ${row.map((cell) => `<td>${cell}</td>`).join('')}
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `;
}