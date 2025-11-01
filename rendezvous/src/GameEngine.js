import PhysicsEngine from './PhysicsEngine.js';
import GraphicsEngine from './GraphicsEngine.js';
import InputHandler from './InputHandler.js';
import GameStateManager from './GameStateManager.js';
import UIManager from './UIManager.js';

export default class GameEngine {
    constructor() {
        this.physicsEngine = new PhysicsEngine();
        this.graphicsEngine = new GraphicsEngine();
        this.inputHandler = new InputHandler();
        this.gameStateManager = new GameStateManager();
        this.uiManager = new UIManager();
        this.lastTime = 0;
        this.animationFrameId = null;
    }

    start() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.lastTime = performance.now();
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }

    resetGame(initialDistance) {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.gameStateManager = new GameStateManager(initialDistance);
        this.start();
    }

    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        if (this.gameStateManager.gameState === 'playing') {
            const input = this.inputHandler.getInput();
            this.physicsEngine.update(deltaTime, this.gameStateManager.getGameObjects(), input, this.gameStateManager.getDockingMode());
            this.gameStateManager.updateState(this.gameStateManager.getGameObjects());
        }

        this.graphicsEngine.render(this.gameStateManager.getGameObjects(), this.gameStateManager.getDockingMode());
        this.uiManager.update(this.gameStateManager.getUIState());

        if (this.gameStateManager.gameState === 'playing') {
            this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
        } else {
            // Game over, stop the loop
            cancelAnimationFrame(this.animationFrameId);
            // Render one last time to show the final state
            this.graphicsEngine.render(this.gameStateManager.getGameObjects(), this.gameStateManager.getDockingMode());
            this.uiManager.update(this.gameStateManager.getUIState());
        }
    }
}