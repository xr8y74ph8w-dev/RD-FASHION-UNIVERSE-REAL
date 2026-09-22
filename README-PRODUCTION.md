# RD FASHION UNIVERSE — REAL PRODUCTION SETUP

This version moves authentication, collections, products, wishlists and orders from browser-only localStorage to Supabase. It supports real email authentication, Google OAuth, database persistence and public image storage.

## 1. Create Supabase project
Create a project at https://supabase.com, then open SQL Editor and run `supabase/schema.sql`.

## 2. Auth settings
In Supabase → Authentication → Providers:
- Enable Email.
- Enable Google and enter your Google OAuth client ID/secret.
- Set Site URL to your production domain.
- Add redirect URL for local development: `http://localhost:5173`.

For email verification, configure SMTP in Supabase Auth for production so verification/reset emails come from your domain.

## 3. Frontend env
Copy `.env.example` to `.env.local` and fill:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SITE_URL`

## 4. Run
npm install
npm run dev

## 5. Production
Build with `npm run build` and deploy `dist` to Vercel/Netlify/Cloudflare Pages. Attach a real domain and configure the same Supabase redirect URLs.

## 6. Payments
The current checkout records COD orders. For live online payments, deploy the included Razorpay Edge Functions after adding Razorpay secrets. Never put the Razorpay secret key in Vite/client code.
