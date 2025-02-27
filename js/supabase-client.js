// Create a single supabase client for interacting with your database
const createSupabaseClient = () => {
    try {
        console.log('Creating Supabase client...');
        console.log('SUPABASE_URL:', SUPABASE_URL);
        console.log('SUPABASE_KEY (first 10 chars):', SUPABASE_KEY.substring(0, 10) + '...');
        
        // Check if Supabase is configured
        if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_KEY === 'YOUR_SUPABASE_ANON_KEY') {
            console.warn('Supabase not configured. Please update config.js with your Supabase credentials.');
            return null;
        }
        
        // Validate URL format
        try {
            new URL(SUPABASE_URL); // This will throw if URL is invalid
        } catch (urlError) {
            console.error('Invalid Supabase URL format:', urlError);
            return null;
        }
        
        console.log('URL:', SUPABASE_URL);
        console.log('Key length:', SUPABASE_KEY.length);
        
        // Create client
        const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        
        // Test the client
        if (!client) {
            throw new Error('Failed to create client');
        }
        
        console.log('Supabase client created successfully');
        return client;
    } catch (error) {
        console.error('Error creating Supabase client:', error);
        return null;
    }
};
