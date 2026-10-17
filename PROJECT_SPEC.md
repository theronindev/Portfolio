# Samer Jameel — The Ronin Dev | Portfolio Project Spec

## Overview
Portfolio website for **Samer Jameel** (The Ronin Dev), a software engineer building
cross-platform mobile apps in **Flutter** and **React Native**, plus full-stack web,
desktop, and backend tools. Features a winding roadmap journey of 17 milestones
covering career history and projects, plus a hidden ronin side-scroller mode.

## Domains
- **theronindev.com**
- **theronindev.dev**
- Currently registered via Namecheap. Planned move of DNS and registration to
  Cloudflare within roughly five months of October 2026.

## Hosting
- **Cloudflare Pages** (free plan), building from GitHub on every push to `main`
- Repo: `github.com/theronindev/Portfolio`
- Live at `theronindev.pages.dev` until the custom domain is attached
- Build command `npm run build`, output directory `dist`, `NODE_VERSION=20`
- See `DEPLOY.md` for the full walkthrough

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Build Tool | Vite 5.4 (two HTML entry points) |
| Language | Vanilla JavaScript (ES6, inline) |
| Styling | Inline CSS (single-file design) |
| Fonts | Google Fonts (Noto Serif JP, Inter) |
| Framework | None (pure vanilla JS) |
| Minifier | esbuild |

## Theme
**Dark Ronin** — Japanese-inspired dark aesthetic with a light mode toggle:
- **Background:** Near-black (`#0a0a0f`)
- **Surfaces:** Dark charcoal (`#14141e`, `#1e1e2e`)
- **Primary accent:** Crimson red (`#c0392b` / `#e74c3c`)
- **Secondary accent:** Muted gold (`#d4a017` / `#f0c040`)
- **Tertiary accent:** Sakura pink (`#f4b4c6`)
- **Text:** Light on dark (`#e8e6e3`)
- **Road:** Dark (`#1a1a2a`) with gold dashed center line
- **Ambient:** Cherry blossom petals, fireflies, moon

## Branding
- **Name:** Samer Jameel
- **Brand:** The Ronin Dev
- **Title:** Software Engineer · Mobile & Full-Stack
- **Logo:** `roninicon.png` (ronin character in yellow hat with sword)
- **GitHub:** https://github.com/theronindev
- **LinkedIn:** https://linkedin.com/in/samerjameel
- **Email:** samerjameel00@gmail.com
- **WhatsApp:** +964 781 282 4046 · **Telegram:** @samerjameel
- **Resume:** https://docs.google.com/document/d/e/2PACX-1vRDblN0onn5fer95iVLDvMb6nzudNSBkrY72_X5TLUqjOtk4aTb9i5Pc8t2-a9r4g/pub

> The Resume links in the nav and the contact section both point at the current
> publication, which matches `Samer Jameel Resume.docx` in the repo root. Verified
> 2026-10-17: returns HTTP 200 to an anonymous browser and contains the Flutter,
> SFA Distribution, and HR CV Screener content. Note that `curl` without a browser
> User-Agent gets a redirect to a Google sign-in page, so that is not a useful way
> to test it.

## Positioning
Flutter is presented as the current direction; React Native as the proven,
shipped track record. The site does not hide that most delivered apps are React
Native, because that is the evidence of delivery. The "Currently Building" card
(RoninFlow) is tagged Flutter to show the transition is live work, not a plan.

## Career Timeline

### IT / Network Background (2017-2024)
| Period | Company | Role |
|--------|---------|------|
| Oct 2017 - Dec 2019 | Al Jazeera Al-Arabiya | Technical Support Engineer |
| Feb 2020 - Dec 2022 | Hala Al Rafidain (HalaSat) | Technical Support Team Leader |
| Feb 2020 - Jun 2023 | Switch Communications | NOC Analyst |
| Jul 2023 - May 2024 | Al-Kasid Enterprises | IT Help Desk Engineer |

### Software Engineering (2024-Present)
| Period | Company | Role |
|--------|---------|------|
| May 2024 - Present | Al-Mouyasser LLC | Software Engineer — Mobile & Full-Stack |

## Milestones (17 total)

