# GrowthGenie AI Commerce

A client-side, agent-assisted commerce storefront built with React, GenMB managed capabilities, and a persistent KV-backed product catalog.

## Masterplan

- Help shoppers discover products through conventional catalog browsing or a rule-based conversational shopping assistant.
- Serve signed-in customers with persistent carts, wishlists, addresses, profile preferences, order history, and reviews.
- Provide a role-gated admin workspace for catalog, inventory, customer, order, and sales management.
- Operate without a separate application server by using the injected `window.genmb` Auth, KV, Billing, and Address capabilities.
- Seed a realistic multi-category demo catalog so the storefront remains usable from first launch.

## Tech Stack & Architecture

- **Frontend:** React + TypeScript, bootstrapped by Vite.
- **Routing:** `react-router-dom` with `HashRouter` in `src/main.tsx`. URLs use hash routing (`#/shop`, `#/product/:id`) to avoid server-side route configuration.
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite`; global design tokens and custom animation are in `src/styles/main.css`.
- **Icons:** `lucide-react`.
- **Utility classes:** `clsx` and `tailwind-merge`, wrapped by `cn()` in `src/lib/utils.ts`.
- **Platform integrations:** GenMB browser SDK injected in `index.html`:
  - `window.genmb.auth` for Google, password, magic-link, signup OTP, logout, and session state.
  - `window.genmb.kv` for persistent application records.
  - `window.genmb.billing` for hosted checkout and payment-session verification.
  - `window.genmb.address` for validation, normalization, formatting, and autocomplete.
- **No custom backend/API server exists.** There are no REST endpoints, ORM models, server-side environment variables, or direct database connection in this codebase. Persistence is performed from the browser through GenMB KV keys.
- **Application state:** `App` in `src/App.tsx` owns the session-dependent shared state:
  - `user`, `profile`, `catalog`, `cart`, `wishlist`, loading status, and toast queue.
  - Shared actions are passed as the local `AppContext` object to route-level page components.
  - KV is the source of truth; UI state is refreshed after writes.
- **Data flow:** UI → helper in `src/lib/store.ts` → `window.genmb.kv` / Billing / Address SDK → refresh local React state.
- **AI flow:** chat UI calls `runAgent()` from `src/lib/agent.ts`. This is a deterministic local recommendation engine, not an LLM/API integration.

## File Structure

```text
index.html                    GenMB SDK injection, application metadata, and Vite root element.
package.json                  Vite/React/Tailwind project dependencies and scripts.
vite.config.ts                Enables React and Tailwind Vite plugins.

src/
├── main.tsx                  React entry point; wraps App in StrictMode and HashRouter.
├── App.tsx                   Route views, shared app state, storefront/customer/admin flows, and page components.
├── components/
│   └── ui.tsx                Reusable Button, input/select fields, cards, ratings, modal, empty-state, and toast UI.
├── data/
│   └── products.ts           Product type and seeded demo catalog (20+ products).
├── lib/
│   ├── agent.ts              Local shopping-agent ranking, comparison, and follow-up logic.
│   ├── store.ts              GenMB KV persistence layer, seed process, and domain types.
│   └── utils.ts              Class merging, USD formatting, discounted-price, and date helpers.
├── styles/
│   └── main.css              Tailwind import, oklch theme tokens, base styles, and fade-in animation.
└── types/
    └── genmb.d.ts            Type declarations for injected GenMB auth/KV/billing/address APIs.
