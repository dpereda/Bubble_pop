# Bubble Pop Challenge

A fun, web-based game where players pop colorful bubbles to score points within a time limit.

## Features

- Colorful, animated bubbles
- Score tracking
- Timer-based gameplay
- Global leaderboard
- Particle effects

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/dpereda/Bubble_pop.git
cd Bubble_pop
```

### 2. Configure Supabase

1. Create a Supabase account and project
2. Update `js/config.js` with your Supabase URL and anon key

### 3. Run the Game

```bash
# Start a local server
python -m http.server 3000
```

Open your browser and navigate to http://localhost:3000

## Game Controls

- **Mouse Click**: Pop bubbles
- **Space Bar**: Pause/Resume game

## Customization

You can customize various aspects of the game by modifying the `GAME_CONFIG` and `COLORS` objects in `js/config.js`:

- Game duration
- Bubble sizes and speeds
- Scoring system
- Color schemes

## Deployment

This game is deployed on GitHub Pages and can be accessed at:

[https://dpereda.github.io/Bubble_pop/](https://dpereda.github.io/Bubble_pop/)

## License

This project is open source and available under the MIT License.