Ordered as they appear along the road. `type` drives the node colour and the card
accent: `career` is gold, `project` is crimson, `pivot` is the crimson-and-gold
Al-Mouyasser node.

| # | Milestone | Date | Type | Stack |
|---|---|---|---|---|
| 0 | Al Jazeera Al-Arabiya | Oct 2017 | career | Wireless, MikroTik |
| 1 | Shams Telecom Website | 2018 | project | HTML, CSS, JS, Google Maps API |
| 2 | HalaSat — Team Leader | Feb 2020 | career | PTP/PTMP, Mimosa |
| 3 | MikroTik PCQ Dashboard | 2021 | project | Python, Django, Paramiko |
| 4 | Switch Communications — NOC | Feb 2020 | career | SIEM, TrendMicro |
| 5 | Al-Kasid Enterprises | Jul 2023 | career | Cisco, Ubiquiti, Grandstream |
| 6 | **Al-Mouyasser — Software Engineer** | May 2024 | pivot | Flutter, React Native, Next.js |
| 7 | IT Operations Checklist | 2024 | project | React Native, AsyncStorage |
| 8 | SK Mobile — Warehouse Management | 2025 | project | React Native, Expo, PHP, Oracle |
| 9 | IoW — Inventory on Wheels | 2025 | project | React Native, SheetJS, PDF export |
| 10 | IT Asset Management System | 2025 | project | React Native, Node, Next.js, SQL Server |
| 11 | Cosmeticca — Price Lookup | 2025 | project | React Native, PHP, SQL Server |
| 12 | TanCafe — Score Calculator | Dec 2025 | project | React Native, Expo 54 · **both stores** |
| 13 | Al-Mouyasser Hub — Desktop Automation | 2026 | project | Python, CustomTkinter, PyAutoGUI |
| 14 | MSR — Sales Rep & Customer Lookup | 2026 | project | Go, SQL Server, systemd |
| 15 | HR CV Screener — AI Resume Filtering | 2026 | project | Electron, Ollama/Llama 3.1, Tesseract |
| 16 | **SFA Distribution — Field Sales App** | 2026 | project | **Flutter**, Dart, PHP, SQL Server |

Published apps: **TanCafe** on both stores.
- iOS: https://apps.apple.com/us/app/tan-cafe-points-calculator/id6759920761
- Android: https://play.google.com/store/apps/details?id=com.tancafe.app

> The four 2026 dates (milestones 13-16) are an ordering choice, not confirmed
> months. The resume does not date these projects. Correct them in the
> `MILESTONES` array if the real dates differ.

## Project Structure
```
portfolio/
├── index.html            # Main site: 17-milestone roadmap, inline CSS+JS
├── interactive.html      # Hidden side-scroller (iframed by index.html)
├── vite.config.js        # Vite config — TWO entry points, port 3000, esbuild
├── package.json
├── DEPLOY.md             # GitHub + Cloudflare Pages walkthrough
├── PROJECT_SPEC.md       # This file
├── public/
│   ├── _headers          # Cloudflare caching + security headers
│   ├── favicon.svg
│   └── icons/            # Icons actually served to the browser
├── src/assets/
│   ├── images/           # me.jpg, roninicon.png
│   └── icons/            # Icon originals / archive
├── pro_depends/          # Resume text, roadmap reference image, roadmap guide
└── dist/                 # Build output (gitignored)
```

## Site Sections

### Navigation (sticky)
Logo + "The Ronin Dev" · About, Journey, Skills, Contact · theme toggle ·
Resume button · Interactive Mode button

### Hero
Logo (circular, 90px) · 浪人の道 · "Samer Jameel" gradient text · "The Ronin Dev" ·
**"Software Engineer · Mobile & Full-Stack"** · Explore My Journey + Get in Touch ·
moon, mountain silhouettes, radial gradients

### Stats Bar (animated count-up)
- 12+ Projects Shipped
- Flutter — Primary Stack
- 2 Apps Live on Stores
- 5+ Years Software Engineering

> The road visibly starts in 2017, so the page shows both a 5+ year engineering
> career and a 9-year tech career. That is intentional, not a contradiction.

### About Me
Circular photo (`me.jpg`, crimson border) and a bio covering the IT-to-software
pivot, a dozen shipped applications, Flutter and React Native, and the backend and
offline-first work.

