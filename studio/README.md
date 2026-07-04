# @codecanvas-studio/assets - Design & Automation Hub

This workspace centralizes brand identity management, design assets, and self-hosted collaborative design tools for the CodeCanvas project.

## Detailed Documentation

Technical documentation is centralized in our [Knowledge Base](https://codecanvas-docs.pages.dev):

- [Studio Workspace Overview](https://codecanvas-docs.pages.dev/studio): Strategy, visual language, and coded constants.
- [Design System & Tokens](https://codecanvas-docs.pages.dev/docs/engineering/styleguide): Detailed specifications for colors, typography, and UI patterns.
- [Design Engineering](https://codecanvas-docs.pages.dev/studio): Infrastructure, S3 configuration, and design workflows with Penpot.

## Configuration

### Core Design Platform (Penpot)

Before running the collaborative design services, you must create a `.env` file in the `studio` directory:

```bash
# Path: studio/.env

# PENPOT Main Configuration
PENPOT_SECRET_KEY=generate_a_secure_random_string
PENPOT_DATABASE_URI=postgresql://user:password@host:port/database?sslmode=require
PENPOT_DATABASE_USERNAME=your_db_user
PENPOT_DATABASE_PASSWORD=your_db_password

# PENPOT Object Storage (S3)
PENPOT_BUCKET_NAME=your_bucket_name
PENPOT_BUCKET_ACCESS_ID=your_access_key_id
PENPOT_BUCKET_SECRET_KEY=your_secret_access_key
```

### R2 Asset Sync System (Bucket)

For synchronizing web-ready assets (e.g., icons, textures, images, and raw source archives) directly with Cloudflare R2, configure the environment variables in `studio/bucket/.env.studio.bucket`:

```bash
# Path: studio/bucket/.env.studio.bucket

S3_API=https://your-cloudflare-r2-endpoint.r2.cloudflarestorage.com/your-bucket-name
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_R2_PUBLIC_URL=https://your-public-cdn-url.r2.dev
```

## Quick Start (Operation Scripts)

Manage the Studio environment using standardized scripts from the project root:

### Core Studio Services (Penpot)

```bash
pnpm penpot:up        # Launch Penpot collaborative editor at http://localhost:9005
pnpm penpot:down      # Shutdown core docker containers
pnpm penpot:update    # Pull latest images and restart
pnpm penpot:reset     # Force complete container and volume recreation
```

### AI Automation & Helpers

```bash
pnpm penpot:aide:up   # Launch Penpot AI assistant (aide) integration
pnpm penpot:aide:down # Stop the Penpot AI assistant container
```

### Cloudflare R2 Asset Sync

```bash
pnpm studio:bucket      # Launch the interactive R2 synchronization menu (Push/Pull/Exit)
```

## Directory Structure

- `studio/penpot/`: Docker orchestration and self-hosted Penpot setup.
- `studio/bucket/`: Cloudflare R2 asset synchronization engine and S3 SDK integration.
- `studio/assets/sources/`: Raw heavy design vector/binary archives.
- `studio/src/icons/`: Scoped SVG canonical React icon wrappers.
- `studio/src/tokens/`: Brand color, typography, and variable design token definitions.
