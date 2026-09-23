# Project Documentation Source

## Purpose and Evidence Rules

This document is an evidence-based analysis of the current codebase at the time of inspection. It is source material for later academic or project documentation. It describes behavior found in source code, package manifests, configuration, and routes. Repository README claims are not treated as proof when the corresponding implementation was not found.

Sensitive values from `.env` files are intentionally omitted. Environment variable names are documented, but passwords, tokens, connection strings, API keys, and client secrets are not included.

Feature status uses:

- **Fully implemented**: a user-facing or API workflow is present and connected end to end in the inspected code.
- **Partially implemented**: some related code exists, but the feature has limitations, missing safeguards, or incomplete workflow coverage.
- **Placeholder**: a visible control, page, or label exists but the meaningful operation is not implemented.
- **Not implemented**: no working implementation was found in the current source.

---

# 1. Project Structure

## Project identity

- Working project directory: `Digital Menu`.
- Product-style name used in the UI and documentation: **Digital Menu**.
- General system category: full-stack restaurant digital menu and food-ordering system with an administration dashboard.
- The root README describes the project as a restaurant web application and identifies the author as Abirham Muche.

## Top-level structure

```text
Digital Menu/
├── frontend/
├── backend/
├── public/root deployment configuration
├── README.md
├── feature and integration notes (*.md)
└── .vscode/
```

### `frontend/`

The React customer and administrator web application. Important areas include:

- `src/App.jsx`: top-level routing, loading screen, public/admin layout selection, and admin route guard.
- `src/main.jsx`: React entry point; mounts `AppContextProvider` inside `BrowserRouter`.
- `src/context/AppContext.jsx`: central application state, API helpers, authentication state, settings, cart, promo, chat, language, and data loading.
- `src/pages/`: customer pages and admin pages.
- `src/components/`: reusable customer, menu, cart, ratings, navigation, footer, chat-related, and admin components.
- `src/assets/`: static food/category assets, translations, icons, and fallback/demo data.
- `public/`: public logos, SVG icons, and favicon.
- `index.css`: Tailwind import, Google font import, global styles, animations, scrollbar behavior, and admin active navigation styling.
- `package.json`: frontend scripts and dependencies.
- `vite.config.js`: Vite, React, and Tailwind Vite plugin configuration.
- `eslint.config.js`: ESLint flat configuration.
- `vercel.json`: SPA rewrite configuration.
- `.env`: frontend environment configuration; values are not reproduced here.

### `backend/`

The Node.js API server and database integration. Important areas include:

- `server.js`: Express application, dotenv loading, CORS, JSON parsing, connection initialization/reconnection, route mounting, health/status routes, and error handlers.
- `config/mongodb.js`: Mongoose/MongoDB connection management and serverless connection reuse.
- `config/cloudinary.js`: Cloudinary configuration.
- `controllers/`: business logic for users, food, categories, cart, orders, promos, ratings, chat, settings, and Chapa payments.
- `routes/`: Express route modules grouped by domain.
- `models/`: Mongoose schemas and models.
- `middleware/`: user JWT authentication, admin JWT authentication, and Multer upload configuration.
- `scripts/test-connection.js`: manual MongoDB connectivity check.
- `package.json`: backend scripts and runtime dependencies.
- `.env.example`: names and descriptions of expected backend environment variables.
- `vercel.json`: backend Vercel function and API routing configuration.

### Root documentation files

The root contains the general README plus implementation notes for language/currency work, order authorization fixes, profile/menu enhancements, component examples, and several Chapa payment integration/troubleshooting documents. Those documents are useful cross-reference material, but the source code is the authority for feature status in this analysis.

### Configuration/deployment files

- Root `vercel.json`: builds frontend as a static build and backend as a Vercel Node function; routes `/api/*` to the backend and other paths to the frontend SPA.
- `backend/vercel.json`: backend function and API route configuration.
- `frontend/vercel.json`: rewrites frontend paths to `index.html`.
- `frontend/vite.config.js`: Vite React plugin and Tailwind CSS Vite plugin.
- `frontend/eslint.config.js`: ESLint recommended JavaScript rules, React Hooks rules, and React Refresh rules.
- `.vscode/settings.json`: workspace editor settings.

### Tests and shared directories

- No dedicated test directory was found.
- No files matching common `*.test.*` or `*.spec.*` patterns were found.
- No shared/common package or shared backend/frontend source directory was found.
- The only executable test-like utility is `backend/scripts/test-connection.js`, which checks MongoDB connectivity.

---

# 2. Technology Stack

## Frontend

### Framework and language

- **React 19** is used for the component-based UI.
- The source language is JavaScript with JSX, not TypeScript.
- `ReactDOM.createRoot` mounts the application.
- React hooks such as `useState`, `useEffect`, `useContext`, `useMemo`, `useRef`, and `useParams` are used throughout.

### Build tool

- **Vite** builds and serves the frontend.
- `vite.config.js` registers `@vitejs/plugin-react` and `@tailwindcss/vite`.
- Scripts:
  - `npm run dev`: Vite development server.
  - `npm run build`: production build.
  - `npm run preview`: preview the production build.
  - `npm run lint`: ESLint.

### Styling and UI

- **Tailwind CSS v4** is used through the Vite plugin and utility classes in JSX.
- `index.css` imports Tailwind and defines global styles, font imports, active navigation behavior, scrollbar hiding, and custom animation keyframes.
- Fonts loaded from Google Fonts include Outfit, Manrope, Prata, Agbalumo, Abyssinica SIL, and Noto Sans Ethiopic. The global font family is Outfit.
- `react-icons` provides Font Awesome, Material, and other icon components.
- `framer-motion` is used for animated UI components and `AnimatePresence` route transitions.
- `react-toastify` provides toast notifications.
- `react-loading-skeleton` and `react-spinners` are dependencies; the source visibly uses a custom `SkeletonLoader` and CSS spinners in multiple pages.

### State management

- The primary state mechanism is a custom React Context named `AppContext`.
- `AppContextProvider` stores authentication, current user, food, categories, settings, cart, orders, promo state, chat threads, language, currency, and loading state.
- `zustand` is listed as a dependency but no source import was found, so Zustand is not an active state-management implementation in the inspected source.
- Cart data itself is persisted by the backend in the user document; the context holds the current client copy.

### Routing

- `react-router-dom` supplies `BrowserRouter`, `Routes`, `Route`, `Navigate`, `useNavigate`, `useLocation`, `useParams`, and `useSearchParams`.
- Public routes and nested admin routes are declared in `frontend/src/App.jsx`.
- The admin route is protected in the frontend by the `isAdmin` context flag and redirects to `/admin/login` when false.
- Backend authorization remains the real API boundary because frontend route guards can be bypassed by a client.

### HTTP/API client

- **Axios** is used for all frontend HTTP requests.
- The base API value comes from `VITE_BACKEND_URL`; when empty, the context uses an empty prefix, which supports same-origin deployment.
- User requests send a custom `usertoken` header.
- Admin requests send a custom `admintoken` header.
- Multipart `FormData` is used for food and category image/form submissions.

### Forms and validation

- Forms use controlled React state and native HTML constraints such as `required`, `type="email"`, numeric inputs, and submit handlers.
- Backend controllers perform additional checks for authentication, ownership, required fields, status values, rating ranges, promo rules, and settings ranges.
- `react-hook-form` is listed as a dependency but no import/use was found.

### Internationalization and currency

- A local `translations.js` object supplies English and Amharic strings through the `t` and `tAdmin` helpers.
- Customer and admin language preferences are stored in `localStorage` under `language` and `admin_language`.
- The active currency is ETB. `changeCurrency` forces ETB, and backend settings constrain currency to ETB.
- Food/category names, descriptions, types, ingredients, and selected UI labels support English/Amharic fallbacks.

### Other frontend libraries actually used or connected

