# Bubble Pop Challenge

A fun, addictive web-based game built with p5.js and Supabase for the leaderboard functionality.

## Game Description

Bubble Pop Challenge is a fast-paced game where players need to pop as many colorful bubbles as possible before time runs out. The game features:

- Colorful, animated bubbles with physics
- 30-second time limit for fast-paced gameplay
- Combo system for consecutive pops
- Size-based scoring (smaller bubbles = more points)
- Global leaderboard
- Particle effects

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bubble-pop-challenge.git
cd bubble-pop-challenge
```

### 2. Set Up Supabase

For detailed instructions on setting up Supabase, see [SUPABASE_SETUP.md](SUPABASE_SETUP.md).

Quick setup:
```bash
# Run the setup script (recommended)
./setup-supabase.sh

# Or manually configure Supabase
# 1. Create a Supabase account and project
# 2. Run the SQL in supabase/migrations/20250227_leaderboard.sql
# 3. Update js/config.js with your Supabase URL and anon key
```

### 3. Run the Game

```bash
# Start a local server
python -m http.server 3000
```

Open your browser and navigate to http://localhost:3000

## Game Controls

- Use your mouse to click and pop bubbles
- Try to pop bubbles in quick succession to build combos
- Smaller bubbles are worth more points

## Customization

You can customize various aspects of the game by modifying the `GAME_CONFIG` and `COLORS` objects in `js/config.js`:

- Game duration
- Bubble sizes and speeds
- Scoring system
- Color schemes

## Supabase Integration

This project includes sample files for secure Supabase integration:

1. `/supabase/functions/submit-score/index.ts` - A sample Edge Function for securely submitting scores
2. `/supabase/migrations/20250227_leaderboard.sql` - SQL setup for the leaderboard table with proper security

To deploy these to your Supabase project:

### Edge Function
```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy submit-score
```

### Database Migration
```bash
# Apply the migration
supabase db push
```

## Deployment

This game is deployed on GitHub Pages and can be accessed at:

[https://dpereda.github.io/Bubble_pop/](https://dpereda.github.io/Bubble_pop/)

### Deploying Your Own Version

1. Fork this repository
2. Enable GitHub Pages in your repository settings
3. Your game will be available at `https://[your-username].github.io/Bubble_pop/`

Remember to update the Supabase configuration in `js/config.js` with your own Supabase project details.

## License

This project is open source and available under the MIT License.

## Credits

Created with p5.js and Supabase.
