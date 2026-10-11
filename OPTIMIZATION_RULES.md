# React Optimized Project Rules

> Practical checklist for production React apps. Focus on **what approach to take**, not how to implement it.

## 01. Prevent Unnecessary Re-renders
- **Memoization:** Use `React.memo`, `useMemo`, and `useCallback` only when they prevent measurable unnecessary work.
- **Stable References:** Prefer stable primitive, object, array, and function references when identity affects rendering.
- **State Updates:** Use functional updates when new state depends on previous state.

## 02. State Optimization
- **Local State:** Keep state close to the component that owns the behavior.
- **Single Source of Truth:** Avoid duplicate state; derive values from existing state/props.
- **Component Structure:** Split large components and state by responsibility.
- **Global State:** Use it only when multiple distant parts genuinely need it.
- **Lazy Initialization:** Use for expensive initial state calculations.

## 03. useEffect Optimization
- **Dependencies:** Keep dependency arrays accurate and complete.
- **Avoid Effects:** Don't use effects for derivation or logic that belongs in render/events.
- **Cleanup:** Clean subscriptions, timers, listeners, requests, and external resources.
- **Async Safety:** Use `AbortController`, debouncing, and race-condition prevention where needed.

## 04. Context Optimization
- **Split Contexts:** Separate unrelated or differently changing data.
- **Stable Providers:** Memoize provider values and callbacks when identity matters.
- **Provider Scope:** Keep providers as close as possible to their consumers.
- **Avoid High-Frequency Context:** Use a more suitable state strategy when updates are frequent.

## 05. List Optimization
- **Stable Keys:** Use stable unique item identifiers.
- **Memoized Items:** Memoize independently rendering list items when useful.
- **Stable Props:** Avoid unnecessary inline objects/functions that break memoization.
- **Large Lists:** Use pagination/infinite loading and virtualization when justified.

## 06. Data Fetching
- **TanStack Query:** Treat remote data as server state.
- **Queries:** Use stable query keys, caching, `staleTime`, `gcTime`, and request deduplication.
- **Mutations:** Synchronize affected cached data through targeted invalidation or updates.
- **Large Data:** Use pagination/infinite queries.
- **UX:** Use optimistic updates and prefetching when predictable and justified.

## 07. API Request Optimization
- **Avoid Duplicates:** Share, cache, and deduplicate identical requests.
- **Cancel Requests:** Stop obsolete network work with `AbortController`.
- **Search:** Debounce rapidly changing search requests.
- **Focused Data:** Request only required records and fields.
- **Large Data:** Prefer server-side pagination.

## 08. Code Splitting
- **Lazy Loading:** Use `dynamic import()`, `React.lazy()`, and `Suspense` for non-critical code.
- **Routes:** Prefer route-based lazy loading.
- **Heavy Features:** Lazy-load charts, editors, exports, and other large optional libraries.

## 09. Bundle Optimization
- **Dependencies:** Avoid unnecessary packages and import only what is required.
- **Tree Shaking:** Prefer tree-shakable imports/modules.
- **Heavy Code:** Defer large features with dynamic imports.
- **Analyze:** Use Bundle Analyzer instead of guessing bundle problems.

## 10. Image & Asset Optimization
- **Images:** Lazy-load appropriate below-the-fold images.
- **Layout Stability:** Always reserve image dimensions.
- **Formats:** Prefer WebP/AVIF where practical.
- **Responsive Assets:** Serve appropriate image sizes.
- **Fonts/SVG:** Optimize fonts, SVGs, and non-critical backgrounds.

## 11. Input & Event Optimization
- **Debounce:** Use when only the final input matters.
- **Throttle:** Use for continuous events like scroll/resize.
- **Search:** Combine debounce, cancellation, caching, and server filtering.
- **Events:** Keep handlers lightweight, clean listeners, and use `requestAnimationFrame` for visual work.

## 12. Expensive Computation
- **Memoize:** Cache expensive calculations only when repeated work is measurable.
- **Data Processing:** Optimize filtering, sorting, and deterministic transformations.
- **Static Values:** Move calculations independent of props/state outside components.
- **Web Workers:** Use for genuinely CPU-heavy browser-side work.

## 13. Loading UX
- **Loading:** Use skeletons and focused `Suspense` fallbacks where appropriate.
- **Async Actions:** Always communicate pending states.
- **Error/Empty:** Clearly distinguish loading, error, and empty states.
- **Optimistic UI:** Update predictable interactions immediately and reconcile with the server.