- `qrcode.react`: renders QR codes for table menu links.
- `jspdf` and `jspdf-autotable`: exports admin order tables to PDF.
- `dayjs`, `lodash`, `recharts`, `chart.js`, `react-chartjs-2`, `react-dropzone`, `i18next`, `react-i18next`, `cloudinary`, and `clsx` are declared dependencies, but no active source import was found for these libraries during inspection. Their use is therefore **Not confirmed from the codebase**.

## Backend

### Runtime

- Node.js runtime.
- The backend package uses ES modules through `"type": "module"`.
- Local startup uses `node server.js` and defaults to port `4000` when `PORT` is not set.
- Vercel uses `backend/server.js` as a Node serverless function.

### Framework and language

- **Express 5** handles HTTP routing and middleware.
- Backend source is JavaScript using ES module imports/exports.
- **Mongoose 9** provides MongoDB ODM schemas, models, queries, aggregation, population, indexes, and validation.

### API architecture

- REST-style API grouped under `/api/user`, `/api/food`, `/api/category`, `/api/cart`, `/api/order`, `/api/promo`, `/api/rating`, `/api/chat`, `/api/chapa`, and `/api/settings`.
- Controllers contain domain business logic; route modules attach middleware and controller functions.
- JSON request/response is the normal format. Food/category create/edit operations additionally accept multipart form data.
- Successful and failed responses commonly use `{ success, message, ... }`.

### Authentication

- User authentication uses JWTs signed with `JWT_SECRET` and expiring after seven days.
- User tokens contain the user database ID and are supplied through the `usertoken` request header.
- Admin login compares submitted credentials with `ADMIN_EMAIL` and `ADMIN_PASSWORD`, then signs a JWT containing `{ id: "admin", email }`.
- Admin tokens are supplied through the `admintoken` request header and also expire after seven days.
- Frontend tokens are stored in browser `localStorage`.
- There are no refresh tokens, server-side sessions, password reset endpoints, or email verification workflow in the inspected code.

### Authorization and RBAC

- `userAuth` verifies a JWT and sets `req.userId`.
- `adminAuth` verifies the JWT and requires both `tokenDecode.id === "admin"` and `tokenDecode.email === process.env.ADMIN_EMAIL`.
- Admin API routes use `adminAuth`; customer-specific APIs use `userAuth`.
- The Mongoose user model has a `role` field with `user` and `admin` enum values, but backend authorization does not authorize based on this persisted role. Admin access is based on environment credentials and the special admin JWT claims.
- Food/category `POST /add` routes are not protected by `adminAuth` in the backend route definitions, even though the admin frontend sends an admin token. This means those write endpoints are publicly callable at the API boundary.

### Validation

Implemented examples include:

- Registration duplicate-email, password confirmation, email format, and minimum eight-character password checks.
- Google ID token presence and Google `email_verified` checks.
- Required order items, existing food and user checks, order ownership, payment method-specific checks, and valid order statuses.
- Cart food existence, user existence, and quantity minimum on cart update.
- Promo existence, active status, expiration, redemption limit, user reuse, user limit, and discount-budget checks.
- Ratings require food/order IDs, a rating from 1 to 5, a delivered order, ownership, and presence of the food in the order.
- Settings require non-negative delivery/threshold values, tax between 0 and 100, and a non-empty Telebirr account name.
- Mongoose schema constraints enforce required fields, enums, minimum values, uniqueness, and an indexed unique rating combination.

Validation is inconsistent in some write paths. Food/category creation relies heavily on Mongoose and parsed request values and does not consistently validate every numeric value, file presence, or enum before performing work. Order quantity validation is not comprehensive before multiplication.

### Error handling

- Most controllers wrap work in `try/catch`, log the error, and return JSON with `success: false` and a message.
- Some authentication and validation failures return HTTP 4xx codes.
- Several older user/food/category paths return HTTP 200 with `success: false` for business errors.
- Express has a JSON 404 handler and a global 500 handler.
- Database connection middleware returns HTTP 503 when MongoDB cannot be connected.
- Cloudinary upload failures are logged and the record can continue with missing image URLs.
- The frontend generally displays backend messages through `toast` notifications.

### Middleware

- `cors`: allows configured local and Vercel frontend origins, credentials, common methods, and custom auth headers.
- `express.json()` and `express.urlencoded()` parse JSON and URL-encoded requests.
- A request-time MongoDB connection middleware reconnects after cold starts or disconnects.
- `userAuth`: user JWT verification.
- `adminAuth`: admin JWT verification.
- `multer`: disk-backed multipart upload handling; uploaded files are later sent to Cloudinary.

### Logging

The backend uses `console.log`, `console.warn`, and `console.error` for:

- Startup and connection status.
- Masked MongoDB URI connection logging.
- Cloudinary configuration status.
- Request/controller progress for carts, orders, food edits, ratings, and payments.
- Chapa initialization, verification, webhook, and error diagnostics.
- Promo validation debugging in the already-used-user path.

There is no structured logging library or centralized log persistence found.

### Important backend libraries

- `express`: HTTP server and routing.
- `mongoose`: MongoDB ODM.
- `jsonwebtoken`: user/admin JWT creation and verification.
- `bcrypt`: local password hashing and comparison.
- `validator`: email validation.
- `axios`: Google token-info calls and Chapa API calls.
- `cors`: CORS policy.
- `dotenv`: environment loading.
- `cloudinary`: remote image uploads.
- `multer`: multipart file handling.
- `nodemon`: development server restart script.

---

# 3. System Overview

## Main purpose

Digital Menu is a restaurant-facing digital ordering platform. Customers can browse a restaurant menu, inspect food details, add foods to a cart, apply promotions, complete a checkout flow, submit payments through available payment methods, follow order status, contact an administrator, and rate delivered food. Administrators can manage menu data, categories, orders, promotions, ratings, settings, QR codes, and customer chat.

## Problem addressed

The system replaces a static or paper menu with an interactive restaurant ordering workflow. It centralizes:

- Menu presentation and category browsing.
- Customer cart and order creation.
- Restaurant-controlled fees, taxes, delivery thresholds, and Telebirr account settings.
- Cash, manual Telebirr, and Chapa payment flows.
- Customer feedback and support chat.
- Administrative menu, promotion, order, review, and operational management.
- Table-specific ordering entry through QR codes.

## Target users

1. **Customer**: browses food, creates orders, pays or submits payment evidence, tracks orders, chats with staff, and rates delivered items.
2. **Restaurant administrator**: manages the menu and categories, reviews orders and payment submissions, updates order status, configures settings and promo codes, moderates ratings, manages QR codes, and responds to chat.

No delivery-person, vendor, multi-restaurant, or separate system-administrator role was found.

## Overall architecture

```text
Customer browser / Admin browser
          |
          | React UI, React Router, AppContext, Axios
          |
          v
Vite-built frontend SPA
          |
          | REST requests with JSON or multipart FormData
          | usertoken / admintoken headers
          v
Express API on Node.js / Vercel Node function
          |
          +--> JWT authentication and authorization middleware
          +--> Controllers and business rules
          +--> Chapa API for online payment initialization/verification
          +--> Cloudinary API for image storage
          |
          v
Mongoose ODM
          |
          v
MongoDB Atlas collections
```

## Frontend/backend communication

- On startup, `AppContext` requests food, categories, and public settings.
- Customer actions call API endpoints through Axios.
- The backend reloads food records and prices when creating an order rather than trusting the client’s item prices.
- User JWTs are sent in `usertoken`; admin JWTs in `admintoken`.
- Food/category forms use multipart requests for images and fields.
- The frontend displays API failures with toast notifications and local status messages.

## Database interaction

- Mongoose models represent users, foods, categories, orders, promos, ratings, chat threads, and restaurant settings.
- Cart data is embedded as a flexible object on the user document, not a separate cart collection.
- Order items are embedded snapshots containing food ID, name, price, quantity, total price, and image so historical orders retain order-time values.
- Ratings reference users, foods, and orders and are populated when displayed.
- Chat messages are embedded in a chat thread document.
- The server creates a singleton-style restaurant settings document with `key: "restaurant"` if one does not exist.

