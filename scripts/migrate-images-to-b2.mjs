// One-off migration: copy the site's images from the legacy WordPress CDN to
// Backblaze B2, preserving their path so the app can switch over by changing a
// single base URL.
//
// Requires these env vars (same names the app uses — set them in Railway or a
// local .env before running):
//   B2_ENDPOINT, B2_REGION, B2_KEY_ID, B2_APP_KEY, B2_BUCKET
//   B2_PUBLIC_BASE_URL   (public read base, used only to print the result URLs)
//
// Run:  node scripts/migrate-images-to-b2.mjs
// Add   --dry   to list what would be copied without uploading.
//
// After it succeeds, point the app at B2 by setting the CDN constant in
// src/lib/data.ts to the value of B2_PUBLIC_BASE_URL (the keys already match
// the /2023/01/... paths).

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, "..", "src", "lib", "data.ts");
const DRY = process.argv.includes("--dry");

const CONTENT_TYPES = {
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  svg: "image/svg+xml",
};

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return v;
}

// Collect the CDN base and every unique `${CDN}/...` image path from data.ts.
function collectImages() {
  const src = readFileSync(DATA_FILE, "utf8");
  const baseMatch = src.match(/const CDN = "([^"]+)"/);
  if (!baseMatch) throw new Error("Could not find `const CDN` in data.ts");
  const base = baseMatch[1].replace(/\/$/, "");

  const paths = new Set();
  const re = /\$\{CDN\}(\/[^\s`"')]+\.(?:webp|jpg|jpeg|png|gif|svg))/gi;
  let m;
  while ((m = re.exec(src)) !== null) paths.add(m[1]);

  // Key preserves the path but drops the "/wp-content/uploads/" prefix so the
  // B2 object lives at e.g. 2023/01/file.webp.
  return [...paths].map((p) => {
    const url = base + p;
    const key = p.replace(/^\/(wp-content\/uploads\/)?/, "");
    return { url, key };
  });
}

async function main() {
  const items = collectImages();
  console.log(`Found ${items.length} unique image(s) to migrate.\n`);

  if (DRY) {
    for (const { url, key } of items) console.log(`  ${key}  <-  ${url}`);
    console.log("\n(dry run — nothing uploaded)");
    return;
  }

  const endpoint = requireEnv("B2_ENDPOINT");
  const region = process.env.B2_REGION || "us-west-004";
  const bucket = requireEnv("B2_BUCKET");
  const publicBase = (process.env.B2_PUBLIC_BASE_URL || "").replace(/\/$/, "");
  const client = new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId: requireEnv("B2_KEY_ID"),
      secretAccessKey: requireEnv("B2_APP_KEY"),
    },
    forcePathStyle: true,
  });

  let ok = 0;
  const failures = [];
  for (const { url, key } of items) {
    try {
      // Skip if the object already exists (idempotent re-runs).
      try {
        await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
        console.log(`= exists  ${key}`);
        ok++;
        continue;
      } catch {
        /* not found — proceed to upload */
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const ext = key.split(".").pop().toLowerCase();
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: buf,
          ContentType: CONTENT_TYPES[ext] || "application/octet-stream",
        })
      );
      const shown = publicBase ? `${publicBase}/${key}` : key;
      console.log(`+ uploaded ${key}  (${buf.length} bytes)  -> ${shown}`);
      ok++;
    } catch (err) {
      console.error(`! failed   ${key}: ${err.message}`);
      failures.push(key);
    }
  }

  console.log(`\nDone. ${ok}/${items.length} succeeded.`);
  if (failures.length) {
    console.error(`Failed: ${failures.join(", ")}`);
    process.exit(1);
  }
  if (publicBase) {
    console.log(
      `\nNext: set the CDN constant in src/lib/data.ts to "${publicBase}" to serve images from B2.`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
