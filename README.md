# Renma — Smart Image Renamer

Renma is a Manifest V3 Chrome extension that automatically gives downloaded images clean, searchable filenames the moment Chrome saves them.

## What changed in this branch

- **Advanced popup UI** — premium command-center layout, quick stats, filters, search, one-click site skipping, export, and undo.
- **Better naming engine** — richer AI host detection, default `date + time + counter` template, optional AI folder routing, safer filename length limits, case controls, and recent cache support.
- **Local-first workflow** — history, rules, stats, and backups stay in `chrome.storage.local`.
- **Professional Remotion video** — product promo source lives in `product-video/` and renders a 48-second 1080p launch video.

## Install locally

1. Download or clone this repository.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the `extension/` folder.

## Extension features

- Source-domain prefixes: `unsplash_...jpg`, `dribbble_...webp`, etc.
- AI-source detection for OpenAI, ChatGPT, oaiusercontent, Midjourney, Leonardo, Stability, Ideogram, and Fal.
- Custom template tokens: `{prefix}`, `{domain}`, `{date}`, `{time}`, `{counter}`, `{dimensions}`, `{ext}`, and more.
- Optional date folders and domain-specific folders.
- Duplicate modes: off, tag, or skip.
- Popup search, filters, JSON export, and undo.
- Options-page backup and restore.

## Render the product video

The promo video is built with Remotion and lives in `product-video/`.

```sh
cd product-video
npm install
npm run render
```

Output: `product-video/out/renma-product-video.mp4`

## Development

```sh
npm i
npm run dev
npm run build
```

## Privacy

Renma does not upload your downloads, filenames, rules, or stats. Extension data stays inside the browser's local storage.