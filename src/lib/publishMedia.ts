import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function prepareMedia(source: string) {
  let bytes: Buffer;
  let video = false;
  if (source.startsWith('/videos/')) {
    const root = await realpath(path.join(process.cwd(), 'public/videos'));
    const file = await realpath(path.resolve(process.cwd(), 'public', '.' + decodeURIComponent(source)));
    if (!file.startsWith(root + path.sep)) throw new Error('Invalid media path');
    bytes = await readFile(file);
    video = /\.mp4$/i.test(file);
  } else if (/^data:(video\/mp4|image\/(jpeg|png|webp));base64,/.test(source)) {
    bytes = Buffer.from(source.slice(source.indexOf(',') + 1), 'base64');
    video = source.startsWith('data:video/');
  } else {
    throw new Error('Select a local feed asset or generated video to publish. Unsupported media URL.');
  }
  if (!bytes.length || bytes.length > 100 * 1024 * 1024) throw new Error('Media must be between 1 byte and 100 MB');
  if (!video) {
    bytes = await sharp(bytes).rotate().resize(1080, 1350, { fit: 'contain', background: '#ffffff' }).jpeg({ quality: 92 }).toBuffer();
  }
  const env = process.env;
  for (const key of ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME', 'R2_PUBLIC_URL']) {
    if (!env[key]) throw new Error(`${key} is not configured`);
  }
  const client = new S3Client({ region: 'auto', endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, credentials: { accessKeyId: env.R2_ACCESS_KEY_ID!, secretAccessKey: env.R2_SECRET_ACCESS_KEY! } });
  const key = `instagram/${createHash('sha256').update(bytes).digest('hex')}.${video ? 'mp4' : 'jpg'}`;
  await client.send(new PutObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: key, Body: bytes, ContentType: video ? 'video/mp4' : 'image/jpeg' }));
  const url = `${env.R2_PUBLIC_URL!.replace(/\/$/, '')}/${key}`;
  const check = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(20000) });
  if (!check.ok) throw new Error('Uploaded media is not publicly accessible from R2');
  return { url, video };
}
