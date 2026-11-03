# fitme

A 14-day food and exercise checklist that installs as an app on phone and laptop.

- Live: https://chiya24.github.io/fitme/
- One static page (`index.html`), with photos in `w/` (Pexels, free licence), icons in `icons/`, `manifest.webmanifest` so it can be installed, and `sw.js` so it works offline.
- Ticks, notes and personal details are kept in the browser on each device (localStorage). Use Settings → Export / Import to move them between devices.
- Food check: **Ask Claude** opens claude.ai with the day filled in. Paste the reply back and the app shows a revised plan.
- After changing `index.html` or the photos, bump `VERSION` in `sw.js` so installed copies update.

General guidance, not medical advice.
