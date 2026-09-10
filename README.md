# Waypoint — Travel Destination Capstone

A single-page travel destination experience built with Edge Delivery Services and authored
through the Universal Editor in AEM as a Cloud Service.

All page content is authored in AEM. Nothing on the page is hard-coded in JavaScript or CSS —
every heading, image, link and display option is exposed as an editable field or a section style.

## Environments

| Environment | URL |
|---|---|
| Author | `https://author-p99952-e1559416.adobeaemcloud.com` |
| Preview | https://main--roja-ue-capstone--rojavt16.aem.page/destinations |
| Live | https://main--roja-ue-capstone--rojavt16.aem.live/destinations |

Supporting fragment pages: `/nav` and `/footer`.

## Setup

```sh
npm install
npx -y @adobe/aem-cli up --no-open --forward-browser-logs
```

The dev server runs at `http://localhost:3000`. It serves code from the local working copy and
content from the AEM author instance via the `fstab.yaml` mountpoint.

```sh
npm run lint          # eslint + stylelint, must pass before committing
npm run lint:fix      # auto-fix what can be fixed
npm run build:json    # regenerate the aggregate component JSON
```

### Working on models

Edit the **partials** only:

- `blocks/<name>/_<name>.json`
- `models/_*.json`

Then run `npm run build:json`, which regenerates `component-definition.json`,
`component-models.json` and `component-filters.json`. **All three must be committed and pushed** —
the Universal Editor reads them over HTTP from the deployed site, not from your working copy.
A model change that is not pushed will not appear in the editor.

## Page map — `/destinations`

| # | Section | Section style | Content |
|---|---|---|---|
| 1 | Hero banner | — | `hero` block |
| 2 | Explore by region | `Accent band` + `Centered` | Title + Text |
| 3 | W Circuit feature | `Highlight` | `columns` block |
| 4 | Americas | — | Title + Text + `cards` block (3 cards) |
| 5 | Europe | — | Title + Text + `cards` block (3 cards) |
| 6 | Permits and logistics | `Dark` | Title + Text |
| 7 | Regional editors | `Highlight` + `Narrow` | Title + Text + 2 Buttons |
| 8 | Briefing / Planning by season | `Dark` + `Centered` | Title + Text + Button, Title + `cards` block (3 cards) |

Header and footer are global, loaded from the `/nav` and `/footer` pages.

In-page navigation uses auto-generated heading IDs — `#americas`, `#europe`,
`#permits-and-logistics`, `#regional-editors`.

## Block inventory

### `hero` — Hero Banner

Full-bleed background image with a gradient scrim and overlaid editorial copy.
Renders the page's single `<h1>`.

| Field | Type | Notes |
|---|---|---|
| Background image / alt text | reference + text | LCP candidate, loaded eagerly |
| Eyebrow | text | renders as an orange chip |
| Heading | text | **required**, promoted to `<h1>` |
| Supporting copy | richtext | |
| Primary CTA — URL / label / title / style | text + select | **URL required** |
| Secondary CTA — URL / label / title / style | text + select | optional |

Thirteen fields render as **two cells** using element grouping (`background_` and `foreground_`
prefixes), which keeps the block within the `xwalk/max-cells` limit of four while leaving every
field individually selectable in the editor.

### `columns` — Columns

The unmodified boilerplate container. Two columns, each accepting Image, Title, Text and Button
components.

### `cards` — Cards / Card

Responsive grid: 1 column on mobile, 2 from 600px, 3 from 900px. Used three times — Americas,
Europe and Planning by season.

| Field | Type | Notes |
|---|---|---|
| Image / Image Alt Text | reference + text | 4:3 crop |
| Category or region | text | renders as an orange chip |
| Title and description | richtext | `<h3>` heading plus a paragraph |
| Destination URL / label / title | text | renders as an orange pill button |

Cells are classified by **content**, not position — a card with a field left empty still renders
correctly, which is how the text-only Planning by season cards work.

