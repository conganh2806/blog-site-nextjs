# Abstract Next.js

Next.js 16 conversion of the Abstract masonry blog template.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run lint
npm run build
```

## Project structure

- `app/`: App Router pages and global stylesheet entry point.
- `components/layout/`: header, footer, search, mobile navigation, and back-to-top behavior.
- `components/home/`: featured slider, gallery slider, Masonry grid, posts, and pagination.
- `styles/base.css`: the template reset and responsive grid.
- `styles/vendor.css`: the original vendor styles with missing legacy asset references removed.
- `styles/main.css`: the original Abstract theme adapted to public asset paths.
- `public/`: images, fonts, icons, and audio from the template.

The original jQuery behaviors were replaced with React components. Masonry is
loaded only in the browser so the home page can still be statically rendered.
