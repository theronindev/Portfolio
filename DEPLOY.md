# Deploying to GitHub + Cloudflare Pages

A walkthrough for getting **theronindev.com** live on Cloudflare Pages for free.

Everything here is free. Cloudflare Pages' free plan gives you unlimited bandwidth,
unlimited requests, and 500 builds per month. There is no credit card required and
no trial that expires.

---

## How the pieces fit together

```
  your laptop                GitHub                     Cloudflare Pages
  ───────────                ──────                     ────────────────
  edit index.html
  git commit        ──push──▶  theronindev/Portfolio
                                      │
                                      │  webhook on every push to main
                                      ▼
                                             runs: npm install && npm run build
                                             serves: dist/
                                                    │
                                                    ▼
                                      theronindev.pages.dev  (free, instant)
                                      theronindev.com        (once DNS moves)
```

The important idea: **you never upload a build yourself.** You push source code to
GitHub, and Cloudflare builds it for you in a clean container. That is why `dist/`
is in `.gitignore` and should stay there.

---

## Phase 1 — Get it live today on pages.dev

### Step 1. Push your code to GitHub

The remote is already set up, pointing at `github.com/theronindev/Portfolio`.

```bash
cd C:/P/portfolio
git status                # see what changed
git add -A
git commit -m "Update portfolio: Flutter transition, full-stack positioning"
git push -u origin main
```

If the push is rejected because the remote has commits you do not have locally:

```bash
git pull --rebase origin main
git push origin main
```