## External services

- **MongoDB Atlas**: primary database, configured by `MONGODB_URI`.
- **Cloudinary**: food and category image upload service, configured by Cloudinary environment variables.
- **Google Identity Services and Google token-info endpoint**: Google sign-in and backend token verification.
- **Chapa**: payment initialization, server-side verification, callback/webhook, and return flow.
- **Vercel**: deployment target for frontend static build and backend Node function.

## Major modules

- Identity and authentication.
- Public menu and category discovery.
- Food detail and ratings.
- User cart.
- Checkout and payment.
- Order history, details, cancellation, and tracking.
- Promo-code management and application.
- Admin dashboard and analytics.
- Food and category administration.
- Order administration.
- Rating moderation.
- Customer/admin chat.
- Restaurant settings.
- Table QR code management.
- Language and ETB currency presentation.

---

# 4. User Roles and Access Control

## Customer/user

### Purpose

A registered customer can browse and order restaurant food, manage a cart, pay, monitor orders, communicate with staff, and submit eligible ratings.

### Permissions and actions

- Register with name, email, password, and confirmation password.
- Sign in with email/password.
- Sign in with Google ID token.
- View own profile.
- View foods and categories.
- View individual food details and public ratings.
- Add, update, remove, retrieve, count, and clear own cart.
- Validate and apply an eligible promo code.
- Create an order from food IDs and quantities.
- View own orders and individual own order details.
- Cancel own orders while pending or confirmed.
- Submit a Telebirr transaction ID for own Telebirr order.
- Initiate Chapa payment for own order.
- View own Chapa payment status.
- View delivered, unrated purchased items.
- Add, update, and delete own ratings subject to ownership and delivery rules.
- Open and send customer chat messages through authenticated chat routes.
- Use the public contact page and table QR entry route.

### Restrictions

- Cannot access admin API endpoints without a valid admin token.
- Cannot view another customer’s orders or ratings through ownership-checked endpoints.
- Can rate only foods included in a delivered order belonging to the user.
- Can cancel only orders with `pending` or `confirmed` status.
- Can use a promo only while its active, date, redemption, user, and budget rules pass.
- There is no customer role-management UI.

## Restaurant administrator

### Purpose

The administrator operates the restaurant’s menu, orders, pricing settings, promotion campaigns, ratings, QR tables, and support chat.

### Permissions and actions

- Log in with environment-configured admin email/password.
- View dashboard statistics, revenue and order status summaries.
- View customer count and customer list through admin APIs.
- Create/edit/delete foods through the admin UI; the backend route for creation is not itself protected.
- Edit and delete categories; category creation is also not protected in the backend route.
- View and update order lifecycle status.
- Approve submitted Telebirr payments.
- Delete delivered or cancelled orders.
- Export currently loaded/filtered orders to PDF.
- Create, list, edit, activate/deactivate, and delete promo codes.
- View, hide/show, reply to, and delete ratings.
- View customer chat threads, mark them read, and reply.
- Change restaurant delivery fee, tax rate, free-delivery threshold, and Telebirr account information.
- Generate, download, and delete table QR codes in browser storage.
- Switch admin interface language between English and Amharic where translations exist.

### Accessible pages

- `/admin/login`
- `/admin/dashboard`
- `/admin/products`
- `/admin/categories`
- `/admin/totalorders`
- `/admin/promotions`
- `/admin/qrcodes`
- `/admin/settings`
- `/admin/ratings`
- `/admin/chat`

### Restrictions and implementation notes

- Backend admin access requires a valid admin JWT whose ID is the literal `admin` and whose email matches `ADMIN_EMAIL`.
- Persisted user `role: "admin"` is not used for authorization.
- Admin UI protection is a client-side state check and localStorage token check.
- Admin logout removes `admintoken` from localStorage and navigates to the login page; the layout does not explicitly reset the context `isAdmin` flag in the logout function.
- Food/category add APIs are a notable authorization gap because their route definitions omit `adminAuth`.

## Other roles

- **Delivery personnel**: Not implemented.
- **Restaurant/vendor account separate from admin**: Not implemented or not confirmed from the codebase.
- **System administrator distinct from restaurant admin**: Not implemented.
- **Guest customer**: The chat data model and frontend create a `guestChatId`, but chat routes require `userAuth`. A fully unauthenticated guest chat workflow is therefore not available through the current API.

---

# 5. Complete Feature Inventory

## Authentication and identity

### User registration — Fully implemented

- **Purpose**: create a local customer account.
- **Flow**: customer submits name, email, password, and confirmation; backend checks duplicate email, matching passwords, email format, and minimum eight-character password; password is hashed with bcrypt; a seven-day JWT is returned.
- **Frontend**: `frontend/src/pages/Login.jsx`.
- **Backend**: `backend/controllers/userController.js`, `backend/routes/userRoute.js`.
- **Database**: `menuuser` document with name, email, hashed password, provider, role, and timestamps.
- **Endpoint**: `POST /api/user/register`.
- **Authorization**: public.
- **Business rules**: local registration sets role to `user`.

### Local login — Fully implemented

- **Flow**: email/password is compared with the bcrypt hash; successful login returns a JWT and basic user details.
- **Endpoint**: `POST /api/user/login`.
- **Frontend**: `Login.jsx` stores `usertoken` in localStorage and context.
- **Limitations**: some invalid credentials/errors return HTTP 200 with `success: false`.

### Google authentication — Fully implemented with external dependency

- **Flow**: Google Identity Services supplies an ID token in the browser. Backend calls Google’s token-info endpoint, requires `email_verified === "true"`, finds or creates the user, and returns the normal user JWT.
- **Endpoint**: `POST /api/user/google-auth`.
- **Configuration**: `VITE_GOOGLE_CLIENT_ID` frontend variable; Google token verification uses the backend’s Axios request.
- **Not implemented**: refresh tokens, password reset, and email verification.

### Admin login — Fully implemented

- **Flow**: submitted credentials are compared to `ADMIN_EMAIL` and `ADMIN_PASSWORD`; backend issues an admin JWT with `{ id: "admin", email }`.
- **Endpoint**: `POST /api/user/admin/login`.
- **Frontend**: `AdminLogin.jsx` stores `admintoken` and sets `isAdmin`.
- **Restrictions**: one environment-configured admin credential pair; no admin user database or multi-admin management.

### Logout — Partially implemented

- Customer logout removes `usertoken` in `Navbar.jsx` and changes client state/navigation.
- Admin logout removes `admintoken` and navigates to `/admin/login`.
- No backend token revocation or server-side session invalidation exists.

### Profile — Fully implemented for viewing

- **Endpoint**: `GET /api/user/profile` with `userAuth`.
- Returns the current user without password.
- A dedicated profile management page/update API was not found.

## Menu and catalog

### Public food browsing — Fully implemented

- **Purpose**: display available restaurant food.
- **Frontend**: `Home`, `MenuPage`, `Menu`, `FoodCard`, `CategoryPage`, `SearchFood`, and `FoodDetail`.
- **Endpoint**: `GET /api/food/list`.
- **Database**: `food` collection.
- **Rules**: if food collection is empty, backend attempts to seed default food records. Listing sorts by newest creation.
- **Status**: food records include `available`/`unavailable`; UI filtering exists in admin, while public availability filtering is not consistently enforced by the list endpoint.

### Category browsing and filtering — Fully implemented

- **Frontend**: category components and `/menu/:category` route.
- **Endpoint**: `GET /api/category/list`.
- **Database**: `Category` collection.
- **Rules**: backend seeds three default categories if the collection is empty and calculates product counts by matching `food.category` to category name.
- **Filtering**: frontend matches category IDs and localized names/types through context helpers.

### Food details — Fully implemented

- **Route**: `/menu/:category/:id`.
- **Frontend**: `FoodDetail.jsx` loads the food from context, shows localized data, image, ingredients, preparation time, rating display, sharing, quantity selection, related foods, and add-to-cart action.
- **API**: food list is loaded globally; public rating endpoint loads food reviews.
- **Sharing**: uses Web Share when available and falls back to clipboard.

