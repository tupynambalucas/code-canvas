import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { BucketConfig } from "../bucket.interface.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadBucketConfig(): BucketConfig {
  const bucketEnvPath = path.resolve(__dirname, "../.env.studio.bucket");
  if (fs.existsSync(bucketEnvPath) === true) {
    dotenv.config({ path: bucketEnvPath });
  }

  const envPath = path.resolve(__dirname, "../../.env");
  if (fs.existsSync(envPath) === true) {
    dotenv.config({ path: envPath });
  } else {
    const rootEnvPath = path.resolve(__dirname, "../../../../.env.dev");
    if (fs.existsSync(rootEnvPath) === true) {
      dotenv.config({ path: rootEnvPath });
    } else {
      dotenv.config();
    }
  }

  let accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  let bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  const publicUrl =
    process.env.VITE_CLOUDFLARE_R2_PUBLIC_URL ??
    process.env.CLOUDFLARE_R2_PUBLIC_URL;

  const s3ApiUrl = process.env.S3_API;
  if (s3ApiUrl !== undefined && s3ApiUrl !== "") {
    const match =
      /^https:\/\/([a-f0-9]+)\.r2\.cloudflarestorage\.com\/([a-zA-Z0-9\-_]+)$/.exec(
        s3ApiUrl,
      );
    if (match !== null) {
      if (accountId === undefined || accountId === "") {
        accountId = match[1];
      }
      if (bucketName === undefined || bucketName === "") {
        bucketName = match[2];
      }
    }
  }

  if (
    accountId === undefined ||
    accountId === "" ||
    accessKeyId === undefined ||
    accessKeyId === "" ||
    secretAccessKey === undefined ||
    secretAccessKey === "" ||
    bucketName === undefined ||
    bucketName === ""
  ) {
    throw new Error(
      "Configuration Error: Missing Cloudflare R2 environment variables.",
    );
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicUrl: publicUrl ?? "",
  };
}
