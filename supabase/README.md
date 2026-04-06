# Supabase Setup

This project expects two public tables:

- `profiles`
- `pins`

Run `supabase/schema.sql` in the Supabase SQL editor for a baseline setup that matches the current frontend.

What this setup covers:

- `profiles` bootstrap used by the auth adapter
- public read access for `pins` so guests can browse the map
- authenticated insert access for `pins`
- Realtime enabled for `pins`
- indexes for recent pins and basic map queries

Environment variables required by the app:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Notes:

- The app currently reads `pins` with `select('*')`, so the base table schema must include the fields used by the frontend.
- The UI will show a fallback author label if no joined display name is present.
- If you want richer author data in the map feed, add a view or RPC later that joins `pins` to `profiles`.
