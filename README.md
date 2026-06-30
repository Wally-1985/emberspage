# Embers and Ash — Woodfired Pizza

Marketing site for Embers and Ash, a Brisbane-based mobile woodfired pizza stall
for weddings, festivals, corporate events and private parties.

Plain HTML/CSS/JS — no build step, no framework. Open `index.html` in a
browser or serve the folder with any static file server.

## Structure

```
embers-and-ash/
├── index.html          Single-page site (hero, story, menu, events, gallery, inquiry form)
├── css/style.css        All styling — design tokens at the top of the file
├── js/main.js            Nav, ember animation, inquiry form handling
└── assets/images/        Logo files + favicons
```

## Local development

```bash
# from inside the embers-and-ash folder
python3 -m http.server 8000
# then open http://localhost:8000
```

Any static server works (`npx serve`, VS Code Live Server, etc).

## Adding real photos

The "About", "Events" and "Gallery" sections currently use placeholder
texture blocks instead of photos (no images were supplied yet). To swap them
in:

1. Drop image files into `assets/images/` (e.g. `stall.jpg`, `wedding-1.jpg`).
2. In `index.html`, replace the relevant placeholder `<div class="about-art">`
   or `<div class="g-item">` with an `<img>` tag pointing at your file.
3. Compress images first (e.g. with [squoosh.app](https://squoosh.app)) —
   aim for under ~300KB each so the site stays fast.

## Connecting the inquiry form

The booking form on the page validates and shows a confirmation, but has no
backend wired up yet — out of the box it falls back to opening a pre-filled
email to `admin@embersandash.com.au`. To make it submit silently instead,
open `js/main.js` and follow the instructions in the comment above
`FORM_ENDPOINT`. The simplest no-backend options are form services like
Formspree or Web3Forms — sign up, paste the endpoint URL into
`FORM_ENDPOINT`, and uncomment the fetch call.

## Suggested workflow: GitHub → dev → Binary Lane + Cloudflare

This repo is set up so you can develop locally, push to GitHub, preview on a
dev/staging environment, and only push to the live Binary Lane server when
you're happy with it.

**1. GitHub**
- This repo is already connected to `origin` →
  [Wally-1985/emberspage](https://github.com/Wally-1985/emberspage).
  Push your local `main` branch up with:
  ```bash
  git push -u origin main
  ```
  (You'll be prompted to authenticate with GitHub — a personal access token
  or the GitHub CLI/credential manager, whichever you normally use.)
- Optionally create a `dev` branch for work in progress.

**2. Dev/staging preview** — pick one:
- **GitHub Pages**: enable Pages on the `dev` branch in repo settings for a
  free preview URL with zero extra setup (since this is a static site, it
  works as-is).
- **Cloudflare Pages**: connect the repo, set the `dev` branch to auto-deploy
  to a preview URL, keep `main` separate for production.
- A staging subdomain (e.g. `dev.embersandash.com.au`) pointed at a folder on
  the same Binary Lane server.

**3. Production — Binary Lane**
- Spin up a small VPS on Binary Lane (a basic plan is plenty for a static
  site) running Ubuntu + Nginx (or Apache).
- Clone this repo onto the server, point Nginx's document root at the repo
  folder.
- When you're ready to publish a change: `git pull` on the server to update
  to the latest `main`. This can be a manual step, or automated with a
  GitHub Action that SSHs in and runs `git pull` + reloads Nginx whenever you
  push to `main` — let me know if you'd like that workflow set up.

**4. Cloudflare**
- Add `embersandash.com.au` to Cloudflare, update your domain's nameservers
  at your registrar to Cloudflare's.
- Create an `A` record pointing `@` (and `www`) at the Binary Lane server's
  IP address.
- Set SSL/TLS mode to **Full (strict)** once you've got a certificate on the
  server (e.g. via free Let's Encrypt/Certbot), or **Full** in the meantime.
- Turn on "Always Use HTTPS" and enable caching for static assets.

I haven't provisioned anything on Binary Lane or Cloudflare yet — happy to
walk through server setup, Nginx config, and the GitHub Action for
auto-deploy whenever you're ready to go live.
