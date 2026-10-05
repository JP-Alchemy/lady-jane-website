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
| `404.html` | "Lost, adventurer?" page for broken links |
| `he/…` | Hebrew version of the four main pages (right-to-left), at ladyjanetattoo.com/he/ |

## Run it locally

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.

## Deploy

Hosted on **GitHub Pages** from the `main` branch of `JP-Alchemy/lady-jane-website`, at **https://ladyjanetattoo.com** (domain registered at Namecheap; the `CNAME` file tells Pages which domain to serve).
Push to `main` and the site republishes within a minute or two.

Namecheap → Advanced DNS records:

| Type | Host | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `jp-alchemy.github.io.` |

## How the booking form works

- **Send your request** posts the form to [Web3Forms](https://web3forms.com), which emails it to the inbox the access key was created with. The key is in `FORM_KEY` at the top of `assets/js/main.js`. It's meant to be public. To change the receiving inbox, create a new key on web3forms.com and swap it in.
- **Send via WhatsApp** opens WhatsApp (`wa.me/972515002650`) with the visitor's details pre-written.
- A hidden `botcheck` field catches simple spam bots. If sending fails, the visitor is shown the WhatsApp link and email address instead.

## Hebrew version

- Lives in `/he/` and reuses the same `assets/` (the pages point one folder up with `../assets/`).
- `<html lang="he" dir="rtl">` flips the layout. Direction-sensitive bits (arrows, carousel, lightbox, marquee) have `[dir="rtl"]` rules in `style.css`.
- Hebrew type: **Frank Ruhl Libre** (headings) and **Heebo** (text). Hebrew has no italics, so emphasis uses the bone colour instead.
- Visitors talk in plural/neutral Hebrew (אתם / שלכם); Anneline speaks in the first-person feminine.
- Interface text used by the JavaScript (gallery viewer, archive filters, form messages, WhatsApp text, email field names) is in the `STRINGS` table at the top of `assets/js/main.js`.
- Each page links to its other-language twin (header and footer), and declares it with `hreflang` tags so Google shows the right language to the right people. `sitemap.xml` lists both.
- **When you change content, update both languages.** Form requests from the Hebrew site arrive with the subject "בקשה חדשה מהאתר בעברית".

## SEO

- Every page has a unique title and description led by what people actually search for ("tattoo artist in Tel Aviv", "fine line", "tattoo portfolio", "tattoo aftercare"). Each H1 opens with a small keyword line above the poetic headline.
- Structured data (JSON-LD) on the home page describes the studio (`TattooParlor`), Anneline (`Person`), her services and the FAQ, and includes the Hebrew name. Inner pages have breadcrumbs.
- `sitemap.xml` lists all pages plus 131 images, so her work can appear in Google Images. `robots.txt` points to it.
- House rules that keep SEO checkers (Seobility, Lighthouse) happy: every `<img>` gets a meaningful `alt`; icon-only links carry a hidden `<span class="sr-only">` label; no inline `style=""` attributes (add a class in `style.css` instead); link to the home page as `./`, never `index.html`.
- Not fixable on GitHub Pages: the `Strict-Transport-Security` (HSTS) header and longer browser caching (Pages fixes `max-age=600`). Both are possible by putting Cloudflare in front of the domain.
- Keep the name, address and phone **identical** everywhere (site, Google, Instagram, directories): *Lady Jane Tattoo & Art · Sheinkin St 4, Tel Aviv-Yafo · +972 51 500 2650*.

## Updating the portfolio

- Large images: `assets/img/work/<style>-NN.webp` (1800px max). Thumbnails: `assets/img/work/t/<style>-NN.webp` (about 720px on the short side).
- The archive is driven by `assets/js/work-data.js`. Add one line per piece; the order within a style is the order shown.
- Styles: `engraving`, `symbolic`, `realism`, `handpoke`, `illustration`, `paintings`.
- The home page picks specific pieces by filename: the hero arch slideshow, the six featured tiles, the style cards and the commissions carousel.

## Editing shared parts

The header, mobile menu, footer and SVG icon sprite are repeated in every HTML file (including `404.html` and the `he/` pages). Change them all when you edit them.
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
- [ ] Read through the Hebrew site and adjust the wording to her voice
- [ ] Hebrew spelling of her name (the Hebrew pages show "Anneline Yaish" in Latin letters for now)
