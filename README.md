# Chattogram Driver Bazar

Mobile-first Bengali/English-ready web app starter for:
- Permanent driver jobs
- Temporary driver booking requests
- Substitute duty requests
- Driver directory and account dashboard

## Important status
This is the first working project foundation, not the finished production service. Supabase credentials and database setup are required before real accounts and shared listings work. Document upload, admin review, chat, payments, maps, notifications, and full CV fields are planned for subsequent development.

## Run locally
1. Install Node.js 20 or later.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and fill in your Supabase project URL and anon key.
4. Run `npm run dev`.

## Supabase setup
1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. In Authentication settings, configure email confirmation and your site URL.
5. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your deployment environment.

Never put a Supabase service-role key in frontend code. Do not collect NID images or license documents until private storage buckets and strict access policies have been configured.

## Deploy
Build with `npm run build`; deploy the `dist` folder to a static host such as Cloudflare Pages. Configure the two `VITE_SUPABASE_*` environment variables in the hosting dashboard. Add SPA fallback/rewrite to `/index.html`.

## Product rules
- No vehicle rental advertisement marketplace.
- No vehicle sale advertisement marketplace.
- Bengali-first interface; BDT and Chattogram, Bangladesh.
- Verification badges must reflect actual review status. Do not imply government verification unless an authorized verification provider is integrated.
