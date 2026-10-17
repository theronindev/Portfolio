# Roadmap Editing Guide (1.html)

## Structure Overview

Each milestone has 2 parts:
1. **SVG `<g>` block** — the visual circle/dot/label on the road
2. **MILESTONES array entry** + **CARD_POS entry** — the hover card data

The `data-idx` on the SVG `<g>` must match the array index in MILESTONES and CARD_POS.

---

## Adding a New Milestone

### Step 1: Find the road position (X, Y)

The road has 4 S-curves. To find the exact Y for a given X on each curve, paste this in browser console and change `t` (0.0 to 1.0):

```js
// CURVE 1: right→left (950,200) → (150,600)
t=0.5; mt=1-t;
x = mt**3*950 + 3*mt**2*t*950 + 3*mt*t**2*150 + t**3*150;
y = mt**3*200 + 3*mt**2*t*400 + 3*mt*t**2*400 + t**3*600;
console.log(Math.round(x), Math.round(y));

// CURVE 2: left→right (150,600) → (950,1000)
t=0.5; mt=1-t;
x = mt**3*150 + 3*mt**2*t*150 + 3*mt*t**2*950 + t**3*950;
y = mt**3*600 + 3*mt**2*t*800 + 3*mt*t**2*800 + t**3*1000;
console.log(Math.round(x), Math.round(y));

// CURVE 3: right→left (950,1000) → (150,1400)
t=0.5; mt=1-t;
x = mt**3*950 + 3*mt**2*t*950 + 3*mt*t**2*150 + t**3*150;
y = mt**3*1000 + 3*mt**2*t*1200 + 3*mt*t**2*1200 + t**3*1400;
console.log(Math.round(x), Math.round(y));

// CURVE 4: left→right (150,1400) → (950,1800)
t=0.5; mt=1-t;
x = mt**3*150 + 3*mt**2*t*150 + 3*mt*t**2*950 + t**3*950;
y = mt**3*1400 + 3*mt**2*t*1600 + 3*mt*t**2*1600 + t**3*1800;
console.log(Math.round(x), Math.round(y));
```

t=0.0 = curve start, t=1.0 = curve end. Try values between to find your spot.

### Step 2: Add SVG circle group

#### Template — Circle ABOVE the road (connector goes UP):

Replace X, Y with your road position, and N with the array index.

```html
<g class="rn" data-idx="N">
  <circle cx="X" cy="Y" r="55" fill="transparent"/>
  <circle cx="X" cy="Y" r="7" fill="var(--gold)"/>
  <line x1="X" y1="Y-7" x2="X" y2="Y-70" stroke="#555" stroke-width="2"/>
  <circle cx="X" cy="Y-105" r="36" fill="var(--crimson)" stroke="var(--crimson-light)" stroke-width="3"/>
  <image href="src/assets/icons/youricon.png" x="X-26" y="Y-131" width="52" height="52" clip-path="circle(26px at 26px 26px)"/>
  <text class="node-label" x="X" y="Y-148" text-anchor="middle" fill="var(--text-dim)" font-size="14" font-weight="600">Name</text>
  <text class="node-label" x="X" y="Y-134" text-anchor="middle" fill="var(--text-muted)" font-size="12">Mon 2026</text>
</g>
```

#### Template — Circle BELOW the road (connector goes DOWN):

```html
<g class="rn" data-idx="N">
  <circle cx="X" cy="Y" r="55" fill="transparent"/>
  <circle cx="X" cy="Y" r="7" fill="var(--gold)"/>
  <line x1="X" y1="Y+7" x2="X" y2="Y+70" stroke="#555" stroke-width="2"/>
  <circle cx="X" cy="Y+105" r="36" fill="var(--crimson)" stroke="var(--crimson-light)" stroke-width="3"/>
  <image href="src/assets/icons/youricon.png" x="X-26" y="Y+79" width="52" height="52" clip-path="circle(26px at 26px 26px)"/>
  <text class="node-label" x="X" y="Y+158" text-anchor="middle" fill="var(--text-dim)" font-size="14" font-weight="600">Name</text>
  <text class="node-label" x="X" y="Y+172" text-anchor="middle" fill="var(--text-muted)" font-size="12">Mon 2026</text>
</g>
```

#### No icon? Use emoji instead of `<image>`:

```html
<!-- Replace the <image> line with: -->
<text x="X" y="CIRCLE_CY+10" text-anchor="middle" fill="#fff" font-size="22">&#128187;</text>
```

### Step 3: Add MILESTONES entry

Add at the matching index position in the array:

