# Demo Skills Catalogue

Deterministic, repeatable steps for generating a ContextRocket-enabled
demo site from any target website. Each skill is proven on at least one
fork of cr-starter.

## Skills

### 1. Brand Extraction
Extract brand identity (colors, logo, typography, tagline) from original
site into `siteConfig.theme` + `siteConfig.identity`.
- **Proven:** cr-kleos (Webflow→navy #082444 / yellow #F5C842),
  cr-landing (CR site→pink #ff2b67 / cream #f8f7f1),
  cr-gba (Lovable→slate #0f172a / sky #38bdf8)
- **Input:** Original site URL (Webflow CSS, inline styles, logo URL)
- **Output:** Updated `config/site.config.ts` theme block + `public/` logo file
- **Files:** `config/site.config.ts`, `app/globals.css`, `public/`

### 2. Logo Trimming
Auto-trim transparent padding from scraped logos so they're legible at
navbar sizes without manual cropping.
- **Proven:** cr-kleos (1024×1024 → 913×446, 578px dead space removed)
- **Input:** Original logo file (any format)
- **Output:** Trimmed logo with transparent edges removed
- **Command:** `pnpm trim-assets public/logo.png`

### 3. FAQ Migration
Extract FAQ content from original site into structured markdown.
- **Proven:** cr-kleos (6 GBA questions), cr-luna (medical FAQ)
- **Input:** FAQ page URL or inline HTML with Q&A pairs
- **Output:** `content/faq/{locale}.md` matching the FAQ seam format
- **Files:** `content/faq/`, `lib/faq.ts`

### 4. Blog Content Extraction
Scrape blog posts into markdown with YAML frontmatter.
- **Proven:** cr-kleos (3 real posts from Webflow blog),
  cr-gba (3 placeholder posts)
- **Input:** Blog listing page URL + per-post URLs
- **Output:** `content/posts/{slug}.md` files with title, author, date, excerpt
- **Files:** `content/posts/` (or the fork's configured collection), `lib/blog.ts`

### 5. Hero Recreation
Rebuild the hero section matching the original's headings, CTAs, and
visual structure.
- **Proven:** cr-landing (pink subtitle + gray-900 h1 + curved SVG),
  cr-kleos (28px headings + yellow "We fix that"),
  cr-gba ("Should you enter the Greater Bay Area?")
- **Input:** Original hero HTML/CSS
- **Output:** Updated `app/[locale]/page.tsx` using `HeroSection` component
- **Files:** `components/shared/sections/hero.tsx`

### 6. Icebreaker Generation
Create domain-specific chat icebreaker prompts that feel native.
- **Proven:** cr-gba (4 GBA entry scenarios),
  cr-luna (menopause education prompts)
- **Input:** Domain context + target audience description
- **Output:** Icebreaker array in `siteConfig.chat.icebreakers`
- **Files:** `config/site.config.ts`, `components/shared/chat/chat-empty-state.tsx`

### 7. Design Token Mapping
Map original site's design tokens to Tailwind-compatible CSS variables.
- **Proven:** All forks (globals.css :root block rewritten per site)
- **Input:** Original site CSS (colors, fonts, spacing, shadows, borders)
- **Output:** Updated `app/globals.css` :root block + `.dark` block
- **Files:** `app/globals.css`

### 8. Static Export
Deploy as S3-hostable static site with widget embed.
- **Proven:** cr-landing (23 HTML pages, 289 files, 9.2 MB)
- **Input:** Complete cr-starter fork
- **Output:** `/out/` directory ready for S3/CloudFront
- **Command:** `STATIC_EXPORT=true pnpm build`

## Pipeline

```
Crawl target site
  → Extract brand (Skill 1)
  → Trim logo (Skill 2)
  → Extract FAQ (Skill 3)
  → Extract blog (Skill 4)
  → Recreate hero (Skill 5)
  → Generate icebreakers (Skill 6)
  → Map design tokens (Skill 7)
  → Static export (Skill 8)
  → Deploy to S3 + widget embed
```
