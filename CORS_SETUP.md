# Configuring CORS for GitHub Pages

When deploying your game to GitHub Pages, you need to configure your Supabase project to allow requests from your GitHub Pages domain.

## Steps to Configure CORS

1. Go to your Supabase dashboard: https://app.supabase.com/
2. Select your project
3. Go to Project Settings (gear icon) > API
4. Scroll down to "API Settings"
5. Under "Additional Allowed Hosts", add your GitHub Pages domain:
   ```
   https://dpereda.github.io
   ```
6. Click "Save"

## Testing CORS Configuration

After configuring CORS, you should test your game on GitHub Pages to ensure that it can connect to your Supabase project.

If you encounter CORS errors in the browser console, double-check your CORS configuration in the Supabase dashboard.

## Common CORS Errors

If you see errors like these in your browser console:

```
Access to fetch at 'https://your-project.supabase.co/rest/v1/leaderboard' from origin 'https://dpereda.github.io' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

It means your CORS configuration is not properly set up. Make sure you've added your GitHub Pages domain to the allowed hosts in your Supabase project settings.
