import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// Backblaze B2 is S3-compatible. These env vars are shared by staging + prod
// so both point at the SAME bucket/folder (optimizes storage as requested).
//
//   B2_ENDPOINT          e.g. https://s3.us-west-004.backblazeb2.com
//   B2_REGION            e.g. us-west-004
//   B2_KEY_ID            application key id
//   B2_APP_KEY           application key secret
//   B2_BUCKET            bucket name
//   B2_PUBLIC_BASE_URL   public base for reads, e.g.
//                        https://f004.backblazeb2.com/file/your-bucket

const endpoint = process.env.B2_ENDPOINT ?? "";
const region = process.env.B2_REGION ?? "us-west-004";
const keyId = process.env.B2_KEY_ID ?? "";
const appKey = process.env.B2_APP_KEY ?? "";

export const B2_BUCKET = process.env.B2_BUCKET ?? "";
export const B2_PUBLIC_BASE_URL = (
  process.env.B2_PUBLIC_BASE_URL ?? ""
).replace(/\/$/, "");

export const isBackblazeConfigured = Boolean(
  endpoint && keyId && appKey && B2_BUCKET
);

let cached: S3Client | null = null;

export function getB2Client(): S3Client {
  if (!cached) {
    cached = new S3Client({
      endpoint,
      region,
      credentials: { accessKeyId: keyId, secretAccessKey: appKey },
      forcePathStyle: true,
    });
  }
  return cached;
}

/** Public URL for a stored object key. */
export function publicUrl(key: string): string {
  if (B2_PUBLIC_BASE_URL) return `${B2_PUBLIC_BASE_URL}/${key}`;
  return `${endpoint}/${B2_BUCKET}/${key}`;
}

/** Upload a file buffer to B2 and return its public URL. */
export async function uploadToB2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  const client = getB2Client();
  await client.send(
    new PutObjectCommand({
      Bucket: B2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return publicUrl(key);
}

export async function deleteFromB2(key: string): Promise<void> {
  const client = getB2Client();
  await client.send(
    new DeleteObjectCommand({ Bucket: B2_BUCKET, Key: key })
  );
}
