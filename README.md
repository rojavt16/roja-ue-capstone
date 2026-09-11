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

Edit the **partials** only — `blocks/<name>/_<name>.json` and `models/_*.json` — then run
`npm run build:json`, which regenerates `component-definition.json`, `component-models.json`
and `component-filters.json`.

**All three aggregates must be committed and pushed.** Edge Delivery has no server-side build
step; the repository *is* the deployment, and Universal Editor fetches those files over HTTP
from the deployed site. A model change that is not pushed does not exist as far as the editor
is concerned.

Two related gotchas worth knowing:

- **Changing a model does not migrate existing blocks.** The resource type is written into the
  content node when the block is inserted, so an edited definition only affects *newly inserted*
  blocks. Existing ones must be deleted and re-inserted.
- **The block CSS and JS file names come from the template `name`, not the folder.**
  `"name": "CTA Button"` renders `<div class="cta-button">`, so the code must live at
  `blocks/cta-button/cta-button.{js,css}`. A mismatch silently loads nothing.

## Page map — `/destinations`

| # | Section | Section style | Content |
|---|---|---|---|
| 1 | Hero banner | — | `hero` block |
| 2 | Explore by region | `Accent band` + `Centered` | Title + Text |
| 3 | W Circuit feature | `Highlight` | `columns` block |
| 4 | Americas | — | Title + Text + `cards` block (3 cards) |
| 5 | Europe | — | Title + Text + `cards` block (3 cards) |
| 6 | Permits and logistics | `Dark` | Title + Text |
| 7 | Regional editors | `Highlight` + `Narrow` | Title + Text + 2 `cta-button` blocks |
| 8 | Briefing / Planning by season | `Dark` + `Centered` | Title + Text + Button, Title + `cards` block |

Header and footer are global, loaded from the `/nav` and `/footer` pages.

In-page navigation uses auto-generated heading IDs — `#americas`, `#europe`,
`#permits-and-logistics`, `#regional-editors`.

## Block inventory

### `hero` — Hero Banner

Full-bleed background image with a gradient scrim and overlaid editorial copy. Renders the
page's single `<h1>`. The boilerplate shipped an empty `hero.js`; the decoration is ours.

| Field | Notes |
|---|---|
| `background_image` / `background_imageAlt` | LCP candidate, loaded eagerly with `fetchpriority="high"` |
| `foreground_eyebrow` | renders as an orange chip |
| `foreground_title` | **required**, promoted to `<h1>` |
| `foreground_description` | richtext |
| `foreground_primaryCta` + `Text` / `Title` / `Type` | **URL required** |
| `foreground_secondaryCta` + `Text` / `Title` / `Type` | optional |

Thirteen fields render as **two cells**. The `background_` and `foreground_` prefixes group
fields into one cell each (*element grouping*), and within them `image`+`imageAlt` and
`link`+`linkText`+`linkTitle`+`linkType` collapse into single elements (*field collapsing*).
That keeps the block inside the `xwalk/max-cells` limit of four while leaving every field
individually selectable in the editor.

### `cards` — Cards / Card

Responsive grid, full width to 599px, two columns from 600px, three from 900px. Used three
times: Americas, Europe, and Planning by season.

| Field | Notes |
|---|---|
| `image` / `imageAlt` | 4:3 crop |
| `eyebrow` | renders as an orange chip |
| `text` | richtext — `<h3>` title plus a description |
| `link` + `linkText` / `linkTitle` / `linkType` | `linkType` picks the button variant |

`cards.js` classifies cells by **content**, not position — picture, heading, link, otherwise
eyebrow — and drops empty ones. That is what allows the image-less "Planning by season" cards
to share one block implementation with the destination cards.

### `cta-button` — CTA Button

The only entirely new block. Renders a single authored link as a button, with a `classes`
field selecting the variant. Two placed next to each other sit on one row, because
`.cta-button-wrapper` is `display: inline-block`.

| Field | Notes |
|---|---|
| `link` | **required** |
| `linkText` | **required** |
| `linkTitle` | optional |
| `classes` | `Primary` (orange fill) or `Secondary` (transparent) |

`decorateButtons()` only matches anchors inside a paragraph, and this anchor sits bare in its
cell, so `cta-button.js` adds the `button` class itself and inherits the shared button shape.

### `columns` — Columns

The **unmodified boilerplate container**. Two columns accepting Image, Title, Text and Button.

### `header` / `footer`