### Search — Fully implemented on the frontend

- Search UI navigates to `/menu/search`.
- Search state and food filtering are handled by frontend components/context.
- No dedicated backend search endpoint was found.
- Pagination for public search was not found.

### Admin food management — Partially implemented

- **Frontend**: `adminpage/Products.jsx` supports list loading, search, category/status/price filters, sorting, pagination of ten items, add/edit form, delete, bilingual fields, image selection, availability status, popular/fast flags, ingredients, allergens, dietary tags, preparation time, and ratings fields.
- **Endpoints**:
  - `POST /api/food/add` with multipart fields and optional images.
  - `PUT /api/food/edit` with admin auth.
  - `POST /api/food/remove` with admin auth.
  - `GET /api/food/list`.
- **External service**: images are uploaded to Cloudinary.
- **Partial status**: `POST /api/food/add` lacks backend admin middleware; upload failures can save foods without images; validation is not comprehensive.

### Admin category management — Partially implemented

- **Frontend**: add/edit form with English/Amharic names and types, colors, ordering, image upload, list, and delete.
- **Endpoints**:
  - `POST /api/category/add` multipart; no backend admin middleware.
  - `PUT /api/category/edit` multipart with admin auth.
  - `POST /api/category/remove` with admin auth.
  - `GET /api/category/list`.
- **Rule**: category deletion is rejected when foods still use that category name.
- **Partial status**: add route authorization gap and limited validation.

### Wishlist/favorites — Not implemented

The root README mentions wishlist/favorites, but no wishlist model, route, controller, context state, or customer UI flow was found.

### Restaurant marketplace/multi-vendor browsing — Not implemented

Foods belong to one restaurant menu. No restaurant collection, vendor registration, vendor profile, or multi-restaurant selection was found.

## Cart and checkout

### Cart — Fully implemented with known data-integrity limitations

- **Frontend**: `Cart.jsx`, `CartPage.jsx`, and `AppContext.jsx` display items, quantity controls, remove actions, subtotal, delivery fee, tax, promo discount, and total.
- **Endpoints**:
  - `POST /api/cart/add`
  - `GET /api/cart/get`
  - `PUT /api/cart/update`
  - `GET /api/cart/count`
  - `DELETE /api/cart/remove`
  - `DELETE /api/cart/clear`
- **Database**: cart is stored in `menuuser.cartData` as a flexible object keyed by food ID.
- **Rules**: add increments an existing item; update requires quantity at least one; remove/clear mark the mixed object as modified before saving.
- **Price integrity**: cart stores price snapshots; order creation reloads food records and recalculates prices, which is the authoritative order total path.
- **Limitations**: add-to-cart does not reject non-positive or invalid quantities as thoroughly as it could; cart prices can become stale before checkout.

### Checkout — Fully implemented

- **Frontend**: `Checkout.jsx` collects customer name/email/phone/table, note, payment method, and coupon code.
- **Backend**: `POST /api/order/create` reloads food prices, applies current restaurant settings, validates promo rules, computes subtotal/tax/delivery/discount/total, creates the order, updates promo usage, and clears the user cart.
- **Totals**:
  - Tax uses admin-configured `taxRate`.
  - Delivery is free when subtotal reaches `freeDeliveryThreshold`; otherwise configured `deliveryFee` is applied.
  - Promo percentage values are converted to monetary discounts.
  - Fixed discounts are capped at the order amount in order creation.
  - Total is clamped to zero.
  - Fully covered orders are stored with `paymentStatus: "paid"`.
- **Important consistency note**: promo preview and order creation have separate implementations, so displayed validation and final server calculation can diverge for some edge cases, especially fixed discount caps and promo limits.

## Promo codes

### Promo administration — Fully implemented

- **Frontend**: `adminpage/PromoManagement.jsx`.
- **Endpoints**:
  - `GET /api/promo/list` admin.
  - `POST /api/promo/add` admin.
  - `PUT /api/promo/edit` admin.
  - `DELETE /api/promo/delete` admin.
- **Fields**: code, description, discount type (`percentage` or `fixed`), discount value, maximum redemptions, maximum users, total discount budget, expiry, active flag, redemption count, used users, and total discount used.
- **Database**: `promocode` collection.

### Promo application — Partially implemented

- **Frontend**: cart Apply action calls `POST /api/promo/validate`; context stores coupon code, type, rate, calculated discount, and message.
- **Order enforcement**: order creation repeats validation and records promo usage after saving the order.
- **Rules**: active code, not expired, redemption count, used-user restriction, user limit, and discount budget.
- **Partial status**:
  - Promo validation and order creation use separate checks.
  - Promo usage update is a read/modify/save sequence, not an atomic conditional update or transaction, so concurrent redemption protection is not confirmed.
  - Backend preview does not apply the same fixed-discount cap as order creation.

## Orders

### Customer order creation — Fully implemented

- **Endpoint**: `POST /api/order/create` with `userAuth`.
- **Source of truth**: server reloads foods and computes financial fields.
- **Stored data**: user reference, embedded item snapshots, subtotal, delivery fee, tax, discount, total, delivery data, payment method/status, coupon code, table, note, and estimated delivery time.
- **Payment routing**:
  - Cash and other non-Chapa/non-Telebirr paths navigate to orders after creation.
  - Telebirr paths navigate to a manual transaction submission page.
  - Chapa paths create the order, then initialize Chapa and redirect externally.

### Customer order history — Fully implemented

- `GET /api/order/my-orders` returns the current user’s most recent 50 orders.
- Frontend `/orders` displays order and payment status.
- `/orders/:orderId` displays detailed items, financial fields, status progress, payment state, and rating actions.

### Order tracking/status — Fully implemented

- Customer order detail renders a status progression: pending, confirmed, preparing, ready, delivering, delivered.
- Admin updates status through `PUT /api/order/admin/status/:orderId`.
- Valid statuses are enforced in the controller.

### Order cancellation — Fully implemented

- `PUT /api/order/cancel/:orderId` checks ownership and permits cancellation only for pending or confirmed orders.
- There is no promo-budget/refund reversal when an order is cancelled.

### Admin order management — Partially implemented

- **Frontend**: list, status dropdown, filtering, search, stats cards, Telebirr approval, deletion, transaction display, and PDF export.
- **Endpoints**:
  - `GET /api/order/admin/all` supports status, page, limit, and search query.
  - `GET /api/order/admin/stats` returns status counts, revenue, daily/monthly counts, average order value, and total order count.
  - `GET /api/order/admin/analytics` returns daily/monthly aggregation over a requested day range.
  - `PUT /api/order/admin/status/:orderId` updates lifecycle state.
  - `PUT /api/order/admin/payment/approve/:orderId` approves Telebirr payment.
  - `DELETE /api/order/admin/delete/:orderId` deletes only delivered/cancelled orders.
- **Placeholder**: the visible `New In-shop Order` control does not implement creation, and the edit icon displays “Edit functionality coming soon”.
- **Display inconsistency**: some admin order UI displays `$` although backend settings and customer flows use ETB.

## Payments

### Cash payment — Fully implemented as an order method

Cash is selectable at checkout. The order is initially pending unless the promo reduces the total to zero, in which case backend creation marks it paid. No cash collection confirmation workflow was found.

### Telebirr manual payment — Fully implemented

- Checkout creates a Telebirr order.
- `/telebirr-payment/:orderId` loads the order and displays restaurant account details and amount.
- Customer submits a transaction ID through `PUT /api/order/telebirr/:orderId`.
- Admin approves with `PUT /api/order/admin/payment/approve/:orderId`.
- Payment status changes to paid only after admin approval.
- Settings page controls account name and number.

### Chapa online payment — Partially implemented / configuration-dependent

