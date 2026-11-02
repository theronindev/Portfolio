# Deploying to GitHub + Cloudflare Workers

How **theronindev.com** goes live on Cloudflare's free plan.

All of this is free. Static files served by a Worker are not billed and have no
request limit, and builds are free. No credit card or trial is involved.

---

## Current state (November 2026)

| | `theronindev.com` | `theronindev.dev` |
|---|---|---|
| Registrar | **Cloudflare** (transferred 2026-11-02) | Namecheap |
| DNS | **Cloudflare** | Namecheap (`dns1/dns2.namecheaphosting.com`) |
| Serves | Should be the `portfolio` Worker (see Phase 2) | Old manual upload on Namecheap **Stellar** hosting |

The Stellar hosting plan ends **2027-02-27**. Once `.com` serves the Worker and
`.dev` redirects to it, the plan can lapse with nothing lost.

---

## How the pieces fit together

```
  your laptop                GitHub                     Cloudflare (Worker "portfolio")
  ───────────                ──────                     ───────────────────────────────
  edit index.html
  git commit        ──push──▶  theronindev/Portfolio
                                      │
                                      │  webhook on every push to main
                                      ▼
                                             npm clean-install
                                             npm run build        → dist/
                                             npx wrangler deploy  → reads wrangler.jsonc
                                                    │
                                                    ▼
                                      portfolio.<account>.workers.dev
                                      theronindev.com   (custom domain)
```

The important idea: **you never upload a build yourself.** You push source code to
GitHub, and Cloudflare builds it in a clean container. That is why `dist/` is in
`.gitignore` and should stay there.

### Why `wrangler.jsonc` exists