### Currently Building
RoninFlow (tasks, habits, focus timer), tagged **Flutter 3.x, Dart, Riverpod,
Firebase, go_router, Material 3**, with a shimmer bar and pulsing green dot.

### My Journey (Roadmap)
- Winding SVG road, `viewBox="0 -80 1100 2480"`, five S-curves
- Gold dashed center line with a crimson draw-on-scroll reveal (IntersectionObserver)
- 17 milestone nodes, each with an icon image or an emoji fallback
- Hover cards in app-store style: 48px icon, title, subtitle, description, tags, store links
- Below 768px the road is hidden entirely and all 17 milestones render as a
  stacked card list from the same data

### Battle Skills (10 cards)
Flutter/Dart · React Native · Next.js/React · Node.js/Express · Go ·
Python/Django · SQL Server/Oracle · Firebase · Local LLMs & OCR · Networking (CCNA)

### Get in Touch
Email, LinkedIn, GitHub, WhatsApp, Telegram, Resume — pill buttons with SVG icons

### Interactive Mode (Hidden)
Fullscreen overlay iframing `interactive.html`. CSS ronin character, parallax
Japanese world, Arrow/WASD + Space controls, four buildings (torii, dojo, temple,
zen garden) with slide-in info panels.

## Analytics

Two Google tags are loaded from the top of `<head>`, with the GTM `<noscript>`
iframe just before `</body>`:

| Tag | ID |
|---|---|
| Google Tag Manager | `GTM-PGCQJPM5` |
| Google Analytics 4 via gtag.js | `G-6C3W8552N0` |

> **Check for double-counted pageviews.** Running a GTM container *and* a direct
> gtag.js snippet is fine only if the container does not also fire a GA4
> configuration tag for `G-6C3W8552N0`. If it does, every visit is counted twice.
> Confirm in GTM Preview, or watch the GA4 Realtime report during a single visit.
> If the container does hold that tag, drop the gtag.js block from `<head>` and
> let GTM own GA4.

> **Keep `<meta charset="UTF-8">` within the first 1024 bytes of the file.** The
> tracking snippets sit above it, leaving about 240 bytes of headroom. Adding
> another snippet there would push the charset declaration past the limit, and the
> page would silently lose its Japanese text and em-dashes. Safest fix is to move
> the charset and viewport meta tags back above the tracking block.

## Ambient Effects
- **Cherry blossoms:** pink petals falling continuously
- **Fireflies:** gold glowing dots drifting
- **Road animation:** crimson line draws along the path on scroll
- **Milestone pulse:** ring pulse on hover
- **Page load:** staggered `fadeSlideIn` on hero elements
- **Scroll reveal:** fade-up / fade-left / fade-right via IntersectionObserver

## How to Add a New Milestone

1. Open `index.html` and find the `MILESTONES` array in the `<script>` section.
2. Append an object:
   ```javascript
   {
     type: 'project',          // 'career' | 'project' | 'pivot'
     date: '2027',
     appIcon: 'myapp.png',     // optional, filename in public/icons/
     emoji: '🚀',              // fallback when there is no appIcon
     kind: 'Mobile App',       // optional subtitle, e.g. 'Web Service'
     title: 'Full Title',
     description: 'Description with <strong>HTML</strong> allowed.',
     tags: [
       { text: 'Flutter', style: '' },
       { text: 'Published', style: 'gold-tag' }   // or 'sakura-tag'
     ],
     links: [                  // optional
       { label: 'App Store', url: 'https://...', style: 'ios' }
     ]
   }
   ```
3. Add a matching `<g class="rn" data-idx="N">` node to the road SVG. Copy the
   nearest existing node and adjust the coordinates so the hit circle sits on the
   road path.
4. Append a row to `CARD_POS`:
   ```javascript
   { left: 500, nodeY: 2100, dy: -205 }
   ```
   - `left` is the card's horizontal offset in px inside the road container.
   - `nodeY` must equal the node's `cy` in the SVG.
   - `dy` is a vertical nudge in SVG units: about `-130` when the node's icon
     hangs *below* the road, about `-205` when it sits *above* it.

   The card's `top` percentage is derived from the viewBox, so you never hand-tune
   percentages and nothing shifts when the road gets longer.
