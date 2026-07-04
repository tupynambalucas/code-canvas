# Configuration Guide — CodeCanvas

This document details all configuration options available for **CodeCanvas**. All settings are managed under the `codecanvas` namespace in your `settings.json`.

## Basic Structure

The core of the configuration is the `codecanvas.ui` object. A global `codecanvas.enabled` flag allows you to quickly turn the extension's background features on or off.

```json
{
  "codecanvas.enabled": true, // Global switch for all background features
  "codecanvas.ui": {
    "fullscreen": false,
    "background": {
      // Background settings for different areas go here
    }
  }
}
```

---

## Fullscreen Mode

Fullscreen mode applies a single, unified background across the entire VS Code window, ignoring per-area settings. This is ideal for a seamless wallpaper.

**Activation**: Set `"fullscreen": true`.

```json
{
  "codecanvas.ui": {
    "fullscreen": true,
    "background": {
      "fullscreen": {
        "images": [
          "file:///path/to/your/image.jpg",
          "https://example.com/some-wallpaper.png"
        ],
        "random": true, // Optional: shuffle the images
        "interval": 900, // Optional: switch image every 15 minutes (in seconds)
        "opacity": 0.15, // Main background opacity
        "size": "cover", // CSS background-size property
        "position": "center" // CSS background-position property
      }
    }
  }
}
```

---

## Sectioned Mode (Default)

This mode provides granular control, allowing you to set different backgrounds for the **Editor**, **Sidebar**, **Panel**, and **Secondary View**.