- Checkout creates the order, then calls `POST /api/chapa/initiate`.
- Backend sends order amount, ETB currency, customer contact information, transaction reference, callback URL, return URL, and metadata to Chapa.
- Chapa checkout URL redirects the customer externally.
- `GET /api/chapa/verify?tx_ref=...` calls Chapa’s verification API and marks the extracted order paid on success.
- `POST /api/chapa/webhook` accepts a callback and marks the extracted order paid when the posted status is success.
- `/payment-status` calls verification and displays success/failure.
- **Partial/security status**: verify and webhook routes are public; the webhook trusts posted status and has no visible signature verification or amount/order-state validation; idempotency and full transaction reconciliation are not confirmed.
- Chapa requires `CHAPA_SECRET_KEY`, backend URL, and frontend URL configuration.

### Card/mobile-money/Stripe payment — Not implemented

The order model accepts `card` and `mobile_money` in its enum and the gateway enum includes `stripe`, but no corresponding workflow was found. The current checkout UI visibly offers Chapa, Telebirr, and cash.

### Refunds — Not implemented

`refunded` exists as an order payment status enum, but no refund endpoint or refund provider integration was found.

## Ratings and reviews

### Customer ratings — Fully implemented

- **Public**: `GET /api/rating/food/:foodId` returns visible ratings, statistics, distribution, and pagination.
- **Eligibility**: customer must own the order, order must be delivered, food must be in the order, and the same user/order/food combination cannot already be rated.
- **Create**: `POST /api/rating/add`.
- **Update**: `PUT /api/rating/:ratingId` for the owning user.
- **Delete**: `DELETE /api/rating/:ratingId` for the owning user.
- **Frontend**: food detail and order detail pages show ratings and rating modal/actions.
- **Database**: rating references user, food, and order; rating range is 1–5; comment/title lengths are constrained; unique compound index prevents duplicate rating per user/order/food.
- **Aggregation**: static model methods calculate average rating and update food’s `averageRating` and `totalReviews`.

### Rating administration — Fully implemented

- Admin list with pagination and hidden/visible filtering.
- Hide/show rating.
- Add admin response.
- Delete rating.
- Admin page includes search and local statistics.
- Endpoints are under `/api/rating/admin/*` and protected by `adminAuth`.

## Chat and support

### Customer/admin chat — Partially implemented

- **Frontend**: customer contact page displays thread and sends messages; admin chat page lists unread/read threads and replies.
- **Endpoints**:
  - `GET /api/chat/threads` admin.
  - `GET /api/chat/thread` user.
  - `POST /api/chat/customer/send` user.
  - `POST /api/chat/admin/send` admin.
  - `POST /api/chat/mark-read` admin.
- **Storage**: chat thread document contains optional user/guest identifiers, display details, embedded messages, unread counters, and timestamps.
- **Refresh**: customer and admin pages poll every five seconds.
- **Partial status**: the model supports guest IDs and the frontend creates one, but routes require `userAuth`, so unauthenticated guest messaging is not functional through the current route configuration.
- No email, SMS, or push notification integration was found.

## QR table ordering

### Table QR codes — Partially implemented

- **Frontend**: admin QR page uses `qrcode.react` to render links such as `/menu?table=N`.
- Admin can generate sequential table numbers, download decorated QR PNGs with a logo, and delete entries.
- Table list is stored in browser `localStorage` under `dm_qr_tables`.
- Menu page reads `table` from the query string and passes it to checkout.
- **Partial status**: QR configuration is not stored in the database, is not synchronized among administrators/devices, and does not have a backend table entity.

## Restaurant settings

### Admin settings — Fully implemented

- Admin can update delivery fee, service tax percentage, free-delivery threshold, Telebirr account name, and Telebirr account number.
- `GET /api/settings/public` loads public settings for the customer context.
- `GET /api/settings/admin` and `PUT /api/settings/admin` are admin-protected.
- Backend creates/updates a singleton settings document keyed by `restaurant`.
- Currency is fixed to ETB by schema and controller.

## Dashboard and analytics

### Admin dashboard — Fully implemented with local aggregation limitations

- Uses user count, order stats, admin order list, rating list, and context food/category counts.
- Displays total users, foods, orders, revenue, status breakdown, rating information, recent orders, and trend/summary cards.
- Backend order analytics supports daily and monthly grouping and date-range filtering.
- Chart dependencies are present in package metadata, but no active chart library import was found in the inspected source; dashboard visualizations are therefore implemented through UI summaries rather than confirmed Chart.js/Recharts components.

## Image upload

### Food/category images — Partially implemented

- Frontend sends up to four image fields using `FormData`.
- Backend Multer writes uploaded files to disk temporarily.
- Cloudinary uploads image files and stores secure URLs in food/category documents.
- Upload exceptions are logged and omitted from stored image arrays rather than failing the entire record.
- No image deletion/cleanup workflow was found.

## Localization and responsive UI

### Language support — Partially implemented

- English and Amharic translations and localized food/category field fallbacks are present.
- Customer and admin language preferences are stored separately in localStorage.
- Some pages use translated keys while many admin/customer labels remain hard-coded English.
- Translation coverage and consistency across the entire application are not complete.

### Responsive layout — Fully implemented at UI level

Tailwind responsive classes (`sm`, `md`, `lg`, `xl`) are used across public and admin pages. Admin sidebar switches between compact desktop and mobile overlay behavior. This is a presentation implementation; automated responsive tests were not found.

## Notifications

### Toast and in-page notifications — Fully implemented

`react-toastify` is mounted in `App.jsx`, and many API success/error paths call `toast`. Chat and contact pages also use local in-page status messages.

### Email/SMS/push notifications — Not implemented

No email, SMS, or push provider, queue, notification model, or notification API was found.

## Delivery

### Delivery fee calculation — Fully implemented

Delivery fee and free-delivery threshold come from restaurant settings and are applied in order creation and checkout display.

### Delivery assignment/tracking — Not implemented

There is no delivery-person model, assignment endpoint, driver page, GPS tracking, or delivery notification system. The order status `delivering` exists, but it is manually controlled by an admin.

---

# 6. Database Analysis

## Database architecture

- **Technology**: MongoDB, intended for MongoDB Atlas.
- **ODM**: Mongoose.
- **Connection**: `backend/config/mongodb.js` reads `MONGODB_URI`, strips accidental assignment/quote wrappers, uses connection timeouts, reuses an existing connection, and shares an in-flight connection promise during concurrent initialization.
- **Startup**: backend loads dotenv and attempts MongoDB/Cloudinary initialization before creating the Express app.
- **Serverless behavior**: request middleware reconnects to MongoDB when connection state is not connected.
- **Transactions**: no Mongoose session or transaction was found. Order save, promo usage update, and cart clear are separate operations.

## Collections/entities

### `menuuser` / user model

**Purpose**: customer identity, authentication data, and cart persistence.

Important fields:

- `_id`: MongoDB ObjectId primary key generated by Mongoose.
- `name`: string.
- `email`: string, unique schema constraint.
- `password`: string containing a bcrypt hash for local users; Google users may not have a local password.
- `googleId`: optional unique sparse string.
- `provider`: enum `local` or `google`.
- `cartData`: flexible object containing cart entries keyed by food ID.
- `isSubscribe`: boolean, default false; no subscription workflow was found.
- `role`: enum `user` or `admin`, default `user`; not used by `adminAuth`.
- `createdAt`, `updatedAt`: timestamps.

Relationships:

- Referenced by `order.userId`.
- Referenced by `rating.userId`.
- Referenced by `chat.userId`.
- Referenced by `promo.usedUsers`.

Indexes/constraints:

- Unique email.
- Unique sparse Google ID.
- No explicit user indexes beyond schema-generated unique indexes.

### `food` / food model

**Purpose**: menu item catalog.

Important fields:

- `_id`: ObjectId.
- `name`, `name_en`, `name_am`: localized names.
- `description`, `description_en`, `description_am`: localized descriptions.
- `price`: required number.
- `images`: required array of image URLs.
- `category`: required string matching the category naming approach used by controllers.
- `ingredients`, `ingredients_am`: arrays.
- `allergens`, `allergens_am`: arrays.
- `dietaryTags`, `dietaryTags_am`: arrays.
- `preparationTime`: required number.
- `averageRating`, `totalReviews`: rating summary fields.
- `isFast`, `popular`: required booleans with false defaults.
- `status`: enum `available` or `unavailable`.
- timestamps.

