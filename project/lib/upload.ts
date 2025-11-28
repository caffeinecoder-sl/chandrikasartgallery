import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Ensure upload directory exists
 */
export async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Parse multipart form data from request
 */
export async function parseFormData(request: Request) {
  try {
    const formData = await request.formData();
    return formData;
  } catch (error) {
    throw new Error('Failed to parse form data');
  }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
    };
  }

  // Check mime type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, WebP, and GIF images are allowed',
    };
  }

  // Check file extension
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  if (!validExtensions.includes(fileExt)) {
    return {
      valid: false,
      error: 'Invalid file extension',
    };
  }

  return { valid: true };
}

/**
 * Generate unique filename
 */
export function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = originalName.substring(originalName.lastIndexOf('.'));
  return `${timestamp}-${random}${ext}`;
}

/**
 * Save uploaded file to disk
 */
export async function saveUploadedFile(file: File): Promise<string> {
  try {
    // Ensure directory exists
    await ensureUploadDir();

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Generate filename
    const fileName = generateFileName(file.name);
    const filePath = join(UPLOAD_DIR, fileName);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write file
    await writeFile(filePath, buffer);

    // Return relative URL path
    return `/uploads/${fileName}`;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to save file');
  }
}

/**
 * Get file info (size, type, etc)
 */
export async function getFileInfo(file: File) {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  };
}

/**
 * Delete uploaded file
 */
export async function deleteUploadedFile(fileName: string) {
  try {
    const { unlink } = await import('fs/promises');
    const filePath = join(UPLOAD_DIR, fileName);
    await unlink(filePath);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}
