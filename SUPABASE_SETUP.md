# Supabase Setup Guide for Bubble Pop Challenge

This guide will walk you through setting up Supabase for the Bubble Pop Challenge game.

## 1. Create a Supabase Project

1. Sign up or log in at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key (you'll need these later)

## 2. Set Up the Database

### Option 1: Using the Supabase Web Interface

1. Go to the SQL Editor in your Supabase dashboard
2. Create a new query
3. Copy and paste the contents of the `supabase/migrations/20250227_leaderboard.sql` file
4. Run the query

### Option 2: Using the Supabase CLI

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Log in to Supabase:
   ```bash
   supabase login
   ```

3. Link to your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Push the migration:
   ```bash
   supabase db push
   ```

## 3. Test the Database Functions

After setting up the database, you can test the functions in the SQL Editor:

### Test submit_score function:
```sql
SELECT * FROM submit_score('Test Player', 'test@example.com', 500);
```

### Test get_top_scores function:
```sql
SELECT * FROM get_top_scores(5);
```

## 4. Configure Your Game

1. Open `js/config.js`
2. Replace the placeholder values with your Supabase URL and anon key:
   ```javascript
   const SUPABASE_URL = 'https://your-project-ref.supabase.co';
   const SUPABASE_KEY = 'your-anon-key';
   ```

## 5. Security Considerations

The setup uses database functions with the SECURITY DEFINER attribute, which means:

1. The functions run with the permissions of the function creator (typically the database owner)
2. This allows anonymous users to insert scores without needing direct INSERT permissions on the table
3. All input validation happens inside the function, preventing SQL injection and other attacks

## 6. Troubleshooting

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Supabase URL and anon key are correct
3. Make sure the database functions are created correctly
4. Check that RLS policies are properly configured

## 7. Advanced: Using Edge Functions (Alternative Approach)

For even more security, you can deploy the Edge Function:

1. Navigate to the Edge Functions section in your Supabase dashboard
2. Create a new function named `submit-score`
3. Upload the contents of `supabase/functions/submit-score/index.ts`
4. Deploy the function

Then update `database.js` to use the Edge Function instead of the database function.
