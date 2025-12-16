# Minimal Personal Site (Astro + Tailwind + MDX)

A clean, OS-inspired personal site with an about page, projects, blog (MDX), and contact page. Built with Astro for fast static output and Tailwind for the minimal styling.

## Stack
- Astro (SSG) + TypeScript
- Tailwind CSS with typography plugin
- MDX via Astro Content Collections
- SEO basics: OpenGraph meta, sitemap integration, robots.txt

## Getting Started
1. Install dependencies (Node 18+ recommended):
   ```bash
   npm install
   ```
2. Run locally:
   ```bash
   npm run dev
   ```
3. Production build & preview:
   ```bash
   npm run build
   npm run preview
   ```
4. Type/check:
   ```bash
   npm run check
   ```

## Project Structure
```
/
├─ src/
│  ├─ components/
│  │  ├─ Nav.astro
│  │  └─ Footer.astro
│  ├─ layouts/
│  │  └─ BaseLayout.astro
│  ├─ pages/
│  │  ├─ index.astro
│  │  ├─ about.astro
│  │  ├─ projects.astro
│  │  ├─ contact.astro
│  │  ├─ blog/
│  │  │  ├─ index.astro
│  │  │  └─ [slug].astro
│  ├─ content/
│  │  ├─ config.ts
│  │  └─ blog/
│  │     ├─ hello-world.mdx
│  │     └─ second-post.mdx
│  ├─ data/
│  │  └─ projects.ts
│  └─ styles/
│     └─ global.css
├─ public/
│  └─ robots.txt
├─ astro.config.mjs
├─ tailwind.config.mjs
├─ tsconfig.json
└─ README.md
```

## Content & Customization
- **Blog posts**: add MDX files in `src/content/blog`. Required frontmatter:
  ```yaml
  title: string
  description: string
  pubDate: YYYY-MM-DD
  tags: [optional string array]
  draft: true # optional; drafts are excluded from the index
  ```
- **Projects**: edit `src/data/projects.ts` to update title, status, summary, stack, and optional links.
- **SEO/site metadata**: update `site` in `astro.config.mjs`, adjust defaults in `src/layouts/BaseLayout.astro`, and mirror the sitemap URL in `public/robots.txt`.
- **Contact links**: update the email/social targets in `src/pages/contact.astro` and `src/components/Footer.astro`.
- **Styling**: Tailwind utilities live in templates; base styles and helpers are in `src/styles/global.css`.

## Deployment
- `npm run build` outputs a static `dist/` folder. Deploy to any static host (Vercel, Netlify, Cloudflare Pages, S3, etc.).
- Set the correct `site` URL in `astro.config.mjs` before deploying so the sitemap and canonical tags are accurate.