Relationships:

- Referenced by embedded order item `foodId`.
- Referenced by `rating.foodId`.
- Category is stored as a string rather than a Mongoose ObjectId relationship.

Indexes/constraints:

- Required fields and status enum are defined.
- No explicit custom indexes found.

### `Category` / category model

**Purpose**: menu category metadata and display organization.

Important fields:

- `_id`: ObjectId.
- `name`: required, unique, trimmed string.
- `name_en`, `name_am`: localized names.
- `type`, `type_en`, `type_am`: category type fields.
- `images`: string array.
- `bgColor`, `textColor`: display colors.
- `order`: numeric display order.
- `productCount`: cached/returned count field.
- `date`: creation date.

Relationships:

- Foods refer to a category by the string stored in `food.category`; controllers count foods by category name.
- No ObjectId foreign key is used.

Indexes/constraints:

- Unique category name.
- No explicit custom indexes found.

### `menuorder` / order model

**Purpose**: historical customer order and payment record.

Important fields:

- `userId`: required ObjectId reference to `menuuser`.
- `items`: embedded array with `foodId` reference-like ObjectId, item name, price, quantity, totalPrice, and image snapshot.
- `subtotal`, `deliveryFee`, `tax`, `discount`, `total`: numeric financial fields.
- `deliveryAddress`: required name/email/phone plus `brach` (misspelled schema field), zipCode, country. The controller writes `branch`, which does not match the schema field and may be discarded.
- `paymentMethod`: enum `cash`, `telebirr`, `card`, `mobile_money`, `chapa`.
- `paymentStatus`: enum `pending`, `paid`, `failed`, `refunded`.
- `paymentId`: string.
- `paymentGateway`: enum `none`, `chapa`, `telebirr`, `stripe`.
- `transactionId`: string.
- `transactionDetails`: amount, currency, status, reference, verifiedAt.
- `orderStatus`: pending, confirmed, preparing, ready, delivering, delivered, cancelled.
- `note`, `couponCode`, `table`, `estimatedDeliveryTime`.
- timestamps.

Relationships:

- Many orders belong to one user.
- Embedded items refer to foods by ID but also snapshot item data.
- Ratings reference an order and enforce one rating per order/food/user combination.

Indexes/constraints:

- Required user, item, item quantity, item price, item total, subtotal, and total fields.
- Payment and order status enums.
- No explicit order indexes found.

### `promocode` / promo model

**Purpose**: configurable promotion campaign and usage accounting.

Important fields:

- `code`: required unique uppercase trimmed string.
- `description`: trimmed string.
- `discountType`: enum `percentage` or `fixed`.
- `discountValue`: required non-negative number.
- `maxRedemptions`, `redemptionCount`: non-negative numeric limits/counter.
- `maxUsers`: non-negative numeric limit.
- `usedUsers`: ObjectId array referencing `menuuser`.
- `totalDiscountBudget`, `totalDiscountUsed`: non-negative numeric budget/accounting fields.
- `expiresAt`: nullable date.
- `active`: boolean.
- timestamps.

Relationships:

- `usedUsers` references users.
- Orders store the applied coupon code as a string, not a direct ObjectId promo reference.

Indexes/constraints:

- Unique code.
- Mongoose enum and minimum constraints.
- No explicit custom indexes beyond unique code.

### `menurating` / rating model

**Purpose**: customer rating/review and moderation record.

Important fields:

- `userId`: required reference to `menuuser`.
- `foodId`: required reference to `food`.
- `orderId`: required reference to `menuorder`.
- `rating`: required number from 1 through 5.
- `comment`: max length 500.
- `title`: max length 100.
- `images`: array, but the current add controller saves an empty array and no image upload flow was found.
- `helpful`: numeric counter.
- `adminResponse`: string.
- `isVerified`, `isHidden`: boolean moderation flags.
- timestamps.

Indexes:

- `{ foodId: 1, createdAt: -1 }`.
- `{ userId: 1, foodId: 1 }`.
- `{ rating: 1 }`.
- `{ orderId: 1 }`.
- Unique `{ orderId: 1, foodId: 1, userId: 1 }`.

Relationships:

- Many ratings belong to one user, food, and order.
- Rating statics aggregate visible ratings and update summary fields on food.

### `Chat` / chat model

**Purpose**: customer/admin support conversation.

Important fields:

- `userId`: optional sparse ObjectId reference to `menuuser`.
- `guestId`: optional sparse indexed string.
- `userName`, `userEmail`: required display/contact fields.
- `messages`: embedded subdocuments with `from` enum customer/admin, required text, and created date; message `_id` is disabled.
- `unreadCount`, `customerUnreadCount`: numeric counters.
- `updatedAt` and timestamps.

Indexes:

- Sparse indexes on `userId` and `guestId`.
- No explicit unique thread constraint.

Relationships:

- A thread optionally belongs to a registered user or guest identifier.
- Messages are embedded rather than stored in a separate collection.

### `RestaurantSetting` / settings model

**Purpose**: singleton-style restaurant operational configuration.

Important fields:

- `key`: unique string, default `restaurant`.
- `currency`: enum only `ETB`.
- `deliveryFee`: non-negative number.
- `taxRate`: number from 0 to 100.
- `freeDeliveryThreshold`: non-negative number.
- `telebirrAccountName`, `telebirrAccountNumber`: strings.
- timestamps.

Indexes/constraints:

- Unique `key`.
- Range constraints on numeric settings.

## Relationships summary

```text
menuuser 1 ──── many menuorder
menuuser 1 ──── many menurating
menuuser 1 ──── many Chat threads
menuuser many ◄──── usedUsers on promocode
food    1 ──── many embedded order items (historical snapshots)
food    1 ──── many menurating
menuorder 1 ──── many embedded order items
menuorder 1 ──── many menurating
Category 1 ──── many foods by matching category string, not ObjectId
RestaurantSetting is a singleton keyed by "restaurant"
```

## Data-integrity and transaction analysis

- Mongoose schema validation, unique constraints, rating compound uniqueness, and controller ownership checks provide the main integrity mechanisms.
- Cart writes call `markModified("cartData")` because cart data is a flexible object.
- Order creation recalculates prices from current food records.
- Promo redemption count, budget, used-user list, order save, and cart clear are separate writes.
- No database transaction, optimistic lock, or atomic conditional promo redemption was found.
- Chapa verification and webhook status updates are separate order saves and do not visibly compare the paid amount to the expected order total.

---

# 7. API Endpoint Inventory

All endpoints are mounted by `backend/server.js`.

## System/status endpoints

| Method | Endpoint            | Auth   | Actual behavior                                                                                                |
| ------ | ------------------- | ------ | -------------------------------------------------------------------------------------------------------------- |
| GET    | `/`                 | Public | Returns API working message and a partial endpoint list. The list omits several mounted domains.               |
| GET    | `/api/health`       | Public | Returns server message, environment name, whether MongoDB URI is configured, and Mongoose connection state.    |
| GET    | `/api/db-status`    | Public | Returns connection state, database name, host, and status. This exposes operational database metadata.         |
| GET    | `/api/chapa/status` | Public | Reports whether Chapa key/backend URL/frontend URL variables are configured and returns configured URL values. |

## User endpoints

| Method | Endpoint                | Auth   | Actual behavior                                                        |
| ------ | ----------------------- | ------ | ---------------------------------------------------------------------- |
| POST   | `/api/user/register`    | Public | Validates and creates a local user, hashes password, returns user JWT. |
| POST   | `/api/user/login`       | Public | Checks local credentials and returns user JWT.                         |
| POST   | `/api/user/google-auth` | Public | Verifies Google ID token with Google and creates/finds user.           |
| POST   | `/api/user/admin/login` | Public | Checks environment admin credentials and returns admin JWT.            |
| GET    | `/api/user/profile`     | User   | Returns current user without password.                                 |
| GET    | `/api/user/count`       | Admin  | Counts users with role user or no role.                                |
| GET    | `/api/user/all`         | Admin  | Returns customer users excluding password.                             |

