# Phase 1 — Frontend Authentication

## What this phase adds
- `src/context/AuthContext.jsx` — central auth state (token/username/role), backed by `localStorage`
- `src/api/axiosClient.js` (**replace existing file**) — now attaches `Authorization: Bearer <token>` to every request, and auto-logs-out on a 401
- `src/components/ProtectedRoute.jsx` — redirects to `/login` if not authenticated
- `src/components/Navbar.jsx` — top nav with login/register or logout + links
- `src/pages/LoginPage.jsx`, `src/pages/RegisterPage.jsx` — new pages
- `src/App.jsx` (**replace existing file**) — wraps the app in `AuthProvider`, adds `/login` and `/register` routes, wraps the existing 4 routes in `ProtectedRoute`

No backend changes in this phase — it already had working `/api/auth/register` and `/api/auth/login` endpoints, this just wires the frontend up to them properly.

## How to apply
1. Unzip this into your `environmental-quiz-frontend` repo, merging into `src/` (it will overwrite `src/api/axiosClient.js` and `src/App.jsx` — that's intentional, everything else is additive).
2. No new npm packages needed — this only uses `axios` and `react-router-dom`, both already in your `package.json`.

## How to test
```bash
npm install
npm run dev
```
1. Make sure the backend is running (`mvn spring-boot:run`) and MySQL is up.
2. Visit `http://localhost:5173` — you should be redirected to `/login` since you're not authenticated.
3. Go to `/register`, create an account — you should land on the (now-accessible) quiz list page.
4. Refresh the page — you should stay logged in (token persists in `localStorage`).
5. Click "Logout" — you should be redirected to `/login`, and manually visiting `/` or `/generate` should also redirect to `/login`.
6. Log back in with the same credentials via `/login`.

## Note
The `/history` link in the navbar doesn't have a matching route yet — it's a placeholder for Phase 4 (Quiz History page). Clicking it right now will just show a blank page; that's expected until that phase lands.

## Next: Phase 2 — AI Quiz Generation (Spring AI + RAG, Gemini primary / OpenAI fallback)
