# Admin Credentials

The seed script now creates two privileged accounts:

1. `super_admin` (required env vars)
- `SUPER_ADMIN_EMAIL`
- `SUPER_ADMIN_PASSWORD`

2. `admin` (env vars optional, defaults available)
- `ADMIN_EMAIL` (default: `foodhub.admin@example.com`)
- `ADMIN_PASSWORD` (default: `Admin12345!`)

## Seed Command

```bash
npm run seed:admin
```

`seed:admin` and `seed:super-admin` both run `src/scripts/seedAdmin.ts`.

## Recommended

Set custom `ADMIN_EMAIL` and `ADMIN_PASSWORD` in production before seeding.
