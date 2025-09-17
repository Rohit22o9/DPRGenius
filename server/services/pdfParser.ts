import { readFile } from 'fs/promises';
import { Buffer } from 'buffer';

export async function extractTextFromPdf(fileBuffer: Buffer): Promise<string> {
  try {
    // For production, you would use a PDF parsing library like pdf-parse
    // For now, we'll simulate PDF text extraction
    const pdfContent = fileBuffer.toString('utf8');
    
    // Try to extract readable text (this is a simplified approach)
    // In production, use: const pdf = require('pdf-parse'); return (await pdf(fileBuffer)).text;
    
    // Check if it's actually a text file disguised as PDF
    if (pdfContent.includes('%PDF')) {
      // This is a real PDF file - in production you'd use proper PDF parsing
      throw new Error('PDF parsing requires pdf-parse library. Please upload as text file for now.');
    }
    
    return pdfContent;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

export async function extractTextFromFile(fileBuffer: Buffer, fileType: string): Promise<string> {
  try {
    if (fileType === 'application/pdf' || fileType === 'pdf') {
      return await extractTextFromPdf(fileBuffer);
    } else if (fileType === 'text/plain' || fileType === 'txt') {
      return fileBuffer.toString('utf8');
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error('File parsing error:', error);
    throw new Error(`Failed to extract text from file: ${error.message}`);
  }
}

export function validateDprFile(filename: string, fileSize: number, fileType: string): void {
  const maxSizeBytes = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['application/pdf', 'text/plain', 'pdf', 'txt'];
  
  if (fileSize > maxSizeBytes) {
    throw new Error('File size exceeds 10MB limit');
  }
  
  if (!allowedTypes.some(type => fileType.includes(type) || filename.toLowerCase().endsWith(`.${type}`))) {
    throw new Error('Only PDF and TXT files are supported');
  }
}
