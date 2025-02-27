# Supabase CORS Setup Guide

To ensure your game can connect to Supabase from GitHub Pages, you need to configure CORS (Cross-Origin Resource Sharing) settings in your Supabase project.

## Steps to Configure CORS in Supabase

1. **Log in to your Supabase Dashboard**
   - Go to [https://app.supabase.io/](https://app.supabase.io/)
   - Sign in with your account
   - Select your project

2. **Navigate to API Settings**
   - In the left sidebar, click on "Project Settings"
   - Click on "API" in the submenu
   - Scroll down to find the "CORS" section

3. **Add GitHub Pages Domain**
   - In the "Additional Allowed Origins" field, add your GitHub Pages URL:
     - Format: `https://yourusername.github.io`
     - For this project: `https://dpereda.github.io`
   - Make sure to include only the domain without any path
   - Click "Save" to apply the changes

4. **Test the Connection**
   - After saving, wait a few minutes for the changes to propagate
   - Open your game on GitHub Pages and check the browser console
   - You should no longer see CORS-related errors

## Troubleshooting CORS Issues

If you're still experiencing CORS issues:

1. **Check the URL Format**
   - Make sure the URL is exactly as shown in your browser when visiting your GitHub Pages site
   - Don't include trailing slashes or specific paths

2. **Verify Supabase Configuration**
   - Double-check that your Supabase URL and API key in `config.js` are correct
   - Ensure there are no typos or extra spaces

3. **Browser Cache**
   - Try clearing your browser cache or using an incognito/private window
   - Sometimes browsers cache CORS errors

4. **Check Network Tab**
   - In your browser's developer tools, go to the Network tab
   - Look for requests to Supabase and check if they have CORS errors
   - The error details can provide more specific information about what's wrong

5. **Contact Supabase Support**
   - If all else fails, Supabase has excellent documentation and support
   - Visit [https://supabase.com/docs](https://supabase.com/docs) for more information

## Additional Resources

- [Supabase CORS Documentation](https://supabase.com/docs/guides/api/cors)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [MDN Web Docs: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