If GitHub asks for a password, it will not accept your account password. Use a
Personal Access Token instead: GitHub → Settings → Developer settings →
Personal access tokens → Tokens (classic) → Generate new token, tick the `repo`
scope, and paste the token in place of the password. Or install
[GitHub CLI](https://cli.github.com/) and run `gh auth login` once.

### Step 2. Create the Cloudflare Pages project

1. Sign up or log in at [dash.cloudflare.com](https://dash.cloudflare.com).
2. In the left sidebar choose **Workers & Pages**.
3. Click **Create** → the **Pages** tab → **Connect to Git**.
4. Click **Connect GitHub**, authorise Cloudflare, and choose **Only select
   repositories** → `Portfolio`. Granting access to a single repo is enough.
5. Select the `Portfolio` repository and click **Begin setup**.

### Step 3. Build settings

This is the only screen where a wrong value costs you a failed deploy. Use exactly:

| Field | Value |
|---|---|
| Project name | `theronindev` |
| Production branch | `main` |
| Framework preset | `Vite` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(leave empty)* |

Then expand **Environment variables (advanced)** and add one:

| Variable | Value |
|---|---|
| `NODE_VERSION` | `20` |

Pin the Node version deliberately. Without it Cloudflare picks a default that can
change under you, and a build that worked last month starts failing for no visible
reason.

Click **Save and Deploy**. The first build takes about a minute. When it finishes
your site is live at:

```
https://theronindev.pages.dev
```

### Step 4. Confirm it actually works

Open the live URL and check:

- [ ] The roadmap road draws itself as you scroll down
- [ ] Hovering a milestone node pops its card
- [ ] The stats bar counts up from zero
- [ ] The moon/sun button toggles dark and light, and the choice survives a reload
- [ ] **Interactive Mode** opens the side-scroller (this proves `interactive.html` built)
- [ ] On a phone, the road is replaced by a stacked list of all 17 milestones

### Step 5. From now on, deploying is just pushing

```bash
git add -A
git commit -m "whatever you changed"
git push
```

Cloudflare rebuilds automatically. Pushes to any **other** branch get their own
throwaway preview URL, which is a safe way to try a redesign without touching the
live site.

---

## Phase 2 — Point theronindev.com at it

You mentioned moving the domain and hosting to Cloudflare within about five months.
Nothing below is urgent; `pages.dev` works indefinitely.

There are two separate things, and it is worth not confusing them:

- **Moving DNS** means Cloudflare answers DNS questions about your domain.
  Namecheap still owns the registration. Free, reversible, takes an hour.
- **Transferring the registration** means Cloudflare Registrar becomes your
  registrar and you stop paying Namecheap. Optional, and only possible *after*
  DNS has moved.

### Moving DNS to Cloudflare

1. In the Cloudflare dashboard click **Add a site** and enter `theronindev.com`.
2. Pick the **Free** plan.
3. Cloudflare scans your existing records. Check the imported list carefully. If
   you have email on this domain, make sure the `MX` records and any `TXT`
   records for SPF, DKIM, or DMARC came across. A missing `MX` record silently
   breaks incoming mail, and that is the one mistake here that actually hurts.
4. Cloudflare shows you two nameservers, something like
   `ana.ns.cloudflare.com` and `bob.ns.cloudflare.com`. Copy both.
5. In Namecheap: **Domain List** → **Manage** next to `theronindev.com` →
   **Nameservers** → switch the dropdown from *Namecheap BasicDNS* to
   **Custom DNS** → paste the two Cloudflare nameservers → save with the
   green tick.
6. Wait. Usually under an hour, occasionally up to 24. Cloudflare emails you when
   the domain goes active.

### Attaching the domain to your Pages project

Once Cloudflare reports the domain as active:

1. **Workers & Pages** → your `theronindev` project → **Custom domains**.
2. **Set up a custom domain** → enter `theronindev.com` → **Activate domain**.
3. Repeat for `www.theronindev.com`.

Cloudflare creates the DNS records and issues the HTTPS certificate itself. You do
not touch a CNAME by hand, and you never buy a certificate.

Do the same for `theronindev.dev` if you want both domains serving the site.

### Transferring the registration (optional)

After DNS is on Cloudflare, go to **Domain Registration** → **Transfer domains**.
Cloudflare Registrar charges you the wholesale price with no markup, which is
normally cheaper than Namecheap renewal.

Two constraints to know about:

- A domain cannot be transferred within **60 days** of being registered or of a
  previous transfer.
- You must unlock the domain at Namecheap and get the EPP authorisation code
  first: **Domain List** → **Manage** → toggle off **Registrar Lock**, then
  **Auth Code** → it is emailed to you.

---

## Repository layout, and what gets deployed

```
portfolio/
├── index.html           ← the whole site: inline CSS + JS, 17-milestone roadmap
├── interactive.html     ← hidden side-scroller, iframed by index.html
├── vite.config.js       ← builds BOTH html files (see note below)
├── package.json
├── public/              ← copied to dist/ untouched
│   ├── _headers         ← Cloudflare caching + security headers
│   ├── favicon.svg
│   └── icons/           ← roadmap card and node icons
├── src/assets/
│   ├── images/          ← me.jpg, roninicon.png
│   └── icons/           ← icon originals (kept as the source of truth)
└── dist/                ← build output. GITIGNORED ON PURPOSE.
```

**Why `vite.config.js` lists two inputs.** Vite only builds `index.html` by
default. Because `interactive.html` is loaded into an iframe at runtime rather
than imported by any script, Vite could not see it, and it was previously kept
alive by a hand-maintained duplicate in `public/`. Two copies of a 41 KB file
drift apart the moment you edit one. It is now a real build entry:

```js
build: {
  rollupOptions: {
    input: { main: 'index.html', interactive: 'interactive.html' },
  },
}
```

---

## Build it locally before you push

```bash
npm install        # once
npm run dev        # dev server at http://localhost:3000
npm run build      # writes dist/
npm run preview    # serve dist/ exactly as Cloudflare will
```

Always run `npm run build` before pushing a large change. A build that fails
locally will fail on Cloudflare too, and catching it locally takes ten seconds
instead of a minute.

---

## Known issue: the images are far too large

This is the one thing worth fixing before you show the site to anyone on a slow
connection. The build is about **7.1 MB**, and nearly all of it is images shown
at a fraction of their real size:

| File | Size | Displayed at |
|---|---|---|
| `public/icons/cosmetica.png` | 2.2 MB | 52 px |
| `src/assets/images/roninicon.png` | 1.4 MB | 90 px, and the favicon |
| `public/icons/sk.png` | 889 KB | 52 px |
| `public/icons/roninflow.png` | 855 KB | 52 px |
| `src/assets/images/me.jpg` | 722 KB | 160 px |
| `public/icons/alkasid.png` | 652 KB | 52 px |

Resized to 128x128 the icons would be roughly 5 to 15 KB each, and the photo
would be well under 100 KB at 320px. That cuts page weight by over 90% with no
visible difference. Every original is committed to git, so re-encoding the
served copies loses nothing.

Both `public/icons/` and `src/assets/icons/` hold the same images. `public/icons/`
is what gets served; `src/assets/icons/` is the archive *and* the fallback used
when you open the file off disk, so **resize both to keep them identical.**

---

## Why icons vanish when you double-click index.html

Opening `index.html` directly from the folder is not the same as serving it.
Icons live in `public/icons/` and are served at `/icons/*`, but `public/` is not
part of the served path, so there is no `icons/` folder at the project root for
the browser to find. Over http the path is correct, which is why the dev server,
`npm run preview`, and the live Cloudflare site are all fine.

The site now retries against `src/assets/icons/`, which is a real folder on
disk, so opening the file directly works too.

That said, **use the dev server.** Opening the file off disk also skips Vite
entirely, so you are not looking at what actually deploys:

```bash
npm run dev       # http://localhost:3000, hot reload
npm run preview   # serves dist/ exactly as Cloudflare will
```

---


## Troubleshooting

**Build fails with a Node or esbuild error.** Check that `NODE_VERSION` is set to
`20` in the Pages environment variables.

**Site deploys but every page is blank.** The build output directory is wrong.
It must be `dist`, not `/dist` or `./dist`.

**Interactive Mode shows a blank overlay or a 404.** `dist/interactive.html` is
missing, which means `vite.config.js` lost its second rollup input. Run
`npm run build` locally and confirm the file exists.

**Icons missing when you open index.html from the folder.** Expected; see the
section above. Run `npm run dev` instead.

**Icons missing on the live site but fine locally.** Filenames are
case-sensitive on Cloudflare and were not on your Windows machine. Check that
each `appIcon` in the `MILESTONES` array matches the real filename in
`public/icons/` exactly, including capitals.

**Custom domain stuck on "Verifying".** DNS has not propagated yet, or the
nameservers at Namecheap are not actually saved. Verify with:

```bash
nslookup -type=ns theronindev.com
```

It should list the two Cloudflare nameservers and nothing else.