The Cloudflare project is a **Worker** (Cloudflare's successor to Pages), so after
the build it runs `npx wrangler deploy`. Without a config file, Wrangler tries to
auto-configure the project and fails on Vite 5 with:

```
The version of Vite used in the project ("5.4.21") cannot be automatically configured.
```

`wrangler.jsonc` tells Wrangler to serve `dist/` as static assets, which works with
any Vite version. The `name` must match the Worker's name in the dashboard
(`portfolio`). `public/_headers` is copied into `dist/` and Workers honour it.

---

## Phase 1: Deploying

### Push

```bash
cd C:/P/portfolio
npm run build            # catch errors locally first
git add -A
git commit -m "what you changed"
git push
```

If GitHub asks for a password, use a Personal Access Token (GitHub → Settings →
Developer settings → Personal access tokens) or run `gh auth login` once.

### Check the build

dash.cloudflare.com → **Compute (Workers)** → **Workers & Pages** → `portfolio` →
**Deployments**. The newest entry should say **Success**. Click **View build** to
see the log if it failed, and **Visit** to open the `workers.dev` URL.

Build settings, under **Settings** → **Build**:

| Field | Value |
|---|---|
| Git repository | `theronindev/Portfolio`, branch `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

### Confirm it works

- [ ] The roadmap road draws itself as you scroll
- [ ] Hovering a milestone node pops its card
- [ ] The moon/sun button toggles theme, and the choice survives a reload
- [ ] Skill logos show in both themes
- [ ] **Interactive Mode** opens the game (proves `interactive.html` built)
- [ ] On a phone, the road is replaced by the stacked milestone list

---

## Phase 2: Pointing theronindev.com at the Worker

`.com` already uses Cloudflare DNS. As of 2026-11-02 it **redirects to
`theronindev.dev`** (the old Namecheap site). Swap that for the Worker:

1. **Remove the old routing.** Cloudflare → `theronindev.com` → **DNS** →
   **Records**: delete the `A`/`AAAA`/`CNAME` records for `theronindev.com` (`@`)
   and `www`. Keep any `MX` and `TXT` records, because those are email. Then check
   **Rules** → **Redirect Rules** and delete any rule that points to `.dev`.
2. **Attach the domain.** **Workers & Pages** → `portfolio` → **Settings** →
   **Domains & Routes** → **+ Add** → **Custom domain** → `theronindev.com` →
   **Add domain**. Repeat for `www.theronindev.com`.
3. Cloudflare creates the DNS records and the HTTPS certificate itself. It is
   usually live within minutes.

## Phase 3: theronindev.dev → theronindev.com

Do this only after Phase 2 works.

1. Cloudflare → **Add a domain** → `theronindev.dev` → **Free** plan. Check the
   imported records, especially `MX`/`TXT` if you have email on `.dev`.
2. Cloudflare shows two nameservers. In Namecheap: **Domain List** → **Manage**
   next to `theronindev.dev` → **Nameservers** → **Custom DNS** → paste both →
   save with the green tick.
3. When `.dev` is active in Cloudflare: **Rules** → **Redirect Rules** →
   **Create rule** → template **Redirect from one domain to another**. Send
   `theronindev.dev/*` to `https://theronindev.com/${1}` with **301**. A redirect
   only fires if the hostname has a proxied DNS record, so add an `A` record for
   `@` to `192.0.2.1` (proxied, orange cloud) and a `CNAME` for `www` to
   `theronindev.dev` (proxied).
4. Optional: transfer `.dev` to Cloudflare Registrar later (**Domain
   Registration** → **Transfer domains**). Unlock it at Namecheap and get the
   auth code first.

`.dev` is HSTS-preloaded, so it only works over HTTPS. Cloudflare handles that.

---

## Repository layout, and what gets deployed

```
portfolio/
├── index.html           ← the whole site: inline CSS + JS, roadmap
├── interactive.html     ← "Path of the Ronin" side-scroller, iframed by index.html
├── vite.config.js       ← builds BOTH html files
├── wrangler.jsonc       ← tells Cloudflare to serve dist/ as static assets
├── package.json
├── public/              ← copied to dist/ untouched
│   ├── _headers         ← caching + security headers
│   └── icons/           ← card, skill, and node icons
├── src/assets/
│   ├── images/          ← me.jpg, roninicon.png
│   └── icons/           ← mirror of public/icons (off-disk fallback)
└── dist/                ← build output. GITIGNORED ON PURPOSE.
```

**Why `vite.config.js` lists two inputs.** Vite only builds `index.html` by
default, and `interactive.html` is loaded into an iframe at runtime, so Vite cannot
see it. It is a real build entry:

```js
build: {
  rollupOptions: {
    input: { main: 'index.html', interactive: 'interactive.html' },
  },
}
```

---

## Local commands

```bash
npm install        # once
npm run dev        # dev server at http://localhost:3000
npm run build      # writes dist/
npm run preview    # serve dist/ the way Cloudflare will
npx wrangler deploy --dry-run   # check the deploy config without uploading
```

---

## Why icons vanish when you double-click index.html

Icons live in `public/icons/` and are served at `/icons/*`. When you open the file
off disk, `public/` is not part of the path, so no `icons/` folder exists. The
site retries against `src/assets/icons/`, so it mostly works anyway, but **use
`npm run dev`**. Opening off disk skips Vite, so you are not seeing what deploys.

---

## Troubleshooting

**"Vite … cannot be automatically configured. Please update the Vite version."**
`wrangler.jsonc` is missing from the commit Cloudflare built. Check it is pushed.

**"Missing entry-point" or the Worker name is wrong.** The `name` in
`wrangler.jsonc` must match the Worker name in the dashboard.

**Interactive Mode shows a blank overlay or a 404.** `dist/interactive.html` is
missing, which means `vite.config.js` lost its second input.

**Icons missing on the live site but fine locally.** Filenames are case-sensitive
on Cloudflare and not on Windows. Match each `appIcon` to the real filename.

**Custom domain stuck on "Initializing" / "Verifying".** An old `A`/`CNAME`
record for the same hostname still exists, or (for `.dev`) the nameservers are
not saved at Namecheap. Check with:

```bash
nslookup -type=ns theronindev.dev
```

**Analytics counts every visit twice.** A gtag.js snippet was re-added next to
GTM. GA4 is loaded only through GTM (`GTM-PGCQJPM5`).
