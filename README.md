# Baker's % App

Tiny static baker's percentage calculator.

## Inputs
- Desired total flour (g)
- Hydration (%)
- Salt (%)
- Starter weight (g)
- Starter hydration (%) (default 100)

## Output
- Flour to add
- Water to add
- Salt to add
- Total dough weight

No backend, no database.

## Install and offline use

Open the deployed site in Chrome on Android and tap **Install app**, then confirm
in the browser prompt. If the prompt is not available yet, the button explains
how to install from the browser menu. From Telegram, open the link in Chrome.
On iPhone/iPad, use Safari → Share → Add to Home Screen.

The page displays **Ready to use offline** once the service worker has cached
all app files. After that, the calculator can reopen without a connection.
Inputs currently reset to their defaults when the app is reopened.

### PWA files

- `manifest.webmanifest`: app identity, standalone launch, and icons.
- `pwa.js`: progressive install prompt, manual instructions, worker registration.
- `sw.js`: versioned offline cache, network-first page navigation.
- `icons/`: regular/maskable PNGs and Apple touch icon.
- `vercel.json`: worker revalidation and manifest response headers.

No build step or runtime dependencies. Serve locally with `python3 -m http.server`.
When changing cached assets, bump `CACHE` in `sw.js`. Updated workers activate
once all windows using the old worker close; reopen online to receive updates.
