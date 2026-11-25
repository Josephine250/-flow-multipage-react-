# StudyFlow

A responsive, multi-page React study planner: see an overview, organise tasks, run a focus timer and customise preferences. Front-end only: **no API, fetch, database or server**. All data comes from local JavaScript arrays and `localStorage`.

**Tech stack:** React 19 · Vite · Tailwind CSS 4 · React Router DOM

> **Fill these in before submitting**
> - Name: _your name_
> - GitHub repository: _URL_
> - Live website: _URL_
> - Video walkthrough (3–5 min): _URL_

## Pages and routes

| Page | URL | What it does |
|---|---|---|
| Dashboard | `/` | Welcome message, 4 summary cards, progress bar, upcoming tasks, focus preview, link to Tasks |
| Tasks | `/tasks` | Add / edit / delete / complete tasks; search, filter (category + status), sort; validation; empty states |
| Focus | `/focus` | Start / pause / reset timer, session status, Study/Break switch that resets the timer |
| Settings | `/settings` | Display name, study duration, compact-layout preference (all saved to localStorage) |
| Not Found | `*` | Friendly message + link back to the Dashboard |

## Run locally

```bash
npm install
npm run dev      # development
npm run build    # production build
npm run preview  # preview the build
```

## Deployment (SPA fallback)

`BrowserRouter` needs the host to serve `index.html` for every path, otherwise refreshing `/tasks` gives a 404.
- **Vercel:** `vercel.json` (included) rewrites all paths to `/index.html`.
- **Netlify:** `public/_redirects` (included) contains `/* /index.html 200`.

## Project structure

```
src/
  components/  Navbar, SectionCard, SummaryCard, TaskCard, TaskForm, TaskFilters,
               Button, Badge, EmptyState, TextInput, SelectField, Icon, FocusTimer, TimerControls
  pages/       DashboardPage, TasksPage, FocusPage, SettingsPage, NotFoundPage
  hooks/       useLocalStorage, useToggle, useDocumentTitle, useDebounce
  data/        initialTasks.js, categories.js, defaultSettings.js
  layouts/     SiteLayout (shared shell)
  utils/       dates.js
  App.jsx      routes + shared state
  main.jsx     entry point
```

## Component tree

```
App  (owns tasks + settings state, BrowserRouter, Routes)
└─ SiteLayout
   ├─ Navbar (NavLink x4)
   └─ <Outlet/> →
      ├─ DashboardPage → SummaryCard x4, SectionCard (progress / focus preview / upcoming), Badge, ButtonLink
      ├─ TasksPage → TaskForm (TextInput, SelectField, Button), TaskFilters, TaskCard x n, EmptyState
      ├─ FocusPage → SectionCard → FocusTimer (key=mode) → TimerControls, Badge
      ├─ SettingsPage → SectionCard → TextInput, Button
      └─ NotFoundPage → EmptyState
```

## State ownership

**`App` owns the shared state** (`tasks` and `settings`). `App` stays mounted while the URL changes, so the data survives navigation and is the single source of truth. Both the Dashboard and the Tasks page need the tasks, plus the nav badge, so the state sits in their closest common parent and is passed down as props, with changes sent back up through callback props (`onAdd`, `onUpdate`, `onDelete`, `onToggle`, `onSave`). Editing a task on `/tasks` therefore updates the Dashboard immediately.

State that only one component needs stays local: search/filter/sort and the form-open state live in `TasksPage`, the form fields in `TaskForm`, the Study/Break mode in `FocusPage`, and the fast-changing timer state (`secondsLeft`, `running`) in `FocusTimer`.

Derived values (Dashboard counts, progress %, overdue count, filtered list, pending badge) are **calculated during render** from `tasks`, never stored twice and never computed in an Effect.

## Requirement map

