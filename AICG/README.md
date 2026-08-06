# Wind AICG Visual Lab

A standalone, static AICG editorial gallery for `windzxy.github.io/AICG/`.

## Product position

This is not a generic prompt-sharing page or an infinite image feed. It is designed as a **curated visual laboratory**:

- Full-screen editorial hero with series navigation.
- Filterable gallery and browser-local favorites.
- Visible generation and review methodology.
- Prompt notebook focused on transferable visual decisions, not copying formulas.
- Bilingual Traditional Chinese / English interface.
- No runtime backend and no API key in the browser.

## GitHub Pages architecture

```text
AICG/
├─ index.html                 Static presentation
├─ assets/
│  ├─ styles.css              Responsive visual system
│  ├─ app.js                  Gallery, filters, lightbox, favorites, i18n
│  └─ generated/              Approved images created by the pipeline
├─ data/
│  ├─ gallery.json            Published artwork manifest
│  ├─ briefs.json             Rotating art-direction briefs
│  └─ runs/latest.json        Latest generation/review report
└─ scripts/
   └─ pipeline.mjs            Generate → validate → moderate → review → publish

.github/workflows/
└─ aicg-curated-publishing.yml
```

GitHub Pages serves only static assets. Image generation and review run in GitHub Actions, then approved files are committed into the repository and deployed as static content.

## Scheduled pipeline

Default schedule: **Tuesday and Friday at 01:20 UTC**  
Approximate local time: **10:20 Japan / 09:20 China, Hong Kong and Singapore**.

Each run:

1. Selects art-direction briefs that reduce recent category repetition.
2. Generates four original candidates with the configured OpenAI image model.
3. Verifies that every file decodes correctly and meets resolution/aspect-ratio requirements.
4. Runs image/text safety moderation.
5. Uses a vision-capable review model to score composition, detail integrity, lighting/color, originality risk and wallpaper usability.
6. Publishes at most two candidates scoring 84 or above.
7. Converts approved images to 2560×1440 WebP plus 960×540 thumbnails.
8. Updates `gallery.json` and `runs/latest.json`, commits approved output, and deploys GitHub Pages.

## Required repository secret

Add this in:

`Repository Settings → Secrets and variables → Actions → New repository secret`

- `OPENAI_API_KEY`: server-side OpenAI API key used only by GitHub Actions.

Do **not** place the key in `index.html`, JavaScript, JSON, repository variables, or any public file.

Optional repository variables:

- `OPENAI_IMAGE_MODEL` — defaults to `gpt-image-1`.
- `OPENAI_REVIEW_MODEL` — defaults to `gpt-5-mini`.

Without `OPENAI_API_KEY`, the workflow exits successfully without generating images. This keeps the page deployable before the key is configured.

## Editorial standards

A work is rejected when it contains:

- Broken anatomy, duplicated subjects, unreadable fake text, watermarks or signatures.
- Logos, celebrity likeness, protected characters or recognizable copyrighted IP.
- Imitation of a named living artist or identifiable studio/franchise look.
- Weak hierarchy, incoherent light, excessive artifacting or poor thumbnail readability.
- A review score lower than the current publishing threshold.

The first release uses original images already present in the repository as launch content. Future scheduled runs append only approved works.
