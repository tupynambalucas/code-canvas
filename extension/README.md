# @codecanvas/extension

> [!NOTE]
> This package contains the core logic for the CodeCanvas Visual Studio Code Extension.

## Configuration

For detailed documentation on the available settings and how to configure them, see
[CONFIG.md](./CONFIG.md).

## Development

### Compilation and Theme Injection

When you run `pnpm run compile`, the build pipeline (`build.ts`):

1. Reads all compiled theme JSON files exported by `@codecanvas-studio/themes`.
2. Copies them into the `dist/themes/` output directory.
3. Automatically updates the `contributes.themes` array in `package.json` with the corresponding
   theme IDs, labels, visual types, and relative `dist` paths.
4. Compiles the TypeScript source code using `esbuild`.

To build the extension, execute:

```bash
pnpm run compile
```
