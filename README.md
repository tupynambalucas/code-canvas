<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
  
# CodeCanvas - Dynamic Backgrounds and Themes for VS Code

![Logo](./icon.png)

> [!NOTE]
> CodeCanvas is a Visual Studio Code extension that revolutionizes your workspace by integrating a powerful background and theming system. It allows you to add custom backgrounds to different parts of the UI, automatically integrates with your favorite themes, and provides a unified system for a personalized coding environment.

</div>

<div style="display: flex; flex-direction: column; align-items: left; text-align: left; justify-content: center;">

## Features

- **Multiple Background Modes**:
  - **Fullscreen**: Apply a single, global wallpaper across the entire VS Code window.
  - **Sectioned**: Set distinct backgrounds for the `editor`, `sidebar`, `panel`, and `secondarybar` (Secondary View) for granular control.
- **Image Carousel**: Display multiple images in a rotation, with configurable intervals and random shuffle support.
- **Automatic Theme Integration**: Themes can bundle their own background configurations using the `backgroundConfig` property, which CodeCanvas will automatically detect and apply.
- **Unified Configuration**: All settings are managed under a single, intuitive `codecanvas.ui` object in your `settings.json`.
- **Safe and Reversible Patching**: CodeCanvas modifies a core VS Code file to inject styles safely. It automatically creates backups and provides a one-click `Uninstall Patch` command to revert all changes.
- **Developer-Friendly**: An API is available for other extensions to programmatically control backgrounds.

## Installation and Usage

1. **Install from Marketplace** (Recommended)
   - Open the Extensions view in VS Code.
   - Search for "CodeCanvas" and click **Install**.

2. **Enable Backgrounds**
   - Open the Command Palette.
   - Run the command `CodeCanvas: Install / Enable`.
   - VS Code will prompt you to restart. Click "Restart" to apply the patch.

3. **Configure Your Backgrounds**
   - Open your `settings.json` file and add your configuration to the `codecanvas.ui` object.
     Refer to [CONFIG.md](./extension/CONFIG.md) for detailed configuration options.

### Example: Fullscreen Mode

```json
{
  "codecanvas.enabled": true,
  "codecanvas.ui": {
    "fullscreen": true,
    "background": {
      "fullscreen": {
        "images": ["https://example.com/wallpaper.jpg"],
        "opacity": 0.15,
        "size": "cover"
      }
    }
  }
}
```

### Example: Sectioned Mode

```json
{
  "codecanvas.enabled": true,
  "codecanvas.ui": {
    "fullscreen": false,
    "background": {
      "editor": {
        "images": ["https://example.com/editor-bg.png"],
        "position": "right bottom",
        "style": {
          "opacity": "0.1",
          "background-position": "right bottom",
          "background-size": "auto"
        }
      },
      "sidebar": {
        "images": ["https://example.com/sidebar-texture.png"],
        "opacity": 0.05
      },
      "panel": { "images": [] },
      "secondarybar": { "images": [] }
    }
  }
}
```

After saving your changes, CodeCanvas will prompt you to reload for the new settings to take effect.

## Available Commands

- `CodeCanvas: Install / Enable`: Installs the patch and enables backgrounds.
- `CodeCanvas: Uninstall Patch`: Completely and safely removes all modifications.
- `CodeCanvas: Disable`: Temporarily disables backgrounds without uninstalling the patch.
- `CodeCanvas: Info`: Shows whether the patch is currently installed.

## Project Structure

```text
CodeCanvas/
├── extension/
│   ├── package.json
│   └── src/
│   ├── extension.ts
│   ├── theme-integration.ts
│   ├── background/
│   │   ├── Background.ts
│   │   ├── PatchGenerator.ts
│   │   └── PatchFile.ts
│   ├── themes/
│   └── utils/
└── package.json
```

## Development

This repository contains guidance documents for automated AI agents to assist with development. Reference [AGENTS.md](./AGENTS.md) for details.

### Creating a Theme with Integrated Backgrounds

You can create a VS Code theme that specifies its own recommended backgrounds.

1. **Add a `backgroundConfig` key** to your theme's `.json` file. The structure is identical to the `codecanvas.ui.background` object.

   ```json
   {
     "name": "My Awesome Theme",
     "type": "dark",
     "colors": {},
     "backgroundConfig": {
       "editor": {
         "images": ["https://my-cdn.com/theme-bg.png"],
         "opacity": 0.12,
         "size": "cover"
       }
     }
   }
   ```

2. **How it Works**: When a user with CodeCanvas activates your theme, the extension will automatically read and apply the `backgroundConfig` settings.

### Local Build

```bash
git clone https://github.com/tupynambalucas/CodeCanvas.git
cd CodeCanvas
npm install
npm run compile
```

## Roadmap

- Unified configuration system (`codecanvas.ui`)
- Fullscreen and sectioned background modes
- Image carousel with interval and randomization
- Automatic theme integration via `backgroundConfig`
- Safe patching with `Install` and `Uninstall` commands
- Support for `secondarybar` (Secondary View)

## Author

Tupynambá Lucas

- GitHub: [@tupynambalucas](https://github.com/tupynambalucas)

## License

MIT License - See the [LICENSE](./LICENSE) file for details.

</div>
