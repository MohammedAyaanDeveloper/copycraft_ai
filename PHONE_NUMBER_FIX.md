# Fix: Disable Phone Number During Sign-Up

## Problem
When users sign up with Google, Clerk is asking for a phone number. Indian phone numbers are not supported by default in Clerk's phone verification.

## Solution

### Option 1: Completely Disable Phone Number Field (Recommended for India)

**In Clerk Dashboard:**

1. Go to https://dashboard.clerk.com
2. Select your application
3. Navigate to **Authentication** → **Authenticators** or **Phone Number**
4. **Toggle OFF** the phone number authentication
5. Save changes

This removes phone number requirement from:
- Sign-up forms
- Sign-in forms
- User profile updates

### Option 2: Make Phone Number Optional (Already Applied)

The code has been updated with `skipPhoneValidation: true` which makes phone number optional during sign-up.

### Step-by-Step Instructions to Disable Phone in Clerk Dashboard

1. **Log in to Clerk Dashboard**
   - Visit: https://dashboard.clerk.com
   - Select your application

2. **Go to Authentication Settings**
   - Left sidebar → **Authentication**
   - Look for **Authenticators** section

3. **Find Phone Number Option**
   - You should see:
     - Email
     - Phone Number
     - OAuth Providers (Google, GitHub, etc.)

4. **Disable Phone Number**
   - Find the toggle for "Phone Number"
   - Click to turn it **OFF**
   - Click **Save** or **Update**

5. **Test the Fix**
   - Clear browser cache
   - Go to your app
   - Try signing up with Google again
   - Phone number field should no longer appear

### Alternative: Use Phone Number with Country Support

If you want to keep phone number but support India:

1. In Clerk Dashboard → **Authentication** → **Phone Number**
2. Look for country/region settings
3. Add India (+91) to supported countries
4. Save

However, **disabling phone entirely is recommended** for your use case.

## Testing After Changes

1. Clear your browser cache (Ctrl+Shift+Delete)
2. Restart your development server:
   ```bash
   npm run dev
   ```
3. Try signing up with:
   - Email/Password
   - Google OAuth
   - Should NO longer ask for phone number

## Deployment

After making changes in Clerk Dashboard:

1. Changes apply immediately (no deployment needed)
2. For local changes in code, commit and push:
   ```bash
   git add .
   git commit -m "Disable phone number validation"
   git push origin main
   ```
3. Vercel will auto-deploy

## Troubleshooting

**Phone number field still appears?**
- Hard refresh: Ctrl+F5
- Clear Clerk cache: Open DevTools → Application → Clear Storage
- Check if Clerk Dashboard changes were saved

**Users can still see phone field?**
- Ensure the Clerk Dashboard toggle is OFF
- Wait 5 minutes for changes to propagate
- Clear browser cookies

## Code Change Applied

The `index.tsx` file now includes:
```typescript
signUpProps={{
  skipPhoneValidation: true,
}}
```

This makes phone number optional rather than required.

---

**Recommended Action**: Disable phone number entirely in Clerk Dashboard for Indian users.
