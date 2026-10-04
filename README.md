# Lady Jane — Tattoo & Art

Website for Anneline Yaish (Lady Jane), symbolic tattoo and fine-art artist in Tel Aviv.
Plain static HTML/CSS/JS: no framework, no build step, nothing to install.

## Pages

| File | What it is |
|---|---|
| `index.html` | Home: hero, "To the Lost Adventurer" letter, selected work, the artist, style, the process ("The Rite"), commissions, who it's for, testimonial, offerings, booking form, FAQ |
| `work.html` | The Relic Archive: all 121 pieces, filterable by style, with a full-screen viewer |
| `aftercare.html` | The healing ritual (her aftercare guide) |
| `policies.html` | Studio policies |

## Run it locally

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.

## Deploy

Upload the folder as is to any static host: Netlify (drag and drop), Vercel, Cloudflare Pages or GitHub Pages.
After that, point her domain at the host.

## How the booking form works

There's no backend. The form writes the visitor's details into a message, and the visitor sends it themselves through **WhatsApp** (`wa.me/972515002650`) or **email** (`lj22designs@gmail.com`).
To change the number or email, edit `WHATSAPP` / `EMAIL` at the top of `assets/js/main.js`. The same values are also hard-coded in the contact links in the HTML.

If you want submissions to arrive without the visitor opening WhatsApp or email, you can swap in a form service like Formspree or Netlify Forms.

## Updating the portfolio

- Large images: `assets/img/work/<style>-NN.webp` (1800px max). Thumbnails: `assets/img/work/t/<style>-NN.webp` (about 720px on the short side).
- The archive is driven by `assets/js/work-data.js`. Add one line per piece; the order within a style is the order shown.
- Styles: `engraving`, `symbolic`, `realism`, `handpoke`, `illustration`, `paintings`.
- The home page picks specific pieces by filename: the hero arch slideshow, the six featured tiles, the style cards and the commissions carousel.

## Editing shared parts

The header, mobile menu, footer and SVG icon sprite are repeated in all four HTML files. Change all four when you edit them.
CSS and JS links carry a `?v=` hash so returning visitors get fresh files. Bump it (any new value) after changing `style.css` or `main.js`.

## Design notes

- Palette (from Anneline's brief, as CSS variables in `style.css`): Inkstone Black `#1c1b1a`, Moss Ash Green `#5f6652`, Vellum Parchment `#f0e8dc`, Witchwood Brown `#473d33`, Bloodstone Red `#722f37`, Bone Dust Beige `#a08e7c`, Void Black `#080806`.
- Type: Cormorant Garamond (display), Cinzel (small caps, echoing the logo wordmark), Jost (body), Pinyon Script (signature only). All from Google Fonts.
- The compass / sacred-geometry emblem and the wax seal are inline SVG. The compass draws itself on load and turns slowly.
- Work photos are shown in warm monochrome and switch to full colour on hover and in the viewer. This keeps mixed phone photos looking consistent.
- Motion respects `prefers-reduced-motion`.

## Still to confirm with Anneline

- [ ] Professional portraits and studio photos (current ones come from the old site)
- [ ] Best *healed* work in good light, ideally against a plain background
- [ ] More testimonials (only one so far, from Alex Feodorov)
- [ ] Deposit amount and price guidance, if she wants any on the site
- [ ] Studio name and exact address, opening days, languages (Hebrew version?)
- [ ] Whether to keep the apprenticeship / cartoon pieces (cartoon pieces were left out on purpose)
- [ ] Domain name
