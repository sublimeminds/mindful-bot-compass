
# Application Icons

This directory contains the application icons for different platforms:

- `icon.ico` - Windows icon (256x256 or multiple sizes)
- `icon.icns` - macOS icon bundle
- `icon.png` - Linux icon (512x512 recommended)

## Generating Icons

You can use online tools or the `electron-icon-builder` package to generate icons from a single source image:

```bash
npm install --save-dev electron-icon-builder
npx electron-icon-builder --input=source-icon.png --output=public/icons/
```

## Fallback Behavior

If custom icons are not provided, the default Electron icon will be used automatically.
