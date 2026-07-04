import path from "path";
import crypto from "crypto";
import fs from "fs";
import type {
  IAssetDiscoveryService,
  IAssetUploaderService,
  IAssetDownloaderService,
  IAssetSearchService,
  BucketManifest,
} from "../bucket.interface.js";

function getLocalFileMetadata(filePath: string): { size: number; md5: string } {
  const stats = fs.statSync(filePath);
  const content = fs.readFileSync(filePath);
  const md5 = crypto.createHash("md5").update(content).digest("hex");
  return { size: stats.size, md5 };
}

export class AssetSyncOrchestrator {
  constructor(
    private discoveryService: IAssetDiscoveryService,
    private uploaderService: IAssetUploaderService,
    private downloaderService: IAssetDownloaderService,
    private searchService: IAssetSearchService,
  ) {}

  async push(studioDir: string, manifest: BucketManifest): Promise<void> {
    console.info("Starting Cloudflare R2 push synchronization...");

    const pushFolders = manifest.bucket.assets.push;
    console.info(
      `Found ${pushFolders.length} folders to synchronize:`,
      pushFolders,
    );

    for (const folder of pushFolders) {
      const cleanFolder = folder.replace(/^\//, "");
      const folderPrefix = cleanFolder;

      const remoteFilesMap = new Map<string, { size: number; etag: string }>();
      try {
        const remoteAssets =
          await this.searchService.listAssetsMetadata(folderPrefix);
        for (const asset of remoteAssets) {
          remoteFilesMap.set(asset.key, { size: asset.size, etag: asset.etag });
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(
          `Could not list remote assets for prefix ${folderPrefix}:`,
          message,
        );
      }

      const files = await this.discoveryService.discoverAssets(
        studioDir,
        folder,
      );
      console.info(`Folder ${folder}: Found ${files.length} local assets.`);

      for (const file of files) {
        const filePath = path.join(studioDir, file);

        let keyPath = file;
        if (file.startsWith("src/") === true) {
          keyPath = file.substring(4);
        }

        const key = keyPath;

        try {
          const localMeta = getLocalFileMetadata(filePath);
          const remoteMeta = remoteFilesMap.get(key);

          if (remoteMeta !== undefined) {
            if (
              remoteMeta.size === localMeta.size &&
              remoteMeta.etag === localMeta.md5
            ) {
              console.info(`[Skip] ${file} is already up to date on R2.`);
              continue;
            }
          }

          console.info(`Uploading ${file} to R2 with key: ${key}...`);
          await this.uploaderService.uploadAsset(filePath, key);
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : String(error);
          console.error(`Failed to sync/upload ${file}:`, message);
        }
      }
    }
    console.info("R2 Push synchronization completed.");
  }

  async pull(studioDir: string, manifest: BucketManifest): Promise<void> {
    console.info("Starting Cloudflare R2 pull synchronization...");

    const pullFolders = manifest.bucket.assets.pull;
    console.info(
      `Found ${pullFolders.length} folders to download:`,
      pullFolders,
    );

    for (const folder of pullFolders) {
      const cleanFolder = folder.replace(/^\//, "");
      const folderPrefix = cleanFolder;

      console.info(
        `Querying Cloudflare R2 objects for prefix: ${folderPrefix}...`,
      );
      try {
        const remoteAssets =
          await this.searchService.listAssetsMetadata(folderPrefix);
        console.info(
          `Folder ${folder}: Found ${remoteAssets.length} assets on Cloudflare R2.`,
        );

        for (const asset of remoteAssets) {
          const key = asset.key;
          const relativePath = key;
          const destinationPath = path.join(studioDir, "src", relativePath);

          try {
            if (fs.existsSync(destinationPath) === true) {
              const localMeta = getLocalFileMetadata(destinationPath);
              if (
                localMeta.size === asset.size &&
                localMeta.md5 === asset.etag
              ) {
                console.info(
                  `[Skip] Key: ${key} is already up to date locally.`,
                );
                continue;
              }
            }

            console.info(`Downloading key: ${key} -> ${destinationPath}`);
            await this.downloaderService.downloadAsset(key, destinationPath);
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : String(error);
            console.error(`Failed to sync/download ${key}:`, message);
          }
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Failed to list/sync prefix ${folderPrefix}:`, message);
      }
    }
    console.info("R2 Pull synchronization completed.");
  }
}
