# Abstract Next.js

Next.js 16 conversion of the Abstract masonry blog template.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and replace every placeholder before
starting the app. `.env.local` is gitignored and must not be committed.

## Validation

```bash
npm run lint
npm run build
```

## Simulated content API

The front page and admin workspace share a typed, process-scoped content store.
It starts with seed posts and categories and resets whenever the Next.js server
restarts.

Public endpoints:

- `GET /api/content` — published front-page posts, featured posts, and categories.
- `GET /api/posts` — published posts.
- `GET /api/categories` — categories with post counts.

Authenticated admin endpoints:

- `GET /api/posts?scope=admin` and `POST /api/posts`.
- `PATCH /api/posts/:id` and `DELETE /api/posts/:id`.
- `POST /api/categories` and `DELETE /api/categories/:id`.
- `GET /api/dashboard` — live post and category totals.

Admin credentials, the session secret, cookie settings, and session lifetime
are configured only through environment variables. Admin mutations use the
same HTTP-only session cookie as the protected admin pages.

## Project structure

- `app/`: App Router pages and global stylesheet entry point.
- `components/layout/`: header, footer, search, mobile navigation, and back-to-top behavior.
- `components/home/`: featured slider, gallery slider, Masonry grid, posts, and pagination.
- `lib/content/`: shared API types, seed data, and the simulated content store.
- `styles/base.css`: the template reset and responsive grid.
- `styles/vendor.css`: the original vendor styles with missing legacy asset references removed.
- `styles/main.css`: the original Abstract theme adapted to public asset paths.
- `public/`: images, fonts, icons, and audio from the template.

The original jQuery behaviors were replaced with React components. Masonry and
the simulated API feed are loaded in the browser.
