// Supabase configuration
// Replace with your own Supabase URL and anon key
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';

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
