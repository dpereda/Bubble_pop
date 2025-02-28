// Supabase configuration
// Replace with your own Supabase URL and anon key
const SUPABASE_URL = 'https://zealxibrgczdioidplmm.supabase.co';

// TODO: Replace this with your actual anon key from the Supabase dashboard
// Go to: Project Settings > API > Project API keys > anon public
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplYWx4aWJyZ2N6ZGlvaWRwbG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2ODQzMzgsImV4cCI6MjA1NjI2MDMzOH0.vIfBz23AuKqk6CaNRP1YePdCtoE-lpZCPnIn3Gj8xJw';

// Game configuration
const GAME_CONFIG = {
    // Game duration in seconds
    gameDuration: 30,
    
    // Bubble properties
    bubbleMinSize: 20,
    bubbleMaxSize: 80,
    bubbleMinSpeed: 1,
    bubbleMaxSpeed: 5,
    bubbleSpawnRate: 0.05, // Chance per frame to spawn a new bubble
    maxBubbles: 20, // Maximum number of bubbles on screen
    
    // Scoring
    basePoints: 10, // Base points for popping a bubble
    sizeBonus: 0.5, // Smaller bubbles give more points (basePoints * (1 + sizeBonus * (1 - normalizedSize)))
    comboTimeWindow: 1000, // Time window in ms for combo
    comboMultiplier: 0.2, // Each bubble in combo increases points by this percentage
};

// Colors
const COLORS = {
    background: [18, 18, 18],
    bubbles: [
        [255, 87, 34],  // Orange
        [33, 150, 243], // Blue
        [76, 175, 80],  // Green
        [156, 39, 176], // Purple
        [255, 235, 59], // Yellow
    ],
    particles: [
        [255, 87, 34, 150],
        [33, 150, 243, 150],
        [76, 175, 80, 150],
        [156, 39, 176, 150],
        [255, 235, 59, 150],
    ]
};
