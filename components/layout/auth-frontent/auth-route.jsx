// This file previously contained a server route handler that imported
// `next/headers`. That code lives in `app/auth/callback/route.js` already.
// Keeping this file empty (client components should not import server-only
// modules like `next/headers`). If you intentionally want a route, place
// it under the `app/` directory as `route.js` or `route.ts`.

export default function noop() {
  return null;
}