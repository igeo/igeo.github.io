import GameEngine from './src/GameEngine.js';

const gameEngine = new GameEngine();
gameEngine.start();

const startDistanceInput = document.getElementById('startDistance');
const setDistanceButton = document.getElementById('setDistance');

setDistanceButton.addEventListener('click', () => {
    const distanceKm = parseFloat(startDistanceInput.value);
    if (!isNaN(distanceKm) && distanceKm > 0) {
        gameEngine.resetGame(distanceKm * 1000); // Convert km to meters
    } else {
        alert('Please enter a valid positive number for start distance.');
    }
});