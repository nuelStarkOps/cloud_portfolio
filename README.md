# Nuel Nwokeocha — DevOps & Cloud Architect Portfolio

A hand-rolled, zero-dependency, performance-first personal portfolio. Static HTML + CSS + vanilla JS — no build step, no framework, no runtime. Deploy anywhere (Netlify, Vercel, GitHub Pages, S3, Nginx…).

## Structure

```
index.html                 # single-page site (all content + inline SVG sprite)
assets/css/style.css       # design system (dark navy + electric indigo, terminal/cinematic)
assets/js/main.js          # nav, scrollspy, reveal-on-scroll, typed hero (vanilla JS)
assets/icons/              # simple-icons brand SVGs (source for the inline sprite)
assets/icons/sprite.svg    # generated sprite (symbols) — kept for reference
assets/img/og-image.png    # 1200x630 Open Graph / social share image
assets/favicon-32x32.png   # favicon
assets/apple-touch-icon.png
favicon.svg                # SVG favicon (primary)
robots.txt · sitemap.xml
```

## Run locally

Any static server works:

```bash
python3 -m http.server 8000
# or
npx serve .
```

Then open http://localhost:8000

## Deploy

- **Netlify / Vercel**: drag the folder or connect the repo. Publish directory = repo root. No build command.
- **GitHub Pages**: push to a repo, enable Pages from the branch root.
- **S3 + CloudFront**: `aws s3 sync . s3://<bucket> --delete` (set the index document).

## Customize before you ship

1. **Domain / canonical / OG URLs** — currently `nuelstark.vercel.app`; when you get a custom domain, search `index.html` for `nuelstark.vercel.app` and replace it (also in `robots.txt` and `sitemap.xml`).
2. **X handle** — confirmed: `https://x.com/nuelStarkOps`.
3. **Job timeline** — confirmed: **1 year in cloud & DevOps** (the professional DevOps work was the few months at ScaleUp!!!), plus **5 years prior IT & systems support** (Sub-Sea 9, Apr 2021 – Present).
4. **Add an `assets/img/headshot.jpg`** and swap the monogram logo if you ever want a photo.

## Fonts & icons

- Fonts: Space Grotesk / Inter / JetBrains Mono via Google Fonts (preconnected, `display=swap`).
- Icons: inline SVG sprite (Simple Icons) — zero external requests, colorable via CSS.
