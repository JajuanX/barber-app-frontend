# Barber Study Frontend (Vite + React + SCSS)

This is the React app for practicing barber exam questions, tracking progress, and administering content. It’s slick, fast, and styled with SCSS. Fresh fade UI, no clipper guard. 💈✨

## Highlights

- Vite + React + TypeScript
- SCSS with BEM naming (no CSS‑in‑JS)
- Controlled inputs, custom `Select`, and clean components
- Quiz flow with category selection, results, and history
- Admin tools: Questions CRUD, Analytics, Users
- Axios services with auth token interceptor

## Requirements

- Node.js 18+
- npm 9+

## Setup

1) Install
- `cd frontend`
- `npm install`

2) Run
- `npm run dev` → launches at `http://localhost:5173`

3) Build
- `npm run build` → outputs to `dist/`
- `npm run preview` → preview production build

## Environment

- The app calls the API with baseURL `/api` (see services). In development, run the backend locally at `http://localhost:4000` and proxy or configure CORS.
- In production, you can:
  - Use Vercel rewrites to proxy `/api/*` to your backend
  - Or switch services to use an env‑driven base URL (e.g., `VITE_API_BASE_URL`)

## Key Routes

- `/` — Quiz start screen with category picker (All or specific category)
- `/login` — Login/Register
- `/history` — Past attempts
- `/history/:attemptId` — Attempt details (includes wrong and/or unanswered)
- `/admin/questions` — Manage questions (admin only)
- `/admin/analytics` — See overview and Category Accuracy (admin only)
- `/admin/users` — Manage users (admin only)

## Components You’ll See

- `QuestionCard` — Renders question text and options A‑D (controlled)
- `Select` — Accessible custom dropdown used across pages
- `BarChart` — Lightweight SVG chart with optional rotated labels to avoid overlap

## Styling

- SCSS with BEM class names (e.g., `.quiz-page__nav-btn--primary`)
- One `.scss` file per component/page
- Keep it sharp and consistent

## Auth Flow

- JWT token is stored in `localStorage` and sent via Axios interceptor
- `useAuth()` provides `login`, `register`, `logout`
- Logging out redirects to `/`

## Quiz Flow (Student)

- Pick a category (or All) → Start Quiz (50 randomized questions max)
- Answer questions (or skip!) → Submit
- See results with explanations → Review History → Drill into wrong answers

## Admin Flow

- Create/update/delete questions (one component per file, controlled inputs)
- View analytics: overview, distribution, and per‑category accuracy
- Manage student users

## Tests

- Some example tests live under `src/pages/__tests__` (e.g., AttemptDetailPage test)
- Extend following the same patterns — keep components focused and testable

## Deployment Tips

- Vercel is great for this SPA:
  - Build command: `npm run build`
  - Output dir: `dist`
  - Add a rewrite so `/api/*` proxies to your backend
- Pair with a long‑lived backend (e.g., Heroku/Render/Railway) to keep Mongoose happy

Have fun, keep it tidy, and may your UI be as clean as a fresh taper. 😎

