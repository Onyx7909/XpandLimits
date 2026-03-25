Google OAuth localhost fix for Expo + Supabase

Why this happens
- Your Google sign-in flow is redirecting to localhost instead of back into the app.
- On native Expo apps, the redirect must use your app scheme, for example:
  xpandlimits://auth/callback
- Testing OAuth in Expo Go is unreliable for this. Use a development build.

Files in this zip
1. app.json
   Adds the app scheme: xpandlimits

2. googleOAuth.ts
   Example signInWithOAuth() function using Expo Linking instead of localhost

3. AuthCallbackListener.tsx
   Example listener that catches the deep link and sets the Supabase session

What to change in your project
1. Replace or merge the scheme part from app.json:
   "scheme": "xpandlimits"

2. Replace your Google login function with the one from googleOAuth.ts

3. Mount AuthCallbackListener once near the root of your app, for example in App.js:

   import AuthCallbackListener from './AuthCallbackListener';

   export default function App() {
     return (
       <>
         <AuthCallbackListener />
         {/* rest of your app */}
       </>
     );
   }

4. In Supabase Dashboard:
   Authentication -> URL Configuration
   Add this Redirect URL:
   xpandlimits://**

5. In Supabase Dashboard:
   Authentication -> Providers -> Google
   Make sure Google provider is enabled.

6. In Google Cloud Console:
   Authorized redirect URI should be the Supabase callback URL for your project,
   not localhost and not your app scheme.
   It usually looks like:
   https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback

7. Rebuild the app as a development build:
   npx expo run:ios
   or
   npx expo run:android

Important
- Do not test this inside Expo Go if Google login keeps falling into localhost.
- Do not hardcode http://localhost anywhere in the Google auth flow.

If you want a fully merged project zip, upload your current project zip and I can patch the exact files.
