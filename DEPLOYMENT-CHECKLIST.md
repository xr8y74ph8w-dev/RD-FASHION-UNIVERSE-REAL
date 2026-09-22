# RD FASHION UNIVERSE — GO LIVE CHECKLIST

1. Supabase project created.
2. Run `supabase/schema.sql` in SQL Editor.
3. Enable Email provider.
4. Enable Google provider and configure Google OAuth redirect URLs.
5. Configure production SMTP for verification/reset emails.
6. Put Supabase URL/key in `.env.local`.
7. Run `npm install` then `npm run check`.
8. Deploy `dist` to Vercel.
9. Add your custom domain and HTTPS.
10. Replace `YOUR-DOMAIN.com` in `public/robots.txt` and `public/sitemap.xml`.
11. Submit sitemap in Google Search Console.
12. For online payments, configure Razorpay secrets only on a server/Edge Function, never in frontend env.
13. Add shipping/tax rules for the countries you actually serve.
14. Test email signup, Google login, seller upload, image storage, COD order, payment, order status and mobile layout before advertising the site.