**Activation**: Set `"fullscreen": false` (or omit it, as it's the default).

```json
{
  "codecanvas.ui": {
    "fullscreen": false,
    "background": {
      // Editor configuration
      "editor": {
        "images": ["file:///path/to/code-background.png"],
        "useFront": true,
        "style": {
          "opacity": "0.08",
          "background-position": "right bottom",
          "background-size": "auto",
          "background-repeat": "no-repeat"
        }
      },

      // Sidebar configuration
      "sidebar": {
        "images": ["file:///path/to/sidebar-texture.png"],
        "opacity": 0.05,
        "size": "cover",
        "position": "center"
      },

      // Panel configuration (Terminal, Output, etc.)
      "panel": {
        "images": [], // An empty array disables the background for this area
        "opacity": 0.1
      },

      // Secondary View configuration (e.g., Test Explorer, second sidebar)
      "secondarybar": {
        "images": ["file:///path/to/secondary-bg.jpg"],
        "opacity": 0.1,
        "size": "cover"
      }
    }
  }
}
```

---

## Automatic Theme Integration

CodeCanvas can automatically apply background settings provided by a VS Code theme. If a theme includes a `backgroundConfig` object in its `theme.json` file, CodeCanvas will detect and apply it when the theme is activated.

This allows theme authors to create a complete visual experience out of the box.

### For Theme Developers

To integrate your theme with CodeCanvas, add a `backgroundConfig` key to your theme's JSON file. The structure of this object is identical to the `codecanvas.ui.background` object.

**Example (`your-theme.json`):**

```json
{
  "name": "My Awesome Theme",
  "type": "dark",
  "colors": {
    "editor.background": "#1A1A1A"
    // ... other theme colors
  },
  "backgroundConfig": {
    "editor": {
      "images": [
        "https://res.cloudinary.com/deqmqcdww/image/upload/v1767592000/karmets_biohtu.png"
      ],
      "style": {
        "opacity": "0.1",
        "background-size": "cover",
        "background-position": "center"
      }
    },
    "sidebar": {
      "images": ["file:///path/to/your/theme/sidebar.png"],
      "opacity": 0.05
    }
  }
}
```

When a user with CodeCanvas installed selects "My Awesome Theme," these background settings will be applied automatically.

---

## Property Reference

### Top-Level

| Property             | Type      | Description                                            |
| -------------------- | --------- | ------------------------------------------------------ |
| `codecanvas.enabled` | `boolean` | Globally enables or disables all background rendering. |
| `codecanvas.ui`      | `object`  | The main container for all UI and background settings. |

### `codecanvas.ui` Object

| Property     | Type      | Description                                                     |
| ------------ | --------- | --------------------------------------------------------------- |
| `fullscreen` | `boolean` | If `true`, enables global fullscreen mode. Defaults to `false`. |
| `background` | `object`  | Contains the configuration for all background areas.            |

### `background` Object

This object holds the settings for either **fullscreen** mode or **sectioned** mode.

- **In Fullscreen Mode (`fullscreen: true`)**: The properties are applied directly to the `background.fullscreen` object.
- **In Sectioned Mode (`fullscreen: false`)**: The properties are applied within sub-objects: `editor`, `sidebar`, `panel`, or `secondarybar`.

#### Configuration Types

There are two distinct ways to configure areas:

**1. Standard Configuration**
_Used by: `sidebar`, `panel`, `secondarybar`, `fullscreen`_

These areas use simple, top-level properties to control appearance.

| Property   | Type       | Default  | Description                                                     |
| ---------- | ---------- | -------- | --------------------------------------------------------------- |
| `images`   | `string[]` | `[]`     | An array of image URLs (local `file:///` or remote `https://`). |
| `opacity`  | `number`   | `0.1`    | The background transparency (0.0 - 1.0).                        |
| `size`     | `string`   | `cover`  | CSS `background-size` (e.g., `cover`, `contain`, `100% 100%`).  |
| `position` | `string`   | `center` | CSS `background-position` (e.g., `center`, `top right`).        |
| `random`   | `boolean`  | `false`  | If `true`, shuffles the `images` array for random playback.     |
| `interval` | `number`   | `0`      | Time in seconds for image rotation (carousel). `0` disables it. |

**2. Editor Configuration**
_Used by: `editor` only_

The editor is more complex and requires CSS properties to be defined inside a `style` object.

| Property   | Type       | Default | Description                                                                                                              |
| ---------- | ---------- | ------- | ------------------------------------------------------------------------------------------------------------------------ |
| `images`   | `string[]` | `[]`    | An array of image URLs.                                                                                                  |
| `style`    | `object`   | `{}`    | **Container for CSS properties.** definitions like `opacity`, `background-size`, and `background-position` MUST go here. |
| `useFront` | `boolean`  | `true`  | If `true`, renders the background on top of the editor content (useful for transparent images).                          |
| `random`   | `boolean`  | `false` | If `true`, shuffles the `images` array.                                                                                  |
| `interval` | `number`   | `0`     | Time in seconds for image rotation.                                                                                      |

---

## Frequently Asked Questions

**Q: My images are not showing up.**
**A:** First, check the developer console (`Help > Toggle Developer Tools`) for any errors from CodeCanvas. Then, verify the following:

- Local file paths must be absolute and start with `file:///`.
- Remote URLs must be accessible from your machine.
- If you've just changed the settings, run the command `CodeCanvas: Install / Enable` and reload VS Code when prompted.

**Q: VS Code says my installation is "corrupted". Is this safe?**
**A:** Yes, this is expected. To apply backgrounds, CodeCanvas must modify one of VS Code's core files. This modification triggers a checksum warning. The extension includes a patch to hide this notification. You can safely dismiss the initial warning.

**Q: How do I completely uninstall the background modifications?**
**A:** Run the `CodeCanvas: Uninstall Patch` command from the Command Palette (`Ctrl+Shift+P`). This will restore the original VS Code file and remove all injected styles. You will be prompted to reload.

**Q: Will this slow down my VS Code?**
**A:** The performance impact is minimal. The extension injects a small amount of CSS and JavaScript. Using very large, unoptimized images may have a slight impact on startup time, but it should not affect editing performance.

**Q: How do I disable the backgrounds temporarily?**
**A:** Run the `CodeCanvas: Disable` command. This will turn off the backgrounds without requiring an uninstall and reload. To re-enable, run `CodeCanvas: Install / Enable`.
