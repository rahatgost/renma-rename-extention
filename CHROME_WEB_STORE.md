# Chrome Web Store Listing — Renma

Copy-paste-ready assets for submitting Renma to the Chrome Web Store.

## Store name
Renma — Auto-name image downloads

## Short description (≤132 chars)
Auto-rename every image download by source domain. AI images tagged, everything else clean. Local-only, zero telemetry.

## Detailed description

Every time Chrome saves an image, Renma rewrites the filename before it hits your disk.

No more `image (17).png`. No more digging through Downloads to figure out where a screenshot came from. Renma reads the source domain and renames the file the moment it lands — `openai.com_1738273821.png`, `figma.com_1738273899.jpg`, done.

**What Renma does**
• Renames every image download by its source domain
• Tags AI-generated images (ChatGPT, DALL·E, Midjourney sources) with `AI_Generated_`
• Lets you write custom naming templates: `{domain}_{date}_{width}x{height}`
• Routes downloads into subfolders per domain, if you want
• Detects duplicates before overwriting
• Undoes the last rename with one shortcut (Ctrl/⌘+Shift+U)
• Keeps a history of the last 5 renames in the popup
• Right-click any image to save it with the current template

**Privacy, on record**
• Nothing leaves your browser. No analytics inside the extension. No accounts.
• The only network calls Renma makes are optional dimension lookups for images you're already downloading.
• Full source on GitHub.

**Made for**
Designers grabbing references. Researchers archiving screenshots. Anyone whose Downloads folder has become a graveyard of unnamed PNGs.

## Category
Productivity

## Language
English

## Screenshot captions (1280×800, 5 required)
1. `01-hero.png` — Every image, named the moment it lands
2. `02-popup.png` — See your last 5 renames without opening a folder
3. `03-options.png` — Custom domain → prefix mappings, in one place
4. `04-template.png` — Write your own naming template. {domain}_{date}_{width}x{height} — your call
5. `05-context.png` — Right-click any image to save with your rules

## Small promo tile (440×280)
Use `public/og-image.jpg` cropped to 440×280 with the wordmark centered.

## Marquee promo tile (1400×560) — optional
Cream background, oversized italic "renma." wordmark left-aligned, tagline "Every image, named the moment it lands" below, coral square logo bottom-right.

## Icon (128×128)
`extension/icon-128.png`

## Justifications (permission review)

**`downloads` permission**
Renma listens to `chrome.downloads.onDeterminingFilename` to rewrite image filenames as they're saved. Without this permission the extension cannot rename anything.

**`storage` permission**
Used to persist the user's custom domain mappings, naming template, stats, and the popup history log. All storage is local (`chrome.storage.local`) — nothing syncs to Google, nothing leaves the device.

**Host permissions (`<all_urls>`)**
Required to read the source URL of image downloads across every site the user visits. Renma does not inject scripts into pages; it only reads the download's `finalUrl` / `referrer` metadata provided by Chrome.

**Remote code**
None. All code ships in the bundle.

**Data collection**
None. Renma does not collect, transmit, or sell any user data.

## Support URLs
- Homepage: https://renma.flinkeo.online
- Support: https://renma.flinkeo.online/report
- Privacy: https://renma.flinkeo.online/privacy

## Version
Match `extension/manifest.json` `version` field on every submission.

## Submission checklist
- [ ] Bump `version` in `extension/manifest.json`
- [ ] Rebuild `public/smart-image-renamer.zip`
- [ ] 5 screenshots at 1280×800
- [ ] Small promo tile 440×280
- [ ] Icon 128×128 embedded in the zip
- [ ] Justifications above pasted into the permission review form
- [ ] Privacy URL points to `/privacy`
