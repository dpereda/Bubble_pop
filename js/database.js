class Database {
    constructor() {
        this.supabase = null;
        this.initialized = false;
        this.supabaseConfigured = true;
        console.log('Database class instantiated');
    }

    async initialize() {
        console.log('Initializing Supabase client...');
        console.log('SUPABASE_URL in database.js:', SUPABASE_URL);
        console.log('SUPABASE_KEY in database.js (first 10 chars):', SUPABASE_KEY.substring(0, 10) + '...');
        
        try {
            // Check if Supabase is configured with real credentials
            if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_KEY === 'YOUR_SUPABASE_ANON_KEY') {
                console.log('Supabase not configured. Leaderboard functionality will be disabled.');
                this.supabaseConfigured = false;
                this.initialized = true;
                return true; // Return true to indicate initialization completed successfully
            }
            
            // Create the client using our helper function
            this.supabase = createSupabaseClient();
            
            if (!this.supabase) {
                console.log('Failed to create Supabase client. Leaderboard functionality will be disabled.');
                this.supabaseConfigured = false;
                this.initialized = true;
                return true; // Return true to indicate initialization completed successfully
            }
            
            this.initialized = true;
            console.log('Supabase client initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing Supabase client:', error);
            this.supabaseConfigured = false;
            this.initialized = true;
            return true; // Return true to indicate initialization completed successfully
        }
    }

    async submitScore(playerName, playerEmail, score) {
        console.log('Submitting score:', { playerName, playerEmail, score });
        
        try {
            if (!this.initialized) {
                console.log('Database not initialized, attempting to initialize...');
                const initResult = await this.initialize();
                if (!initResult) {
                    console.error('Failed to initialize Supabase client');
                    return false;
                }
            }

            if (!this.supabaseConfigured) {
                console.log('Supabase not configured, skipping score submission.');
                return false;
            }

            // First try using the RPC function
            try {
                console.log('Attempting to use RPC function for score submission...');
                const { data, error } = await this.supabase.rpc('submit_score', {
                    p_player_name: playerName,
                    p_player_email: playerEmail,
                    p_score: score
                });

                if (error) {
                    console.warn('RPC function failed, will try direct insert:', error);
                    throw error; // This will be caught by the try/catch below
                }

                if (!data.success) {
                    console.warn('RPC function returned error:', data.error);
                    throw new Error(data.error || 'Failed to submit score');
                }

                console.log('Score submitted successfully via RPC:', data);
                return true;
            } catch (rpcError) {
                // If RPC fails, try direct insert as fallback
                console.log('Falling back to direct table insert...');
                const { data, error } = await this.supabase
                    .from('leaderboard')
                    .insert([
                        { 
                            player_name: playerName, 
                            player_email: playerEmail, 
                            score: score,
                            created_at: new Date().toISOString()
                        }
                    ]);

                if (error) {
                    console.error('Direct insert error:', error);
                    throw error;
                }

                console.log('Score submitted successfully via direct insert');
                return true;
            }
        } catch (error) {
            console.error('Error submitting score:', error);
            return false;
        }
    }

    async getTopScores(limit = 10) {
        console.log('Getting top scores, limit:', limit);
        
        try {
            if (!this.initialized) {
                console.log('Database not initialized, attempting to initialize...');
                const initResult = await this.initialize();
                if (!initResult) {
                    console.error('Failed to initialize Supabase client');
                    return [];
                }
            }

            if (!this.supabaseConfigured) {
                console.log('Supabase not configured, returning mock leaderboard data.');
                return [
                    { player_name: 'Example Player 1', score: 1250 },
                    { player_name: 'Example Player 2', score: 980 },
                    { player_name: 'Example Player 3', score: 840 },
                    { player_name: 'Example Player 4', score: 720 },
                    { player_name: 'Example Player 5', score: 650 }
                ];
            }

            // First try using the RPC function
            try {
                console.log('Attempting to use RPC function for getting top scores...');
                const { data, error } = await this.supabase.rpc('get_top_scores', {
                    p_limit: limit
                });

                if (error) {
                    console.warn('RPC function failed, will try direct query:', error);
                    throw error; // This will be caught by the try/catch below
                }

                if (!data.success) {
                    console.warn('RPC function returned error:', data.error);
                    throw new Error(data.error || 'Failed to get top scores');
                }

                console.log('Leaderboard data fetched successfully via RPC:', data.data.length, 'records');
                return data.data || [];
            } catch (rpcError) {
                // If RPC fails, try direct query as fallback
                console.log('Falling back to direct table query...');
                const { data, error } = await this.supabase
                    .from('leaderboard')
                    .select('player_name, score, created_at')
                    .order('score', { ascending: false })
                    .limit(limit);

                if (error) {
                    console.error('Direct query error:', error);
                    throw error;
                }

                console.log('Leaderboard data fetched successfully via direct query:', data.length, 'records');
                return data;
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }
    }
}

// Create a global database instance
const db = new Database();
