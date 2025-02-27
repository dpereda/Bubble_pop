class BubblePopGame {
    constructor() {
        this.bubbles = [];
        this.particles = [];
        this.score = 0;
        this.timeLeft = GAME_CONFIG.gameDuration;
        this.isGameRunning = false;
        this.lastBubblePopped = 0;
        this.comboCount = 0;
        
        // Game canvas
        this.canvas = null;
        
        // UI elements
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');
        this.finalScoreElement = document.getElementById('final-score');
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.gameUI = document.getElementById('game-ui');
        
        // Bind methods
        this.mousePressed = this.mousePressed.bind(this);
        this.startGame = this.startGame.bind(this);
        this.endGame = this.endGame.bind(this);
        this.resetGame = this.resetGame.bind(this);
        this.submitScore = this.submitScore.bind(this);
        
        // Setup event listeners
        document.getElementById('start-button').addEventListener('click', this.startGame);
        document.getElementById('play-again-button').addEventListener('click', this.resetGame);
        document.getElementById('submit-score').addEventListener('click', this.submitScore);
    }

    setup() {
        // Create canvas and attach it to the game container
        this.canvas = createCanvas(800, 600);
        this.canvas.parent('game-canvas');
        
        // Hide game UI initially
        this.gameUI.style.display = 'none';
        
        // Initialize database
        db.initialize().then(success => {
            console.log('Database initialization result:', success);
        }).catch(error => {
            console.error('Error during database initialization:', error);
        });
    }

    startGame() {
        this.resetGame();
        this.isGameRunning = true;
        this.startScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
        this.gameUI.style.display = 'flex';
        
        // Start the timer
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.timerElement.textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        this.isGameRunning = false;
        clearInterval(this.timerInterval);
        
        // Update final score
        this.finalScoreElement.textContent = this.score;
        
        // Show game over screen
        this.gameOverScreen.classList.remove('hidden');
        
        // Fetch and display leaderboard
        this.updateLeaderboard();
    }

    resetGame() {
        // Clear game state
        this.bubbles = [];
        this.particles = [];
        this.score = 0;
        this.timeLeft = GAME_CONFIG.gameDuration;
        this.comboCount = 0;
        
        // Update UI
        this.scoreElement.textContent = this.score;
        this.timerElement.textContent = this.timeLeft;
        
        // Clear any existing timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    async submitScore() {
        const playerName = document.getElementById('player-name').value.trim();
        const playerEmail = document.getElementById('player-email').value.trim();
        
        if (!playerName || !playerEmail) {
            alert('Please enter your name and email');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(playerEmail)) {
            alert('Please enter a valid email address');
            return;
        }
        
        const submitButton = document.getElementById('submit-score');
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        try {
            const success = await db.submitScore(playerName, playerEmail, this.score);
            
            if (success) {
                document.getElementById('leaderboard-form').innerHTML = '<p>Score submitted successfully!</p>';
                this.updateLeaderboard();
            } else {
                throw new Error('Failed to submit score');
            }
        } catch (error) {
            console.error('Error in submitScore:', error);
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Score';
            alert('Failed to submit score. Please try again.');
        }
    }

    async updateLeaderboard() {
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = '<p>Loading leaderboard...</p>';
        
        try {
            const scores = await db.getTopScores();
            
            if (scores.length === 0) {
                leaderboardList.innerHTML = '<p>No scores yet. Be the first!</p>';
                return;
            }
            
            leaderboardList.innerHTML = '';
            scores.forEach((entry, index) => {
                const item = document.createElement('div');
                item.className = 'leaderboard-item';
                item.innerHTML = `
                    <span class="rank">#${index + 1}</span>
                    <span class="player-name">${entry.player_name}</span>
                    <span class="player-score">${entry.score}</span>
                `;
                leaderboardList.appendChild(item);
            });
        } catch (error) {
            console.error('Error in updateLeaderboard:', error);
            leaderboardList.innerHTML = '<p>Failed to load leaderboard. Please try again later.</p>';
        }
    }

    update() {
        if (!this.isGameRunning) return;
        
        // Spawn new bubbles
        this.spawnBubbles();
        
        // Update bubbles
        for (let i = this.bubbles.length - 1; i >= 0; i--) {
            this.bubbles[i].update();
            
            // Remove bubbles that are out of bounds
            if (this.bubbles[i].isOffscreen()) {
                this.bubbles.splice(i, 1);
            }
        }
        
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            
            // Remove particles that are dead
            if (this.particles[i].isDead()) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw() {
        // Set background
        background(COLORS.background);
        
        // Draw bubbles
        this.bubbles.forEach(bubble => bubble.draw());
        
        // Draw particles
        this.particles.forEach(particle => particle.draw());
    }

    spawnBubbles() {
        // Don't spawn more bubbles if we've reached the maximum
        if (this.bubbles.length >= GAME_CONFIG.maxBubbles) return;
        
        // Random chance to spawn a bubble
        if (random() < GAME_CONFIG.bubbleSpawnRate) {
            const size = random(GAME_CONFIG.bubbleMinSize, GAME_CONFIG.bubbleMaxSize);
            const x = random(width);
            const y = height + size;
            const speedX = random(-GAME_CONFIG.bubbleMaxSpeed, GAME_CONFIG.bubbleMaxSpeed);
            const speedY = random(-GAME_CONFIG.bubbleMaxSpeed, -GAME_CONFIG.bubbleMinSpeed);
            const colorIndex = floor(random(COLORS.bubbles.length));
            
            this.bubbles.push(new Bubble(x, y, size, speedX, speedY, COLORS.bubbles[colorIndex], colorIndex));
        }
    }

    mousePressed() {
        if (!this.isGameRunning) return;
        
        // Check if any bubble was clicked
        for (let i = this.bubbles.length - 1; i >= 0; i--) {
            if (this.bubbles[i].contains(mouseX, mouseY)) {
                // Calculate points based on size (smaller bubbles = more points)
                const normalizedSize = (this.bubbles[i].size - GAME_CONFIG.bubbleMinSize) / 
                                      (GAME_CONFIG.bubbleMaxSize - GAME_CONFIG.bubbleMinSize);
                const sizeBonus = GAME_CONFIG.basePoints * GAME_CONFIG.sizeBonus * (1 - normalizedSize);
                
                // Check for combo
                const now = Date.now();
                if (now - this.lastBubblePopped < GAME_CONFIG.comboTimeWindow) {
                    this.comboCount++;
                } else {
                    this.comboCount = 0;
                }
                this.lastBubblePopped = now;
                
                // Calculate combo bonus
                const comboBonus = GAME_CONFIG.basePoints * (this.comboCount * GAME_CONFIG.comboMultiplier);
                
                // Calculate total points
                const points = Math.round(GAME_CONFIG.basePoints + sizeBonus + comboBonus);
                
                // Add points to score
                this.score += points;
                this.scoreElement.textContent = this.score;
                
                // Create particles
                this.createParticles(this.bubbles[i]);
                
                // Remove the bubble
                this.bubbles.splice(i, 1);
                
                // Show floating score text
                this.showFloatingScore(mouseX, mouseY, points);
                
                // Only pop one bubble per click
                break;
            }
        }
    }

    createParticles(bubble) {
        const particleCount = floor(bubble.size / 2);
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(
                bubble.x, 
                bubble.y, 
                random(2, 6), 
                random(-3, 3), 
                random(-3, 3), 
                COLORS.particles[bubble.colorIndex]
            ));
        }
    }

    showFloatingScore(x, y, points) {
        const floatingText = new FloatingText(x, y, `+${points}`, COLORS.bubbles[floor(random(COLORS.bubbles.length))]);
        this.particles.push(floatingText);
    }
}

