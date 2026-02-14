# Backend – FoodHub API

Express + Prisma backend for the food ordering platform. Handles auth (Better Auth), user/provider/admin flows, carts, orders, meals, and role-based management.

## Tech Stack
- Node.js 20, TypeScript, Express 5
- PostgreSQL with Prisma ORM (pg adapter)
- Better Auth (email/password + Google), cookies
- Nodemailer for transactional mail
- CORS + cookie sessions, role guards

## Project Structure (src/app)
- `routes/` – mounts all feature routes under `/api`
- `modules/` – user, provider, meal, cart, order, admin, super-admin
- `middlewares/` – auth/role guards, errors, 404s
- `lib/` – Prisma client, Better Auth config, cloudinary/multer helpers
- `config/` – env loader, allowed origins

## Environment Variables (.env)
```
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EXPRESS_SESSION_SECRET=replace-me
BETTER_AUTH_SECRET=replace-me

# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME

# Cloudinary (optional if you enable uploads)
CLOUDINARY_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# SMTP / email
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="FoodHub <no-reply@foodhub.test>"

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Seeded privileged users
SUPER_ADMIN_EMAIL=super@example.com
SUPER_ADMIN_PASSWORD=SuperSecret123!
SUPER_ADMIN_NAME=Super Admin
SUPER_ADMIN_PHONE=+10000000000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin12345!
ADMIN_NAME=Platform Admin
ADMIN_PHONE=+10000000001
```

## Installation & Setup
1) Install dependencies
```bash
pnpm install   # or npm install
```
2) Generate Prisma client
```bash
npx prisma generate
```
3) Apply schema
```bash
npx prisma migrate deploy   # or migrate dev if iterating locally
```
4) Seed admin + super admin (uses env credentials)
```bash
pnpm seed:super-admin   # same as seed:admin
```
5) Run the server
```bash
pnpm dev         # tsx watch
# or
pnpm build && pnpm start
```

### API Base
- All feature routes are under `/api`
- Better Auth mounts at `/api/auth` (email/password with verification, reset, Google)

### Auth & Roles
- Roles: `customer`, `provider`, `admin`, `super_admin`
- Protected routes use `checkAuth` + `checkRole`; send auth cookies from Better Auth client SDK.

## Routes Overview
_All paths are prefixed with `/api`._

### Public
- `GET /providers` – list providers with menu metadata
- `GET /providers/:id` – provider detail + menu
- `GET /meals` – list meals (supports query filters in controller)
- `GET /meals/:id` – meal detail

### User
- `GET /user` – (admin only) list users
- `GET /user/profile/:id` – (admin) user by id
- `PUT /user/update-profile/:id` – (admin) update user
- `GET /user/profile` – (any signed-in role) current user
- `PATCH /user/profile` – update self
- `POST /user/addresses` – create address
- `GET /user/addresses` – my addresses
- `PATCH /user/addresses/:id` – update address
- `DELETE /user/addresses/:id` – delete address

### Provider (authenticated provider)
- `POST /provider/profile` – create profile
- `PATCH /provider/profile` – update profile
- `GET /provider/orders` – my orders
- `GET /provider/categories` – my categories
- `POST /provider/categories` – request/create category
- `POST /provider/meals` – add meal
- `GET /provider/meals` – list my meals
- `GET /provider/meals/:id` – meal detail
- `PUT /provider/meals/:id` – update meal
- `DELETE /provider/meals/:id` – remove meal
- `PATCH /provider/orders/:id` – update order status

### Cart (customer/provider)
- `GET /cart` – fetch cart
- `POST /cart/items` – add item
- `PATCH /cart/items/:id` – update item
- `DELETE /cart/items/:id` – remove item
- `DELETE /cart/clear` – clear cart

### Orders (customer/provider)
- `GET /orders` – my orders
- `POST /orders` – create order
- `POST /orders/:id/reviews` – add review (customer)
- `GET /orders/:id` – order detail
- `PATCH /orders/cancel/:id` – cancel

### Admin
- `GET /admin/users` – list users
- `PATCH /admin/users/:id` – update user status
- `GET /admin/orders` – list all orders
- `GET /admin/categories` – list categories
- `POST /admin/categories` – create category
- `PATCH /admin/categories/:id` – update category
- `DELETE /admin/categories/:id` – delete category
- `PATCH /admin/providers/:id/verify` – verify provider

### Super Admin
- `GET /super-admin/overview` – platform overview
- `GET /super-admin/users` – list users
- `GET /super-admin/meals` – list meals
- `PATCH /super-admin/users/:id/role` – update role
- `PATCH /super-admin/users/:id/status` – update status
- `DELETE /super-admin/users/:id` – delete user
- `DELETE /super-admin/providers/:id` – delete provider
- `DELETE /super-admin/meals/:id` – delete meal

## Development Notes
- CORS origins derive from `FRONTEND_URL` (comma-separated allowed origins, trailing slashes trimmed).
- Default greeting: `GET /` returns a simple JSON welcome.
- Better Auth uses cookies; set `BETTER_AUTH_SECRET` and ensure `FRONTEND_URL` matches the client origin for redirects.
- SMTP settings are required for email verification and password reset.
- Cloudinary config is stubbed; uncomment in `src/app/lib/cloudinary.ts` if you add uploads.

## Useful Commands
- `pnpm dev` – start in watch mode
- `pnpm build` – bundle to `api/`
- `pnpm start` – run built server
- `pnpm seed:super-admin` – seed super admin/admin
- `npx prisma studio` – inspect database (after setting env)

## Troubleshooting
- Missing env -> startup will throw from `config/env.ts`
- CORS blocked -> ensure `FRONTEND_URL` includes the exact origin (no trailing slash)
- Auth cookies in dev -> NODE_ENV=development uses `SameSite=Lax`; in prod cookies are `SameSite=None; Secure`, so use HTTPS.
