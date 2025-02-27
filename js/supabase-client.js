// Create a single supabase client for interacting with your database
const createSupabaseClient = () => {
    try {
        console.log('Creating Supabase client...');
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
