# Nidhi Path Frontend

This folder contains the plain HTML, CSS, JavaScript, and image assets for the Nidhi Path Loan Ventures website.

There is intentionally no React, Next.js, Vite, Tailwind, or frontend build step.

The Express backend serves this folder statically:

```bash
cd ../backend
npm install
npm run dev
```

Open `http://localhost:3000`.

API calls use:

```js
const API_BASE_URL = window.NIDHI_API_BASE_URL || window.location.origin;
```

So the same frontend works locally and after deployment when served by the backend.