class Bubble {
    constructor(x, y, size, speedX, speedY, color, colorIndex) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
        this.colorIndex = colorIndex;
        this.alpha = 200;
        this.wobble = random(0, TWO_PI);
        this.wobbleSpeed = random(0.03, 0.07);
        this.wobbleAmount = random(0.5, 1.5);
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Add some wobble
        this.wobble += this.wobbleSpeed;
        this.x += sin(this.wobble) * this.wobbleAmount;
        
        // Bounce off walls
        if (this.x - this.size/2 < 0 || this.x + this.size/2 > width) {
            this.speedX *= -1;
        }
    }

    draw() {
        push();
        noStroke();
        fill(this.color[0], this.color[1], this.color[2], this.alpha);
        
        // Draw bubble
        circle(this.x, this.y, this.size);
        
        // Draw highlight
        fill(255, 255, 255, 50);
        circle(this.x - this.size/4, this.y - this.size/4, this.size/3);
        pop();
    }

    contains(px, py) {
        const d = dist(px, py, this.x, this.y);
        return d < this.size/2;
    }

    isOffscreen() {
        return this.y + this.size/2 < 0;
    }
}

class Particle {
    constructor(x, y, size, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
        this.alpha = color[3] || 200;
        this.life = 255;
        this.decay = random(5, 10);
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.1; // Gravity
        this.life -= this.decay;
    }

    draw() {
        if (this.life <= 0) return;
        
        push();
        noStroke();
        fill(this.color[0], this.color[1], this.color[2], (this.alpha * this.life) / 255);
        circle(this.x, this.y, this.size * (this.life / 255));
        pop();
    }

    isDead() {
        return this.life <= 0;
    }
}

class FloatingText extends Particle {
    constructor(x, y, text, color) {
        super(x, y, 0, 0, -2, color);
        this.text = text;
        this.decay = 4;
    }

    draw() {
        if (this.life <= 0) return;
        
        push();
        textAlign(CENTER);
        textSize(20 * (this.life / 255));
        fill(this.color[0], this.color[1], this.color[2], (this.alpha * this.life) / 255);
        text(this.text, this.x, this.y);
        pop();
    }
}