## 14. Performance Debugging
- **Profile First:** Use React DevTools Profiler to identify unnecessary renders.
- **Network:** Inspect duplicate requests, payload sizes, images, fonts, and timings.
- **Performance:** Check main-thread blocking, long tasks, layout, paint, and events.
- **Lighthouse/Bundle Analyzer:** Use them to identify loading, asset, Core Web Vital, and bundle issues.
- **Rule:** `Measure → Fix → Measure`

## 🧠 Global Rules
- Optimize only for a real or measurable bottleneck.
- Avoid premature optimization; prioritize correctness and maintainability.
- Never change business logic, API contracts, UI behavior, accessibility, or output.
- Prefer the simplest effective optimization.
- Minimize unnecessary rendering, computation, network activity, JavaScript, DOM, and assets.
- Validate with production builds and realistic devices/data/networks.
- Keep dependencies intentional and optimize the critical path first.
- `useMemo`, `useCallback`, `React.memo`, debounce, throttle, lazy loading, and Web Workers are **tools, not defaults**.
- **Final Rule:** `Measure → Identify → Optimize → Verify`

# 🚀 BACKEND OPTIMIZATION RULES

## 0. Performance Fundamentals
- Measure before optimizing; identify the actual bottleneck first.
- Analyze latency, throughput, memory, CPU, I/O, and network independently.
- Never assume the database is the bottleneck.
- Avoid premature optimization.

## 1. HTTP / API Performance
- Send only required fields using MongoDB projection/select.
- Use pagination for large datasets; avoid huge arrays in responses.
- Use offset pagination for simple datasets and cursor/keyset for large feeds.
- Always combine pagination with proper filtering, sorting, and stable sort fields.
- Filter and sort inside the database, backed by appropriate indexes.
- Use `Cache-Control` and ETag/conditional requests where useful.
- Use immutable long-lived caching for versioned static assets.
- Never publicly cache sensitive/user-specific responses.
- Rate-limit expensive/sensitive endpoints; use stricter limits for login, OTP, email, AI.
- Return `429` when limited; use Redis for centralized limits and infrastructure DDoS protection.

## 2. Node.js Performance
- Never unnecessarily block the event loop; use async I/O.
- `async/await` does not make CPU-heavy work non-blocking.
- Run independent I/O concurrently with `Promise.all()`; keep dependent work sequential.
- Identify CPU-bound vs I/O-bound bottlenecks before optimizing.
- Use streams and backpressure for large files/data instead of loading everything into memory.
- Avoid huge datasets, unbounded caches, and retained references in memory.
- Use Worker Threads for CPU-heavy request-time work.
- Use background jobs/queues for emails, reports, notifications, image processing, etc.

## 3. Database Access
- Minimize unnecessary database round trips and redundant queries.
- Batch related operations instead of querying repeatedly.
- Never perform unnecessary database queries inside loops (**N+1**).
- Use `$in` for multiple lookups and `bulkWrite()` for large write batches.
- Run independent database queries concurrently with `Promise.all()`.
- Reuse MongoDB connections; connect once at startup.
- Tune `maxPoolSize` only when workload requires it; bigger pools aren't automatically faster.
- Use transactions only when atomicity is required and keep them short.
- Protect expensive queries with reasonable limits such as `maxTimeMS`.

## 4. MongoDB Query Optimization
- Query only required data using projection/select.
- Filter and paginate at the database level.
- Avoid unnecessary `populate()` and aggregation stages.
- Don't fetch everything just to count/filter in JavaScript.
- Analyze slow queries with `explain()` instead of guessing.

## 5. MongoDB Indexing
- Design indexes from real query patterns, not assumptions.
- Don't index every field; indexes improve reads but add storage and write overhead.
- Use indexes for frequent filters, sorting, and compound query patterns.
- Compound index field order matters; use ESR as a design heuristic:
  `E = Equality → S = Sort → R = Range`
- Example: `{ department: 1, status: 1, name: 1, createdAt: 1 }`
- Use selective fields, unique indexes for uniqueness, and TTL indexes for expiring data.
- Verify index effectiveness with `explain()`.

## 6. 🧠 General Golden Rules
- `Measure → Identify Bottleneck → Optimize → Measure Again`
- Reduce unnecessary rendering, database calls, data transfer, memory, and CPU work.
- Run independent I/O concurrently.
- Move expensive work away from the request-response path when possible.
- Cache repeated expensive operations when appropriate.
- Prefer simple optimizations before complex architecture.
- Never optimize something that isn't a bottleneck.
- Always verify improvements with real measurements.