### `header` / `footer`

Boilerplate blocks. Content comes from the `/nav` and `/footer` pages via `loadFragment`.

`/nav` requires exactly three sections, mapped positionally to `.nav-brand`, `.nav-sections`
and `.nav-tools`. The second must contain a real `<ul>`.

## Section styles

Applied per section through the Style multiselect, and combinable.

| Style | Effect |
|---|---|
| `Highlight` | cream background |
| `Accent band` | orange background, dark ink text |
| `Dark` | deep forest background, white text, orange links |
| `Centered` | centres default content; blocks keep their own alignment |
| `Narrow` | 68ch centred reading measure for default content |

Dark sections containing **only** default content get the reading measure automatically. A dark
section containing a block keeps full width so its heading aligns with that block.

## Design tokens

Defined in `styles/styles.css` and mapped onto the boilerplate's variable names, so existing
blocks pick up the theme without modification.

| Token | Value |
|---|---|
| `--color-forest` | `#1c3b30` |
| `--color-forest-deep` | `#12241d` |
| `--color-orange` | `#e2622c` |
| `--color-orange-dark` | `#c44f1e` |
| `--color-cream` | `#f6f0e6` |
| `--color-ink` | `#1a1a1a` |

## Image credits

All photography is from Wikimedia Commons. Three licences require attribution.

| Image | Author | Licence |
|---|---|---|
| Hero — Cuernos del Paine | Pedro Szekely | CC BY-SA 2.0 |
| Feature — Colors of Patagonia | Douglas Scortegagna | CC BY 2.0 |
| Card — Torres del Paine | Winky, Oxford UK | CC BY 2.0 |
| Card — Moraine Lake | Chensiyuan | CC BY-SA 4.0 |
| Card — Atacama Desert | Hailey Kean | CC0 |
| Card — Lofoten Islands | Simo Räsänen | CC BY-SA 4.0 |
| Card — Tre Cime di Lavaredo | Simo Räsänen | CC BY-SA 4.0 |
| Card — Isle of Skye | Henk Monster | CC BY 3.0 |

## Known limitations

1. **Columns has no image-position field.** The brief suggested a left/right display option. The
   block uses the unmodified boilerplate container instead, so image position is determined by
   which column the author places the Image component in. Same outcome for the reader, but it is
   not a model field.

2. **Header and footer are not selectable from `/destinations`.** They are authored on the `/nav`
   and `/footer` pages, which is the standard EDS pattern and keeps the real `<header>` and
   `<footer>` landmarks. The trade-off is that a reviewer opens two extra pages in the editor.

3. **Link URLs are plain text fields, not content pickers.** Every internal link on this one-page
   site is a hash anchor, which the `aem-content` picker cannot produce. Required URL fields use
   `required: true` for validation instead.

4. **Button contrast is below AA.** White text on `--color-orange` (`#e2622c`) measures 3.49:1
   against a 4.5:1 requirement. This affects the hero CTAs, card buttons and the header action.
   Retained as a deliberate visual choice; the accessible fix is a dark ink label (4.96:1) or the
   darker `#c44f1e` fill with white text (4.71:1).

5. **The briefing and Planning by season share one section.** They are separate bands in the
   reference design. Merged, they cannot take different alignment treatments.

## QA checklist

| Check | Status |
|---|---|
| `npm run lint` passes | ✅ |
| One `<h1>`, ordered `<h2>`/`<h3>` hierarchy | ✅ |
| Alt text on all eight images | ✅ |
| Descriptive, unique link labels on all six cards | ✅ |
| In-page anchors resolve | ✅ |
| Visible focus states on all interactive elements | ✅ |
| Responsive at 375 / 600 / 900 / 1200px | ⬜ to verify |
| No console errors | ⬜ to verify |
| PageSpeed Insights against the preview URL | ⬜ to verify |
| Colour contrast | ⚠️ see known limitation 4 |
