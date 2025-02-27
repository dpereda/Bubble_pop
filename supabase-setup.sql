-- Create the leaderboard table
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id BIGSERIAL PRIMARY KEY,
    player_name TEXT NOT NULL,
    player_email TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read leaderboard data
CREATE POLICY "Enable read access for all users" 
    ON public.leaderboard
    FOR SELECT 
    USING (true);

-- Create a policy to allow direct inserts (temporary for testing)
CREATE POLICY "Enable insert for anon users" 
    ON public.leaderboard
    FOR INSERT 
    TO anon
    WITH CHECK (true);

-- Create a secure database function for submitting scores
CREATE OR REPLACE FUNCTION public.submit_score(
    p_player_name TEXT,
    p_player_email TEXT,
    p_score INTEGER
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- This runs with the privileges of the function creator
AS $$
DECLARE
    result JSONB;
BEGIN
    -- Validate inputs
    IF p_player_name IS NULL OR p_player_email IS NULL OR p_score IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Missing required parameters');
    END IF;
    
    -- Validate email format (basic check)
    IF NOT p_player_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid email format');
    END IF;
    
    -- Validate score (add your own logic to prevent cheating)
    IF p_score < 0 OR p_score > 10000 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid score value');
    END IF;
    
    -- Insert the score
    INSERT INTO public.leaderboard (player_name, player_email, score, created_at)
    VALUES (p_player_name, p_player_email, p_score, NOW())
    RETURNING jsonb_build_object('id', id, 'player_name', player_name, 'score', score) INTO result;
    
    RETURN jsonb_build_object('success', true, 'data', result);
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.submit_score TO authenticated, anon;

-- Create a function to get top scores
CREATE OR REPLACE FUNCTION public.get_top_scores(
    p_limit INTEGER DEFAULT 10
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    -- Validate limit
    IF p_limit <= 0 OR p_limit > 100 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid limit parameter');
    END IF;
    
    -- Get top scores
    SELECT jsonb_agg(
        jsonb_build_object(
            'player_name', player_name,
            'score', score,
            'created_at', created_at
        )
    )
    FROM (
        SELECT player_name, score, created_at
        FROM public.leaderboard
        ORDER BY score DESC
        LIMIT p_limit
    ) t INTO result;
    
    RETURN jsonb_build_object('success', true, 'data', COALESCE(result, '[]'::jsonb));
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.get_top_scores TO authenticated, anon;

-- Create a view for the leaderboard (optional, for easier querying)
CREATE OR REPLACE VIEW public.leaderboard_view AS
SELECT 
    id,
    player_name,
    score,
    created_at
FROM public.leaderboard
ORDER BY score DESC;

-- Grant select permission on the view to authenticated and anon users
GRANT SELECT ON public.leaderboard_view TO authenticated, anon;
