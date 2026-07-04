export interface BucketConfig {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
}

export interface BucketManifest {
  bucket: {
    assets: {
      push: string[];
      pull: string[];
      build: string[];
    };
  };
}

export interface IAssetDiscoveryService {
  discoverAssets(studioDir: string, folder: string): Promise<string[]>;
}

export interface IAssetUploaderService {
  uploadAsset(filePath: string, key: string): Promise<void>;
}

export interface RemoteAsset {
  key: string;
  size: number;
  etag: string;
}

export interface IAssetSearchService {
  listAssets(prefix: string): Promise<string[]>;
  listAssetsMetadata(prefix: string): Promise<RemoteAsset[]>;
}

export interface IAssetDownloaderService {
  downloadAsset(key: string, destinationPath: string): Promise<void>;
}
