# Quick Setup Instructions

Follow these steps to set up your Supabase database:

1. **Log in to your Supabase dashboard** at https://app.supabase.com/

2. **Go to the SQL Editor** in your project

3. **Create a new query** and paste the contents of the `supabase-setup.sql` file

4. **Run the query** to create:
   - The leaderboard table
   - Row-Level Security policies
   - Database functions for secure score submission
   - A view for easier querying

5. **Test the setup** by playing the game and submitting a score

## Troubleshooting

If you encounter a 401 Unauthorized error:

1. Go to your Supabase dashboard → Authentication → Policies
2. Make sure Row-Level Security is enabled for the leaderboard table
3. Verify that the "Enable insert for anon users" policy is created
4. Check that the database functions have been granted execute permissions

## Direct Table Access

The game will first try to use the secure database functions. If those fail, it will fall back to direct table access, which requires the RLS policy for inserts to be properly configured.