## Food endpoints

| Method | Endpoint           | Auth          | Actual behavior                                          |
| ------ | ------------------ | ------------- | -------------------------------------------------------- |
| POST   | `/api/food/add`    | None in route | Multipart food creation and optional Cloudinary uploads. |
| GET    | `/api/food/list`   | Public        | Lists foods; seeds defaults if empty.                    |
| POST   | `/api/food/single` | Public        | Finds one food from body `foodId`.                       |
| POST   | `/api/food/remove` | Admin         | Deletes food by body `foodId`.                           |
| PUT    | `/api/food/edit`   | Admin         | Multipart food update with optional image replacement.   |

## Category endpoints

| Method | Endpoint               | Auth          | Actual behavior                                                       |
| ------ | ---------------------- | ------------- | --------------------------------------------------------------------- |
| POST   | `/api/category/add`    | None in route | Multipart category creation and optional image upload.                |
| GET    | `/api/category/list`   | Public        | Lists categories, seeds defaults if empty, calculates product counts. |
| PUT    | `/api/category/edit`   | Admin         | Updates category and optional images.                                 |
| POST   | `/api/category/remove` | Admin         | Deletes category only if no food uses it.                             |

The category controller contains a `singleCategory` function, but `categoryRoute.js` does not register a single-category endpoint.

## Cart endpoints

| Method | Endpoint           | Auth | Actual behavior                                         |
| ------ | ------------------ | ---- | ------------------------------------------------------- |
| POST   | `/api/cart/add`    | User | Adds/increments a food item in user cart.               |
| GET    | `/api/cart/get`    | User | Returns cart items, subtotal, total, and count.         |
| PUT    | `/api/cart/update` | User | Updates item quantity, requiring quantity at least one. |
| GET    | `/api/cart/count`  | User | Returns quantity count.                                 |
| DELETE | `/api/cart/remove` | User | Removes a food item.                                    |
| DELETE | `/api/cart/clear`  | User | Clears all cart data.                                   |

## Order endpoints

| Method | Endpoint                                    | Auth  | Actual behavior                                                                             |
| ------ | ------------------------------------------- | ----- | ------------------------------------------------------------------------------------------- |
| POST   | `/api/order/create`                         | User  | Recalculates prices/settings, applies promo, saves order, updates promo usage, clears cart. |
| GET    | `/api/order/my-orders`                      | User  | Returns current user’s latest 50 orders.                                                    |
| GET    | `/api/order/:orderId`                       | User  | Returns a current-user-owned order.                                                         |
| PUT    | `/api/order/cancel/:orderId`                | User  | Cancels own pending/confirmed order.                                                        |
| PUT    | `/api/order/telebirr/:orderId`              | User  | Submits Telebirr transaction ID for own Telebirr order.                                     |
| GET    | `/api/order/admin/all`                      | Admin | Paginated/filterable order list with populated user.                                        |
| GET    | `/api/order/admin/stats`                    | Admin | Status/revenue/order summary aggregation.                                                   |
| GET    | `/api/order/admin/analytics`                | Admin | Daily/monthly revenue and order aggregation.                                                |
| PUT    | `/api/order/admin/status/:orderId`          | Admin | Changes order lifecycle status.                                                             |
| PUT    | `/api/order/admin/payment/approve/:orderId` | Admin | Approves Telebirr transaction.                                                              |
| DELETE | `/api/order/admin/delete/:orderId`          | Admin | Deletes only delivered or cancelled orders.                                                 |

## Promo endpoints

| Method | Endpoint              | Auth  | Actual behavior                                                                  |
| ------ | --------------------- | ----- | -------------------------------------------------------------------------------- |
| GET    | `/api/promo/list`     | Admin | Lists promos newest first.                                                       |
| POST   | `/api/promo/add`      | Admin | Creates uppercase promo and configured limits.                                   |
| PUT    | `/api/promo/edit`     | Admin | Updates promo by `promoId`.                                                      |
| DELETE | `/api/promo/delete`   | Admin | Deletes promo by body `promoId`.                                                 |
| POST   | `/api/promo/validate` | User  | Validates active promo against code, user, subtotal, expiry, limits, and budget. |

## Rating endpoints

| Method | Endpoint                               | Auth   | Actual behavior                                                              |
| ------ | -------------------------------------- | ------ | ---------------------------------------------------------------------------- |
| GET    | `/api/rating/food/:foodId`             | Public | Returns visible ratings, stats, distribution, and pagination.                |
| GET    | `/api/rating/user/purchased`           | User   | Returns delivered items not yet rated according to current controller logic. |
| GET    | `/api/rating/user/ratings`             | User   | Returns own ratings, up to 50.                                               |
| GET    | `/api/rating/check`                    | User   | Checks whether user can rate a delivered order item.                         |
| POST   | `/api/rating/add`                      | User   | Adds an eligible rating.                                                     |
| PUT    | `/api/rating/:ratingId`                | User   | Updates own rating.                                                          |
| DELETE | `/api/rating/:ratingId`                | User   | Deletes own rating.                                                          |
| GET    | `/api/rating/admin/all`                | Admin  | Lists ratings with pagination and hidden/visible status filter.              |
| PUT    | `/api/rating/admin/hide/:ratingId`     | Admin  | Hides or shows a rating.                                                     |
| PUT    | `/api/rating/admin/response/:ratingId` | Admin  | Adds admin response.                                                         |
| DELETE | `/api/rating/admin/delete/:ratingId`   | Admin  | Deletes a rating and refreshes food stats.                                   |

## Chat endpoints

| Method | Endpoint                  | Auth  | Actual behavior                       |
| ------ | ------------------------- | ----- | ------------------------------------- |
| GET    | `/api/chat/threads`       | Admin | Lists threads newest first.           |
| GET    | `/api/chat/thread`        | User  | Gets current user/guest query thread. |
| POST   | `/api/chat/customer/send` | User  | Stores customer message.              |
| POST   | `/api/chat/admin/send`    | Admin | Appends admin reply.                  |
| POST   | `/api/chat/mark-read`     | Admin | Clears admin unread counter.          |

## Chapa endpoints

| Method | Endpoint                     | Auth   | Actual behavior                                                                                           |
| ------ | ---------------------------- | ------ | --------------------------------------------------------------------------------------------------------- |
| POST   | `/api/chapa/initiate`        | User   | Verifies order ownership, initializes Chapa checkout, stores transaction reference, returns checkout URL. |
| GET    | `/api/chapa/verify`          | Public | Calls Chapa verification and marks extracted order paid when successful.                                  |
| GET    | `/api/chapa/status/:orderId` | User   | Returns payment state for an owned order.                                                                 |
| POST   | `/api/chapa/webhook`         | Public | Processes success status and marks extracted order paid.                                                  |

## Settings endpoints

| Method | Endpoint               | Auth   | Actual behavior                                                           |
| ------ | ---------------------- | ------ | ------------------------------------------------------------------------- |
| GET    | `/api/settings/public` | Public | Returns ETB restaurant settings.                                          |
| GET    | `/api/settings/admin`  | Admin  | Returns same settings payload through admin route.                        |
| PUT    | `/api/settings/admin`  | Admin  | Validates and updates fees, tax, threshold, and Telebirr account details. |

---

# 8. Frontend Navigation and Pages

## Public/customer routes

