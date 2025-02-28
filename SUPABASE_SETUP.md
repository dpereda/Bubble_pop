# Supabase Setup Instructions

This document provides instructions for setting up your Supabase project to work with the Bubble Pop Challenge game.

## Database Setup

1. **Create a Leaderboard Table**:
   - Go to your Supabase dashboard: https://app.supabase.com/
   - Navigate to the SQL Editor
   - Run the following SQL to create the leaderboard table:

```sql
CREATE TABLE public.leaderboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_name TEXT NOT NULL,
    player_email TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    ip_address TEXT
);

-- Create a table to track submission attempts for rate limiting
CREATE TABLE public.submission_attempts (
    ip_address TEXT NOT NULL,
    attempt_time TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
```

2. **Enable Row Level Security (RLS)**:
   - Go to Authentication > Policies
   - Find the "leaderboard" table
   - Enable RLS if it's not already enabled

3. **Create RLS Policies**:
   - Create a policy to allow everyone to read the leaderboard:

```sql
CREATE POLICY "Allow everyone to read leaderboard" 
ON public.leaderboard 
FOR SELECT 
TO anon 
USING (true);
```

## Create a Secure Stored Procedure for Score Submission

Create a stored procedure to handle score submission with validation and rate limiting:

```sql
CREATE OR REPLACE FUNCTION public.submit_score(
    p_player_email TEXT,
    p_player_name TEXT,
    p_score INTEGER
) RETURNS JSONB AS $$
DECLARE
    result JSONB;
    client_ip TEXT;
    recent_attempts INTEGER;
    max_score INTEGER := 10000; -- Set a reasonable maximum score
    min_score INTEGER := 0;     -- Set a minimum score
BEGIN
    -- Get client IP (this will be available in Supabase Edge Functions)
    client_ip := current_setting('request.headers', true)::json->'x-forwarded-for';
    
    -- Basic validation
    IF p_player_name IS NULL OR length(p_player_name) < 2 THEN
        RETURN json_build_object('success', false, 'error', 'Invalid player name');
    END IF;
    
    IF p_player_email IS NULL OR p_player_email NOT LIKE '%@%.%' THEN
        RETURN json_build_object('success', false, 'error', 'Invalid email address');
    END IF;
    
    IF p_score IS NULL OR p_score < min_score OR p_score > max_score THEN
        RETURN json_build_object('success', false, 'error', 'Invalid score value');
    END IF;
    
    -- Rate limiting - check for too many submissions from same IP
    SELECT COUNT(*) INTO recent_attempts 
    FROM public.submission_attempts 
    WHERE ip_address = client_ip 
    AND attempt_time > (now() - interval '1 hour');
    
    IF recent_attempts > 10 THEN
        RETURN json_build_object('success', false, 'error', 'Too many submissions. Please try again later.');
    END IF;
    
    -- Record this attempt
    INSERT INTO public.submission_attempts (ip_address) VALUES (client_ip);
    
    -- Insert the score
    INSERT INTO public.leaderboard (player_name, player_email, score, ip_address)
    VALUES (p_player_name, p_player_email, p_score, client_ip);
    
    -- Return success
    result := json_build_object('success', true);
    RETURN result;
EXCEPTION WHEN OTHERS THEN
    -- Return error
    result := json_build_object('success', false, 'error', SQLERRM);
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## CORS Configuration

1. Go to Project Settings > API > CORS
2. Add your domain to the "Allowed Origins" list
3. For local development, add `http://localhost:8000` and `http://127.0.0.1:8000`
4. For production, add your GitHub Pages URL (e.g., `https://yourusername.github.io`)

## API Keys

1. Go to Project Settings > API > Project API keys
2. Copy the "anon public" key
3. Update the `SUPABASE_KEY` in `js/config.js` with this key

## Testing

After completing these steps, you should be able to:
1. Play the game
2. Submit scores when the game ends
3. View the leaderboard with scores from the database

## Security Considerations

This setup provides several security measures:
1. No direct anonymous inserts to the leaderboard table
2. All inserts go through a secure function with validation
3. Rate limiting to prevent abuse
4. Score validation to prevent unrealistic scores
5. IP tracking for audit purposes