5. If the road needs another curve, extend all **four** copies of the path `d`
   attribute (mask, edge, surface, dashed line), then raise both the SVG
   `viewBox` height and the `VIEWBOX_H` constant in the script to match.

`CARD_POS` and the SVG are checked against each other at a glance: every node's
`data-idx` must have a `CARD_POS` row with the same `nodeY`.

## Icon paths: why they break when you open the file directly

Icons live in `public/icons/` and are served at `/icons/*`. That path is correct
over http, which covers `npm run dev`, `npm run preview`, and Cloudflare Pages.
It does **not** resolve when `index.html` is opened straight off disk, because
`public/` is not part of the served path, so no `icons/` folder exists at the
project root.

The site now retries against `src/assets/icons/`, a real folder on disk, so
opening the file directly works too. Card `<img>` tags carry an `onerror` retry.
The SVG node `<image>` elements use a one-time reachability probe instead,
because an error listener added by the inline script at the end of `<body>`
would race against images that had already failed and fired.

Verified by serving the project root over http, which mirrors the disk layout:

| Path | Result |
|---|---|
| `icons/aljazeera.jpg` | 404, triggers the fallback |
| `src/assets/icons/aljazeera.jpg` | 200, rescues it |

Keep `src/assets/icons/` in sync with `public/icons/`. It is both the archive of
originals and the off-disk fallback. The preferred workflow is still
`npm run dev`.

## What's Done
- [x] Flutter-forward positioning, React Native kept as shipped evidence
- [x] Hero, title, and meta description rewritten as "Software Engineer · Mobile & Full-Stack"
- [x] Stats bar: 12+ projects, Flutter, 2 apps live, 5+ years engineering
- [x] About Me rewritten from the current resume
- [x] RoninFlow "Currently Building" card retagged to Flutter
- [x] Skills grid expanded to 10 cards (adds Go, Next.js, Python, Oracle, local LLMs)
- [x] Four new 2026 projects: Al-Mouyasser Hub, MSR, HR CV Screener, SFA Distribution
- [x] Al-Mouyasser retitled "Software Engineer" with Flutter-forward tags
- [x] Road extended to five S-curves and 17 nodes
- [x] Card positions derived from the viewBox instead of hand-tuned percentages
- [x] Emoji icon chips for milestones with no app icon
- [x] Per-project `kind` subtitles, so a Go service is not labelled a mobile app
- [x] **Mobile fallback cards now actually render** (the container was always empty)
- [x] Road SVG hidden below 768px, where 17 nodes were unreadable
- [x] `interactive.html` is a real Vite build entry; duplicate copy in `public/` removed
- [x] Icons no longer ship twice (11 MB build → 6.5 MB)
- [x] `public/_headers` for Cloudflare caching and security headers
- [x] `package.json` metadata corrected (was "Your Name" and a car-garden description)
- [x] `DEPLOY.md` written
- [x] Primary stack stat reads Flutter only; Ticket Management System removed
- [x] IT Checklist node slid along curve 2 to close the gap the removal left
- [x] Icon paths fall back to `src/assets/icons/` when opened off disk
- [x] Verified: production build succeeds, and the built page executes with 17/17
      cards, working scroll reveal, counters, theme toggle, and hover isolation

## What's Pending
- [ ] Create the Cloudflare Pages project and connect the GitHub repo (`DEPLOY.md` Phase 1)
- [ ] Move DNS from Namecheap to Cloudflare, then attach theronindev.com (Phase 2)
- [ ] **Resize the oversized icons.** 6.5 MB of a 6.5 MB build is icons displayed
      at 48-52px. `cosmetica.png` alone is 2.2 MB. See the DEPLOY.md section.
- [ ] Confirm the real dates for the four 2026 projects
- [ ] Optional: real app icons for Hub, MSR, CV Screener, and SFA (emoji for now)

## Education & Certifications
- B.Sc. Electronics & Telecommunication Engineering, Al-Rafidain University College (2017)
- CCNA Routing & Switching (200-125) — Certified
- CCNA Security (210-260)
- CCNP Switching (300-115)
- Windows Server 2019 Administration

## Languages
Arabic (native) · English (professional working proficiency)