| Route                        | Page                  | Purpose                                                                                                |
| ---------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------ |
| `/`                          | `Home.jsx`            | Landing/home menu experience with hero, categories, popular foods, testimonials, and ordering prompts. |
| `/about`                     | `About.jsx`           | Restaurant/about content.                                                                              |
| `/login`                     | `Login.jsx`           | Local registration/login and Google sign-in.                                                           |
| `/contact`                   | `Contact.jsx`         | Contact details and customer/admin chat UI.                                                            |
| `/menu`                      | `MenuPage.jsx`        | Menu browsing and optional table context from query string.                                            |
| `/menu/:category`            | `CategoryPage.jsx`    | Category-specific menu display.                                                                        |
| `/menu/search`               | `SearchFood.jsx`      | Search result UI.                                                                                      |
| `/menu/:category/:id`        | `FoodDetail.jsx`      | Food details, ratings, sharing, and add-to-cart.                                                       |
| `/cart`                      | `CartPage.jsx`        | Cart review, promo application, totals, and checkout navigation.                                       |
| `/checkout`                  | `Checkout.jsx`        | Customer details, table, payment selection, promo-adjusted total, and order creation.                  |
| `/orders`                    | `Order.jsx`           | Customer order list.                                                                                   |
| `/orders/:orderId`           | `OrderDetail.jsx`     | Order detail, status tracking, and rating actions.                                                     |
| `/telebirr-payment/:orderId` | `TelebirrPayment.jsx` | Manual Telebirr instructions and transaction submission.                                               |
| `/payment-status`            | `PaymentStatus.jsx`   | Chapa return/verification result.                                                                      |

## Admin routes

All nested admin routes render inside `AdminLayout.jsx` and are guarded by the `isAdmin` context flag in `App.jsx`.

- `/admin/login`: admin authentication.
- `/admin` and `/admin/dashboard`: dashboard.
- `/admin/products`: food/menu management.
- `/admin/categories`: category management.
- `/admin/totalorders`: order operations, filtering, export, status, and payment approval.
- `/admin/promotions`: promo CRUD.
- `/admin/qrcodes`: table QR code generation/download/delete.
- `/admin/settings`: restaurant fee, tax, delivery, and Telebirr settings.
- `/admin/ratings`: rating moderation.
- `/admin/chat`: customer support chat.

---

# 9. Development and Deployment

## Package manager

Both `frontend` and `backend` use `package.json` and `package-lock.json`, indicating npm as the package manager.

## Scripts

### Frontend

```text
npm run dev       vite
npm run build     vite build
npm run lint      eslint .
npm run preview   vite preview
```

### Backend

```text
npm start         node server.js
npm run server    nodemon server.js
```

There is no backend test script. `backend/scripts/test-connection.js` is a manually runnable MongoDB connection check but is not registered as an npm script.

## Testing framework

No Jest, Vitest, Mocha, Cypress, Playwright, or test/spec source files were found. Automated application tests are **Not implemented**. Verification currently consists of build/lint commands and the manual database connection script.

## Linting

- Frontend ESLint is configured with `@eslint/js`, browser globals, React Hooks recommended flat rules, and React Refresh Vite rules.
- `dist` is ignored.
- No backend lint configuration or backend lint script was found.

## Formatting

No Prettier configuration, formatter script, or formatting tool configuration was found. Existing source uses mixed formatting styles.

## Build process

- Vite transforms React JSX and Tailwind utilities into a production frontend bundle.
- Root Vercel configuration uses `@vercel/static-build` for `frontend/package.json` and serves `frontend/dist`.
- Vercel uses `@vercel/node` for `backend/server.js`.
- Root routes `/api/(.*)` to backend and other paths to the frontend SPA entry.

## Environment configuration

### Backend variable names

From `.env.example` and source usage:

- `MONGODB_URI`
- `CLOUDINARY_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET` or fallback `CLOUDINARY_SECRET_KEY`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `CHAPA_SECRET_KEY`
- `CHAPA_PUBLIC_KEY` is documented in the template but not used by the inspected backend source.
- `BACKEND_URL`
- `FRONTEND_URL`
- `NODE_ENV`
- `PORT`

### Frontend variable names

- `VITE_BACKEND_URL`: API base URL.
- `VITE_GOOGLE_CLIENT_ID`: Google Identity Services client ID.

Actual values are intentionally omitted. Environment files contain sensitive/configuration data and should not be committed or reproduced in documentation.

## Deployment

- Vercel is configured as the deployment platform.
- Root deployment builds both frontend and backend.
- Backend is exposed under `/api` routes.
- Frontend is an SPA and uses rewrite rules to return `index.html` for client-side routes.
- Chapa requires deployed backend/frontend URLs to be correctly configured for callback and return URLs.

## Operational prerequisites

A working deployment requires:

1. MongoDB URI and reachable MongoDB Atlas network access.
2. JWT secret and admin credentials.
3. Cloudinary credentials for successful image uploads.
4. Frontend API URL configuration.
5. Google client ID if Google sign-in is desired.
6. Chapa secret and URL configuration if Chapa payments are desired.

---

# 10. Security and Reliability Observations

These are documented observations from the current code, not proposed changes.

## Positive controls present

- Passwords are hashed with bcrypt.
- JWTs expire after seven days.
- User order/detail/payment/rating operations perform ownership checks in controllers.
- Admin routes generally use a separate admin token middleware.
- Uploaded image data is transferred through Multer and Cloudinary rather than stored as raw image bytes in MongoDB.
- User-facing order totals are recalculated on the backend using current food records.
- Mongoose enums, required fields, minimums, uniqueness, and rating compound uniqueness provide schema validation.

## Important limitations

- Food/category add routes are publicly writable because `adminAuth` is not attached in their route definitions.
- Public status endpoints expose database connection metadata and configured Chapa URLs.
- Chapa verification and webhook endpoints are public; webhook signature validation, amount validation, expected order validation, and idempotency are not visible.
- No CSRF mechanism, rate limiter, or structured security middleware was found.
- Admin credentials are environment-based rather than database-managed.
- Token revocation/logout invalidation is not implemented.
- Promo usage updates are not transactional or atomic.
- Order creation and promo usage are separate writes; a later failure can leave partial state.
- Quantity validation and some food/category input validation are incomplete.
- Cloudinary upload failures may silently produce records without images.
- Chat guest support is modeled but blocked by authenticated routes.
- The order schema has a `brach` typo while controller data uses `branch`.
- Some older controllers return business errors with HTTP 200.

---

# 11. Incomplete, Placeholder, and Unconfirmed Areas

## Partially implemented

- Promo preview versus final order calculation has duplicated logic and edge-case differences.
- Admin menu/category creation lacks backend authorization middleware.
- Chapa integration is present but depends on external configuration and has webhook/verification hardening gaps.
- Customer/admin chat polls and stores messages, but unauthenticated guest chat is not available.
- QR management is local-browser-only, not shared or database-backed.
- Language translation is incomplete because many labels remain hard-coded.
- Ratings support image fields in the schema but no current upload path.
- Customer profile is view-only; profile editing was not found.
- Admin dashboard has summaries and backend analytics, but no confirmed chart-library integration in source.
- Admin order management includes visible edit/new-order controls that are not functional.

## Placeholder or not implemented

- Wishlist/favorites.
- Google Maps integration.
- Dark/light theme toggle.
- Password reset.
- Email verification.
- Refresh tokens.
- Restaurant/vendor registration and management.
- Delivery-person accounts, assignment, tracking, and GPS.
- Email/SMS/push notifications.
- Card/mobile-money/Stripe payment workflows.
- Refund workflow.
- Automated test suite.
- Server-persisted QR table configuration.
- Separate admin customer management page, beyond count/list API support.

---

# 12. Verification Notes

The documentation was produced after inspecting:

- Root README and project documentation files.
- Frontend and backend package manifests.
- Vercel, Vite, ESLint, Tailwind, and environment templates.
- All visible backend routes, controllers, models, middleware, configuration, server startup, and database script files.
- Frontend application routing, context, customer pages, admin pages, major reusable components, translations, assets, and API call sites.
- Test/spec file search results and dependency/source import searches.

The current frontend production build was previously observed to complete successfully with Vite. No automated feature tests were found in the repository. This document itself does not modify source code, runtime behavior, configuration values, or deployment settings.
