const G = 6.67430e-11; // Gravitational constant
const M_EARTH = 5.972e24; // Mass of Earth in kg
const R_EARTH = 6.371e6; // Radius of Earth in meters

export default class GameStateManager {
    constructor(initialDistance = 10000) { // Default to 10km if not provided
        const stationOrbitRadius = R_EARTH + 408000; // 408 km altitude for ISS
        const stationOrbitalSpeed = Math.sqrt(G * M_EARTH / stationOrbitRadius);

        this.gameObjects = [
            {
                id: 'station',
                mass: 420000, // kg
                position: { x: stationOrbitRadius, y: 0 },
                velocity: { x: 0, y: stationOrbitalSpeed },
            },
            {
                id: 'craft',
                mass: 8000, // kg
                position: { x: stationOrbitRadius + initialDistance, y: 0 }, // Use initialDistance
                velocity: { x: 0, y: stationOrbitalSpeed - 10 }, // Slightly different speed
                thrust: { angle: 0, magnitude: 0 },
            },
        ];
        this.gameState = 'playing';
    }

    getGameObjects() {
        return this.gameObjects;
    }

    getUIState() {
        const craft = this.gameObjects.find(obj => obj.id === 'craft');
        const station = this.gameObjects.find(obj => obj.id === 'station');

        const calcParams = (obj) => {
            const altitude = Math.sqrt(obj.position.x ** 2 + obj.position.y ** 2) - R_EARTH;
            const speed = Math.sqrt(obj.velocity.x ** 2 + obj.velocity.y ** 2);
            return { ...obj, altitude, speed };
        };

        const craftParams = calcParams(craft);
        const stationParams = calcParams(station);

        const dx = station.position.x - craft.position.x;
        const dy = station.position.y - craft.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const dvx = station.velocity.x - craft.velocity.x;
        const dvy = station.velocity.y - craft.velocity.y;
        const relativeVelocity = Math.sqrt(dvx * dvx + dvy * dvy);

        return {
            craft: craftParams,
            station: stationParams,
            relative: {
                distance,
                velocity: relativeVelocity,
            },
            fuel: 100, // Placeholder
        };
    }

    updateState(gameObjects) {
        // Check for win/loss conditions here
    }
}