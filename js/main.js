// Create a global game instance
let game;

// p5.js setup function
function setup() {
    try {
        // Create game instance
        game = new BubblePopGame();
        if (game) {
            game.setup();
        }
    } catch (error) {
        console.error('Error setting up game:', error);
    }
}

// p5.js draw function
function draw() {
    if (game) {
        try {
            game.update();
            game.draw();
        } catch (error) {
            console.error('Error in draw:', error);
        }
    }
}

// p5.js mousePressed function
function mousePressed() {
    if (game) {
        try {
            game.mousePressed();
        } catch (error) {
            console.error('Error in mousePressed:', error);
        }
    }
}

// Add window resize handler
function windowResized() {
    // Only resize if the canvas exists
    if (game && game.canvas) {
        try {
            // Keep the canvas size fixed at 800x600
            // This is important for game mechanics
            resizeCanvas(800, 600);
        } catch (error) {
            console.error('Error in windowResized:', error);
        }
    }
}
