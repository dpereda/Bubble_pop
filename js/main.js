// Create a global game instance
let game;

// p5.js setup function
function setup() {
    // Create game instance
    game = new BubblePopGame();
    game.setup();
}

// p5.js draw function
function draw() {
    game.update();
    game.draw();
}

// p5.js mousePressed function
function mousePressed() {
    game.mousePressed();
}

// Add window resize handler
function windowResized() {
    // Only resize if the canvas exists
    if (game && game.canvas) {
        // Keep the canvas size fixed at 800x600
        // This is important for game mechanics
        resizeCanvas(800, 600);
    }
}