```js
{
  type: 'project',           // 'career', 'project', or 'pivot'
  date: 'Mar 2026',
  appIcon: 'youricon.png',   // filename in src/assets/icons/ (remove line if no icon)
  title: 'Project Name',
  description: 'Description with <strong>bold</strong> support.',
  tags: [
    { text: 'React Native', style: '' },          // crimson (default)
    { text: 'Firebase', style: 'gold-tag' },      // gold
    { text: 'Published', style: 'sakura-tag' }    // pink/sakura
  ],
  // Optional: emoji fallback when there is no appIcon, e.g. emoji: '🚀'
  // Optional: kind overrides the card subtitle, e.g. kind: 'Web Service'
  // Optional — only for published apps:
  links: [
    { label: 'App Store', url: 'https://...', style: 'ios' },
    { label: 'Google Play', url: 'https://...', style: 'android' }
  ]
}
```

### Step 4: Add CARD_POS entry

Add at the same index:

```js
{ left: 500, nodeY: 2100, dy: -205 }
```

- `left` = pixels from the left edge of the container
- `nodeY` = the node's `cy` in the SVG. These two must match exactly.
- `dy` = vertical nudge in SVG units. Use about `-130` when the node's icon
  hangs BELOW the road, about `-205` when it sits ABOVE it (the card has to
  clear the label text).

The card's `top` percentage is computed from the viewBox at runtime:

```js
top% = (nodeY + dy - VIEWBOX_Y0) / VIEWBOX_H * 100
```

So you never hand-tune percentages, and no existing card moves when the road
gets longer. If you DO extend the road, update both the SVG `viewBox` height
and the `VIEWBOX_H` constant in the script, and keep them equal.

### Step 5: If the road needs another curve

The path `d` attribute is duplicated FOUR times in the SVG: the dash mask, the
road edge, the road surface, and the gold dashed line. Change all four or the
road will visibly come apart.

---

## Circle Color Reference

| Type    | Circle fill               | Circle stroke                | Use for          |
|---------|---------------------------|------------------------------|------------------|
| Career  | `url(#g1)`                | `var(--gold-light)`          | Jobs/roles       |
| Project | `var(--crimson)`          | `var(--crimson-light)`       | Dev projects     |
| Pink    | `#8b4a5e`                 | `var(--sakura)`              | Special projects |
| Pivot   | `var(--crimson)` + r="38" | `var(--gold-light)`          | Career change    |

---

## Important: Inserting in the Middle

If you add a milestone between existing ones (not at the end):

1. Update ALL `data-idx` values AFTER your new one (+1 each)
2. Insert in MILESTONES array at the correct position
3. Insert in CARD_POS array at the correct position
4. The hover JS auto-reads `data-idx` so no other changes needed

---

## Quick Reference: Current Milestones (14 total)

| idx | Name             | Type    | Road Position | Curve |
|-----|------------------|---------|---------------|-------|
| 0   | Al Jazeera       | career  | (950, 200)    | 1     |
| 1   | Shams Telecom    | project | (830, 295)    | 1     |
| 2   | HalaSat          | career  | (670, 370)    | 1     |
| 3   | MikroTik PCQ     | project | (490, 420)    | 1     |
| 4   | Switch NOC       | career  | (275, 481)    | 1     |
| 5   | Al-Kasid         | career  | (200, 680)    | 2     |
| 6   | Al-Mouyasser     | pivot   | (430, 770)    | 2     |
| 7   | Ticket System    | project | (670, 835)    | 2     |
| 8   | IT Checklist     | project | (870, 905)    | 2     |
| 9   | SK Mobile        | project | (870, 1100)   | 3     |
| 10  | IoW              | project | (610, 1190)   | 3     |
| 11  | IT Asset Mgmt    | project | (320, 1270)   | 3     |
| 12  | Cosmeticca       | project | (200, 1470)   | 4     |
| 13  | TanCafe          | project | (430, 1570)   | 4     |

---

## Available Icons (src/assets/icons/)

aljazeera.jpg, alkasid.png, checklists.png, cosmetica.png, halasat.jpg,
iow.png, roninflow.png, shamstelecom.png, sk.png, switch.jpg, tancafe.png

---

## Extending the Road

If you need more space (more milestones), you can:
1. Add a 5th S-curve to the road path (add another `C` command)
2. Update the viewBox height: `viewBox="0 -80 1100 BIGGER_NUMBER"`
3. Update the road path in ALL 4 places (edge, fill, dashed line, mask)
4. Also update the end marker `<circle>` and "continues..." text positions