| Requirement | Where |
|---|---|
| React Router: BrowserRouter, Routes, Route, NavLink/Link | `App.jsx`, `Navbar.jsx`, `Button.jsx` (`ButtonLink`) |
| Same header / nav / container on every route | `SiteLayout.jsx` with `<Outlet />` |
| Active nav style, nav visible on desktop + mobile | `Navbar.jsx` (sidebar on desktop, bottom bar on mobile) |
| ≥ 6 reusable components, `children` | see structure above; `SectionCard` and `EmptyState` use `children` |
| ≥ 6 sample tasks with id/title/category/dueDate/priority/completed | `data/initialTasks.js` (7 tasks) |
| Add / edit / delete / complete, immutable updates | `App.jsx` (`map`, `filter`, spread) |
| Controlled form + blank-title validation | `TaskForm.jsx` |
| Search + filter + sort work together; separate empty states | `TasksPage.jsx`, `TaskFilters.jsx` |
| `task.id` as key | `TasksPage.jsx` (`<TaskCard key={task.id}>`) |
| localStorage for tasks + ≥ 2 settings | `useLocalStorage` used in `App.jsx` (tasks + 3 settings values) |
| `document.title` via Effect | `useDocumentTitle` on every page (Tasks shows pending count) |
| Timer once per second with cleanup | `FocusTimer.jsx` |
| ≥ 4 custom Hooks | `useLocalStorage`, `useToggle`, `useDocumentTitle`, `useDebounce` |
| Ref to focus an input; ref for interval ID | `searchRef` / `titleRef` in `TasksPage`; `intervalRef` in `FocusTimer` |
| React 19 `ref` prop through a child | `TextInput` takes `ref` as a normal prop; `TaskForm` passes `titleRef` into it |
| `key` to reset the timer | `<FocusTimer key={mode} />` in `FocusPage.jsx` |
| memo / useMemo | `memo(TaskCard)` + `useCallback` in `App`/`TasksPage`; `useMemo` for the filtered list |
| Responsive, no horizontal scroll | Tailwind utilities (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, `md:` sidebar) |

## Custom Hooks

- **`useLocalStorage(key, initial)`** – `useState` that reads from and writes to localStorage (tasks and settings).
- **`useToggle(initial)`** – boolean state with a stable `toggle` function (show/hide the task form).
- **`useDocumentTitle(title)`** – Effect that syncs the browser tab title with the current page.
- **`useDebounce(value, delay)`** – returns a value only after it stops changing; used so the list filters 300 ms after typing stops. Its Effect cleans up the previous `setTimeout`.

## Effects and the timer

`FocusTimer` starts a `setInterval` only while the timer is active and **returns a cleanup that calls `clearInterval`**. React runs that cleanup whenever `active` changes (pause, reset, finish) and when the component unmounts (leaving `/focus`). Without it, every Start or revisit would add another interval, so the time would count down several times per second. The interval ID is stored in a **ref** because it is not shown on screen, so changing it must not cause a re-render.

I intentionally did **not** use Effects for filtering, summary counts or button clicks; those are calculated during render or handled in event handlers.

## Rendering notes

- **Where state lives matters.** The timer ticks every second, but its state is inside `FocusTimer`, so only that component re-renders, not `App` or the routes. (In development, `render App` is logged once, while `render FocusTimer` is logged each second.)
- **Key reset.** `<FocusTimer key={mode} />`: a different key tells React it is a different component, so it unmounts the old one and mounts a fresh one with new state. Switching Study ↔ Break resets the timer without any manual reset code.
- **Observing renders.** Development-only `console.log` lines in `App`, `TaskCard` and `FocusTimer` show when each renders. _Add your own observation here after testing, e.g. what you see in the console when you type in the search box, and optionally a React DevTools Profiler screenshot._
- **A render is not a DOM update.** React calls the component function to produce a description of the UI, compares it to the previous one, and only changes the real DOM where something actually differs. A component can render and produce identical output, so the browser DOM is untouched.
- **Memoization.** `TaskCard` is wrapped in `memo`, and the callbacks passed to it are stable (`useCallback`), so typing in the search box does not re-render every card. `useMemo` caches the filtered/sorted list. For a list this small the gain is tiny, so these are used to demonstrate the pattern correctly, not because the app is slow.
- **React Compiler.** The React Compiler can automatically add this kind of memoization at build time. No compiler setup is required for this project.

## Accessibility and design

One palette (navy sidebar, teal accent, light-gray background, white cards), one font (Inter), consistent button and badge styles. All form fields have labels, errors use `role="alert"`, keyboard focus is clearly visible, and colour is never the only signal (badges include text). Status colours: red (error/overdue/high), amber (pending/medium), green/teal (success/completed).

## What I learned

_Write 3–5 lines in your own words here and on your submission sheet._