# attiva. site handoff

The site is built and checked. It is not deployed yet. This file is for a local Claude session on the user's own machine, which has the Porkbun desktop extension and an open network.

## State

- Site folder: `attiva/` (index.html, styles.css, fonts/, favicon/, video/, netlify.toml). Plain static, no build step.
- Branch: `claude/attiva-website-build-77bl0s`. Draft PR: https://github.com/ReganHines/miniature-robot/pull/24
- Netlify project already created and public: `attiva-site`, id `e8f66742-04f0-4f40-b35d-8f43cffde5e6`, https://app.netlify.com/projects/attiva-site
- The repo root holds a different site (Miniature Robot). Do not touch it. Deploy only the `attiva/` folder.
- Checked at 360, 768 and 1280px: no horizontal scroll, no console errors, no third-party requests, every heading ends in a full stop.
- Video playback was not tested in a browser (the cloud sandbox had no H.264 decoder). Press play on both videos once the site is live.

## To do

1. Deploy `attiva/` to Netlify site `attiva-site` and confirm https://attiva-site.netlify.app loads, both videos play, and the favicon shows.
2. Add `attiva.tech` as a custom domain on the Netlify project.
3. With the Porkbun extension, for `attiva.tech`:
   - ALIAS on the apex pointing to `apex-loadbalancer.netlify.com`
   - CNAME `www` pointing to `attiva-site.netlify.app`
   - Email forward: `hello@attiva.tech` to `hello@regan-hines.com`
4. Once the forward works, add this line under "Christchurch, New Zealand" in the Contact section of `attiva/index.html`, then redeploy:
   `<p><a href="mailto:hello@attiva.tech">hello@attiva.tech</a></p>`
5. Check https://attiva.tech over HTTPS once Netlify has issued the certificate.

## Open items for the user

- No photos on the People cards. The brief says none. Only Regan's portrait exists (`website/public/images/regan-hines-portrait.jpg` in the `attivo-nz` repo). No photo of Graham was found anywhere.
- Rules for the copy: NZ English, no em dashes, no section symbols, "attiva." always with the full stop, no new copy beyond the brief.