Boilerplate blocks, restyled. Content comes from the `/nav` and `/footer` pages via
`loadFragment`. `/nav` requires exactly three sections, mapped positionally to `.nav-brand`,
`.nav-sections` and `.nav-tools`; the second must contain a real `<ul>`.

The brand mark is `icons/waypoint.svg`, authored as the `:waypoint:` token in the nav's first
section.

## Section styles

Applied per section through the Style multiselect, and combinable. Only `Highlight` came with
the boilerplate; the rest were added for this project.

| Style | Effect |
|---|---|
| `Highlight` | cream background *(boilerplate)* |
| `Accent band` | orange background, ink text |
| `Dark` | deep forest background, white text, orange body links |
| `Centered` | centres default content; blocks keep their own alignment |
| `Narrow` | insets the section to a 68ch reading measure |

A dark section containing **only** editorial copy gets the reading measure automatically. One
containing a block keeps full width so its heading aligns with that block.

## Buttons

No block hardcodes button colours. Variants live in `styles/styles.css`, and the CTA block
defines its own two in `blocks/cta-button/cta-button.css`. All carry a 4px hard offset shadow.

| Variant | Fill | Shadow | Authored as |
|---|---|---|---|
| `primary` | dark | orange | Button component, Type = primary |
| `secondary` | white | orange | Button component, Type = secondary |
| CTA primary | orange, ink label | black | CTA Button block, Style = Primary |
| CTA secondary | transparent | orange | CTA Button block, Style = Secondary |

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

All photography is from Wikimedia Commons. Several licences require attribution.

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

`icons/waypoint.svg` is original work for this project.

## Test results

PageSpeed Insights, mobile, against the live URL.

| Metric | Score |
|---|---|
| Performance | **99** |
| Accessibility | **95** → 100 expected after the contrast fix |
| Best Practices | **100** |
| SEO | 69 — see limitation 4 |
| Browser console | No issues |

| Check | Status |
|---|---|
| `npm run lint` passes | ✅ |
| One `<h1>`, ordered `<h2>`/`<h3>` hierarchy | ✅ |
| Alt text on all eight images | ✅ |
| Descriptive, unique link labels on all six cards | ✅ |
| In-page anchors resolve | ✅ |
| Visible focus states on all interactive elements | ✅ |
| No console errors | ✅ |
| Colour contrast meets AA | ✅ after switching orange buttons to ink labels |
| Responsive at 375 / 600 / 900 / 1200px | ⬜ to verify |

## Known limitations

1. **Columns has no image-position field.** The brief suggested a left/right display option. A
   custom model with that field was built and then reverted in favour of the unmodified
   boilerplate container, so image position is determined by which column the author places the
   Image component in. Same result for the reader, but it is not a model field.

2. **Header and footer are not selectable from `/destinations`.** They are authored on the
   `/nav` and `/footer` pages, which is the standard EDS pattern and keeps the real `<header>`
   and `<footer>` landmarks. A reviewer opens two extra pages in the editor to edit them.

3. **A third button variant is not reachable through the Button component.** AEM maps only
   `linkType: primary` → `<strong>` and `secondary` → `<em>`. An `accent` value emits a bare
   anchor, which `decorateButtons()` ignores, so it renders as a plain link. The accent action
   is therefore delivered as the `cta-button` block instead. Custom resource types are not an
   option — `xwalk/no-custom-resource-types` restricts them to AEM-provided prefixes.

4. **SEO scores 69 on the preview and live hosts.** AEM serves `X-Robots-Tag: noindex, nofollow`
   and a blanket `Disallow: /` robots.txt on every `*.aem.page` and `*.aem.live` host to prevent
   duplicate-content penalties against the real domain. Lighthouse deducts for "page is blocked
   from indexing". This resolves on a production domain with the CDN configured.

5. **Link URLs are plain text fields, not content pickers.** Every internal link on this
   one-page site is a hash anchor, which the `aem-content` picker cannot produce. Required URL
   fields use `required: true` for validation instead.

6. **Blocks cannot be nested inside a column.** `decorateBlocks()` matches only
   `div.section > div > div`, so a block placed in a column cell is never marked or loaded. It
   is achievable by calling `decorateBlock()` and `loadBlock()` from `columns.js`, but that was
   tried and reverted as off the boilerplate's supported path.

7. **The briefing and Planning by season share one section.** They are separate bands in the
   reference design. Merged, they cannot take different alignment treatments.
