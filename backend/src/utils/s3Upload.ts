import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { s3Client, S3_BUCKET, ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES, S3_PRESIGNED_EXPIRES } from '../config/s3';
import { createError } from '../middleware/errorHandler';
import logger from './logger';

export interface UploadResult {
  s3Key: string;
  s3Url: string;
}

export function buildS3Key(productSku: string, viewType: string, originalName: string): string {
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
  return `products/${productSku.toUpperCase()}/${viewType}/${uuidv4()}.${safeExt}`;
}

export function buildDefectS3Key(productSku: string, defectId: string, originalName: string): string {
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
  return `defects/${productSku.toUpperCase()}/${defectId}/${uuidv4()}.${safeExt}`;
}

export function validateImageBuffer(
  buffer: Buffer,
  mimetype: string,
  size: number
): void {
  if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
    throw createError(`File type not allowed. Accepted: ${ALLOWED_MIME_TYPES.join(', ')}`, 400);
  }
  if (size > MAX_FILE_SIZE_BYTES) {
    throw createError(`File too large. Maximum size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB`, 400);
  }
  // Basic magic-byte validation for JPEG, PNG, WEBP
  const header = buffer.slice(0, 4);
  const isJpeg = header[0] === 0xff && header[1] === 0xd8;
  const isPng = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47;
  const isWebp = buffer.slice(0, 4).toString('ascii') === 'RIFF';
  if (!isJpeg && !isPng && !isWebp) {
    throw createError('File content does not match a valid image format', 400);
  }
}

export async function uploadImageToS3(
  buffer: Buffer,
  mimetype: string,
  s3Key: string
): Promise<UploadResult> {
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: s3Key,
    Body: buffer,
    ContentType: mimetype,
    ServerSideEncryption: 'AES256',
    Metadata: {
      uploadedAt: new Date().toISOString(),
      service: 'warehouse-inventory-hq',
    },
  });

  await s3Client.send(command);
  logger.info('Image uploaded to S3', { s3Key });

  const s3Url = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
  return { s3Key, s3Url };
}

export async function deleteImageFromS3(s3Key: string): Promise<void> {
  const command = new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: s3Key });
  await s3Client.send(command);
  logger.info('Image deleted from S3', { s3Key });
}

export async function getPresignedUrl(s3Key: string): Promise<string> {
  const command = new GetObjectCommand({ Bucket: S3_BUCKET, Key: s3Key });
  return getSignedUrl(s3Client, command, { expiresIn: S3_PRESIGNED_EXPIRES });
}

export function multerMemoryConfig() {
  const multer = require('multer');
  const storage = multer.memoryStorage();
  return multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 6 },
    fileFilter: (_req: unknown, file: { mimetype: string }, cb: (err: Error | null, ok: boolean) => void) => {
      if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP are accepted.'), false);
      }
    },
  });
}
