import { loadBucketConfig } from "../../config/env-config.js";
import { GlobAssetDiscoveryService } from "../../services/glob-discovery.service.js";
import { BucketStorageService } from "../../services/bucket-storage.service.js";
import { AssetSyncOrchestrator } from "../../application/sync.orchestrator.js";
import type { BucketManifest } from "../../bucket.interface.js";

export async function executePush(
  studioDir: string,
  manifest: BucketManifest,
): Promise<void> {
  const config = loadBucketConfig();
  const discovery = new GlobAssetDiscoveryService();
  const storageService = new BucketStorageService(config);

  const orchestrator = new AssetSyncOrchestrator(
    discovery,
    storageService,
    storageService,
    storageService,
  );
  await orchestrator.push(studioDir, manifest);
}