```

## Key Features

### Catalog and product discovery

- `src/data/products.ts` defines the `Product` model:

  ```ts
  type Product = {
    id, name, description, category, price, discount, stock,
    rating, reviewCount, image, brand, tags, popularity, createdAt
  }
  ```

- `ensureCatalog()` in `src/lib/store.ts` seeds products and coupons once using the `catalog:seeded` KV marker.
- Products are persisted independently under `product:{id}` and loaded by `listProducts()`.
- Catalog UI supports product browsing, product detail views, category discovery, filtering, sorting, stock display, related/recommended product presentation, and search behavior implemented in `src/App.tsx`.
- Use `salePrice(product.price, product.discount)` rather than manually calculating displayed prices. It rounds to cents and is used across product cards, cart, agent, and checkout.

### Authentication and profiles

- Authentication is supplied by the injected GenMB SDK, initialized with `await window.genmb.auth.ready()` before loading user-specific data.
- `ensureProfile()` creates a profile on first authenticated session:

  ```ts
  type UserProfile = {
    id, name, email,
    role: 'customer' | 'admin',
    joinedAt, preferences
  }
  ```

- Admin role is currently derived strictly from `admin@growthgenie.ai` in `ensureProfile()`. `ADMIN_EMAIL` is also declared in `src/App.tsx`.
- Do not treat this client-side role derivation as strong server-side authorization; security boundaries depend on the GenMB capability platform.

### Cart, wishlist, coupons, and checkout

- Cart records are stored as `user:{userId}:cart`; wishlist records as `user:{userId}:wishlist`.
- Cart items store only `productId` and `quantity`; current product data is joined from the loaded catalog at render time.
- Adding to cart requires sign-in and checks stock. Quantity is capped at current stock.
- Coupon records are seeded as:
  - `WELCOME10`: 10% off orders of $50+
  - `SPRING15`: 15% off orders of $150+
- Checkout creates an order record and uses `window.genmb.billing.checkout()` / `verifySession()` for payment completion.
- Payment/session IDs are retained with the order:

  ```ts
  type Order = {
    id, userId, email, items, address,
    subtotal, discount, total, couponCode?,
    status, createdAt, paymentSessionId
  }
  ```

- Order statuses are: `Processing`, `Paid`, `Packed`, `Shipped`, `Delivered`, and `Cancelled`.

### Addresses, orders, reviews, and AI conversations

- Saved addresses use `user:{userId}:address:{addressId}`.
- Address validation should use `window.genmb.address.validate()` before persistence/checkout; use returned normalized data when supplied.
- Customer orders are written twice:
  - `user:{userId}:order:{orderId}` for customer history.
  - `order:{orderId}` for global admin order listing.
- Reviews are scoped per product: `review:{productId}:{reviewId}`.
- AI messages are persisted per user at `user:{userId}:conversation:{conversationId}` and modeled as:

  ```ts
  type Conversation = {
    id, role: 'user' | 'agent', text, productIds?, createdAt
  }
  ```

### AI shopping assistant

- `src/lib/agent.ts` implements the fallback agent used today.
- It ranks in-stock products using:
  - matching name, description, category, brand, and tags;
  - rating, popularity, and discount;
  - natural-language budget patterns such as “under $100”;
  - rating requests such as “rated 4.5”;
  - sale/discount and explicit brand intent.
- The agent uses the last four conversation messages as context.
- Comparison works only when two recognizable product-name prefixes are included in the current input.
- The agent can recommend items and direct shoppers toward cart/checkout. Product add actions remain UI-driven through the recommendation cards and `addToCart()`.
- There is no external AI key, streaming response, tool-calling API, or server-side LLM integration in the current implementation.

### Admin operations

- Admin views in `src/App.tsx` use the same KV store to manage products, stock, profiles, and globally stored orders.
- Product CRUD delegates to `saveProduct()` and `removeProduct()` in `src/lib/store.ts`.
- Sales and product analytics are computed from persisted order/product data in the client.
- Ensure admin route guards remain in place whenever adding admin pages. Do not rely only on hiding navigation links.

## Design Guidelines

- **Visual direction:** clean, premium, approachable commerce UI with light surfaces, compact rounded cards, restrained shadows, and violet/indigo accents.
- **Color system:** CSS custom properties in `src/styles/main.css` use `oklch`. The primary interactive color is violet (`--primary`); destructive actions use warm red (`--destructive`).
- **Typography:** `Inter, ui-sans-serif, system-ui, sans-serif`; no external font import is configured.
- **Component language:** rounded `lg` controls/cards, 40px minimum interactive control height, visible keyboard focus rings, concise uppercase metadata labels, and `lucide-react` icons.
- **Product imagery:** demo images use seeded `picsum.photos` URLs. `ProductCard` provides a seeded fallback image on image load failure.
- **Responsive behavior:** layouts are Tailwind responsive grids/stacks; preserve the 320px minimum viewport support declared in `main.css`. Navigation and commerce controls should remain touch-friendly on mobile.
- **Feedback:** use `ToastViewport`, loading buttons, empty states, disabled sold-out actions, and inline field errors rather than silent failures.
- **Motion:** use the existing short transitions and `.fade-in` animation; avoid large or distracting animation systems.

## App Flow

1. **Boot**
   - `App` waits for GenMB auth readiness.
   - It restores the current user, ensures their profile, seeds/loads the catalog, and then loads cart/wishlist data for authenticated users.
   - Failures produce toast notifications rather than crashing the route tree.

2. **Browse and discover**
   - Visitors can browse the home and shop experiences, open product detail pages, search/filter/sort products, and use the AI assistant.
   - Attempting to save a wishlist item or add to cart while signed out shows a sign-in guidance toast.

3. **Shopping assistant**
   - Shopper submits a natural-language request.
   - Agent ranks available catalog products and returns up to three recommendations plus explanatory text.
   - Shopper can refine the conversation, compare recognizable products, or add a displayed recommendation to cart.

4. **Cart and checkout**
   - Signed-in users adjust quantities, remove items, apply eligible coupon codes, and proceed to checkout.
   - They select/create an address, which is validated through the Address capability.
   - Billing is initiated through GenMB; payment completion is verified before final order state is treated as paid.
   - Successful checkout clears or updates the cart and leads to order confirmation/history.

5. **Post-purchase**
   - Users view order history, order details, tracking status, profile data, saved addresses, wishlist, and reviews.
   - Admin users can inspect all orders and update fulfillment statuses.

### Key edge cases

- Catalog initialization depends on `window.genmb.kv`; if unavailable, `requireKV()` intentionally throws a user-visible startup/data error.
- The `catalog:seeded` marker prevents reseeding. Editing `seedProducts` does **not** overwrite an already initialized catalog without manually changing/removing that marker.
- A cart can reference a product that an admin later deletes; pages must handle missing product joins safely.
- Stock is checked client-side when adding and editing cart quantities; checkout should re-check current catalog stock before order creation.
- Billing redirect/cancellation paths must retain enough state to verify the payment session before marking an order paid.
- HashRouter means internal links should use React Router `Link`, not hard-coded server paths.

## Conventions

- Use TypeScript domain types from `src/lib/store.ts`, `src/data/products.ts`, and `src/types/genmb.d.ts`; do not introduce duplicate model definitions in page components.
- Keep storage access centralized in `src/lib/store.ts`. Components/pages should not call `window.genmb.kv` directly.
- KV keys are part of the persistence contract. Follow existing prefixes:
  - `product:`
  - `user:{id}:profile`
  - `user:{id}:cart`
  - `user:{id}:wishlist`
  - `user:{id}:address:{addressId}`
  - `user:{id}:order:{orderId}`
  - `order:{orderId}`
  - `review:{productId}:{reviewId}`
  - `user:{id}:conversation:{conversationId}`
- Use `crypto.randomUUID()` for new client-generated entity IDs.
- Use shared UI primitives from `src/components/ui.tsx` for controls, field semantics, loading states, modal behavior, empty states, product cards, and toasts.
- Use Tailwind utility classes in JSX and `cn()` for conditional class composition. Keep global CSS limited to tokens, browser defaults, and reusable animations.
- Use `money()`, `salePrice()`, and `dateLabel()` from `src/lib/utils.ts` for all displayed money, discounts, and dates.
- New user-dependent features should:
  1. add a typed persistence helper in `src/lib/store.ts`;
  2. load/refresh through `App` context or page-local async state;
  3. require `ctx.user` before writes;
  4. show success/error feedback with `ctx.notify`;
  5. handle empty, loading, and unavailable-product states.
- New admin capabilities must verify `profile.role === 'admin'` before rendering or mutating data, not merely hide UI controls.

## Platform (GenMB)

This app is built and hosted on GenMB.

**Runtime:** Browser sandbox (iframe) or Cloud Run. No Node.js server — all code runs client-side unless `backend/` exists.

**Dependencies:** CDN-only (esm.sh, cdn.tailwindcss.com, unpkg). Use ES module imports with full CDN URLs. No `npm install` at runtime.

**Entry point:** `index.html` must include all CDN script tags. Tailwind via CDN with inline config.

**Built-in services (relative API paths only, never hardcode domains):**
- `/api/ai/completion` — AI proxy | `/api/data/{appId}/*` — PostgreSQL (DataConnect SDK)
- `/api/storage/{appId}/*` — File uploads (GCS) | `/api/auth/google/*` — Google OAuth
- `/api/contact/submit` — Contact form | SDKs: `window.genmb.db`, `.storage`, `.auth`

**File structure:** `index.html` (entry), `src/` (source), `styles/` (CSS), `backend/` (optional FastAPI), `CLAUDE.md` (this file).

**Cannot:** Install npm packages at runtime, access filesystem, make direct server-side calls from frontend, modify infra.
