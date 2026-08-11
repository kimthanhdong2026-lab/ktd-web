# Kim Thành Đông (KTD) Website

Professional B2B industrial equipment distribution website built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. **Seed database** (initial data)
   ```bash
   npm run seed
   ```

4. **Run dev server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/app              # Next.js app (pages, layouts)
/components       # React components (header, products, forms, etc.)
/lib              # Utilities, Supabase client, types
/scripts          # CLI tools for data import
/public           # Static assets (images, fonts)
```

## Key Features

- 🛍️ **Product Catalog**: 26+ products from 21 international brands
- 🔍 **Smart Search**: Vietnamese diacritics-aware, fuzzy matching, slang support
- 📋 **RFQ Cart**: Request for Quote system with email notifications
- 📱 **Responsive**: Mobile-first design, tested on all devices
- 🌍 **Bilingual Ready**: VI/EN language support (VI only in Phase 1)
- ⚡ **Performance**: Next.js ISR, image optimization, Supabase CDN

## CLI Data Import Tools

### Import Product Images
```bash
npm run import:images -- --input ./images-batch1/ --dry-run
npm run import:images -- --input ./images-batch1/
```

### Import Catalogs (PDFs)
```bash
npm run import:catalogs -- --input ./catalogs.csv --dry-run
npm run import:catalogs -- --input ./catalogs.csv
```

### Import Product Text Data
```bash
npm run import:text -- --input ./products-data.xlsx --dry-run
npm run import:text -- --input ./products-data.xlsx
```

**Note:** Always use `--dry-run` first to preview changes.

## Database Schema

- `brands` - 21 international brands
- `categories` - 9 product categories
- `products` - 26+ industrial products with specs
- `product_images` - Product gallery images
- `catalog_pdfs` - Downloadable catalogs
- `news_articles` - Blog/news content
- `rfq_requests` - Quote request submissions

See `lib/supabase.ts` for full schema definition.

## Deployment

Deployed on Vercel with automatic deployments from GitHub.

```bash
npm run build
npm start
```

## Documentation

- [Plan Document](../../plans/compiled-twirling-rocket.md) - Full implementation roadmap
- [Design Prototype](../../Prototype-handoff/kim-th-nh-ng-website-prototype/README.md) - Original design specs

## Support

Contact: sales@kimthanhdong.com | Hotline: 0914 897 227
