const R_EARTH = 6.371e6; // Radius of Earth in meters

export default class GraphicsEngine {
    constructor() {
        this.missionControlCanvas = document.createElement('canvas');
        this.missionControlCanvas.width = 400;
        this.missionControlCanvas.height = 200;
        document.getElementById('mission-control-view').appendChild(this.missionControlCanvas);
        this.missionControlCtx = this.missionControlCanvas.getContext('2d');

        this.zoomedMissionControlCanvas = document.createElement('canvas');
        this.zoomedMissionControlCanvas.width = 400;
        this.zoomedMissionControlCanvas.height = 200;
        document.getElementById('zoomed-mission-control-view').appendChild(this.zoomedMissionControlCanvas);
        this.zoomedMissionControlCtx = this.zoomedMissionControlCanvas.getContext('2d');

        this.pilotCanvas = document.createElement('canvas');
        this.pilotCanvas.width = 400;
        this.pilotCanvas.height = 200;
        document.getElementById('pilot-view').appendChild(this.pilotCanvas);
        this.pilotCtx = this.pilotCanvas.getContext('2d');

        this.scale = 1 / 50000; // Adjusted scale
        this.stars = this.createStars(200);
    }

    createStars(count) {
        const stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * this.pilotCanvas.width,
                y: Math.random() * this.pilotCanvas.height,
                radius: Math.random() * 1.5,
            });
        }
        return stars;
    }

    render(gameObjects) {
        this.renderMissionControl(gameObjects);
        this.renderZoomedMissionControl(gameObjects);
        this.renderPilotView(gameObjects);
    }

    renderMissionControl(gameObjects) {
        const ctx = this.missionControlCtx;
        ctx.clearRect(0, 0, this.missionControlCanvas.width, this.missionControlCanvas.height);
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.missionControlCanvas.width, this.missionControlCanvas.height);
        ctx.translate(this.missionControlCanvas.width / 2, this.missionControlCanvas.height / 2);

        // Draw Earth
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(0, 0, R_EARTH * this.scale, 0, 2 * Math.PI);
        ctx.fill();

        // Draw orbits and game objects
        gameObjects.forEach(obj => {
            const orbitRadius = Math.sqrt(obj.position.x * obj.position.x + obj.position.y * obj.position.y);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath();
            ctx.arc(0, 0, orbitRadius * this.scale, 0, 2 * Math.PI);
            ctx.stroke();

            const isCraft = obj.id === 'craft';
            ctx.fillStyle = isCraft ? 'red' : 'yellow';
            const x = obj.position.x * this.scale;
            const y = -obj.position.y * this.scale;
            ctx.beginPath();
            ctx.arc(x, y, isCraft ? 4 : 6, 0, 2 * Math.PI);
            ctx.fill();

            if (isCraft) {
                ctx.strokeStyle = 'white';
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + Math.cos(obj.thrust.angle) * 20, y - Math.sin(obj.thrust.angle) * 20);
                ctx.stroke();
            }

            ctx.fillStyle = 'white';
            ctx.font = '10px sans-serif';
            ctx.fillText(isCraft ? 'Craft' : 'Station', x + 10, y);
        });

        ctx.restore();
    }

    renderZoomedMissionControl(gameObjects) {
        const ctx = this.zoomedMissionControlCtx;
        ctx.clearRect(0, 0, this.zoomedMissionControlCanvas.width, this.zoomedMissionControlCanvas.height);
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.zoomedMissionControlCanvas.width, this.zoomedMissionControlCanvas.height);

        const craft = gameObjects.find(obj => obj.id === 'craft');
        const station = gameObjects.find(obj => obj.id === 'station');

        const distance = Math.sqrt((station.position.x - craft.position.x) ** 2 + (station.position.y - craft.position.y) ** 2);
        const zoomScale = this.zoomedMissionControlCanvas.width / (distance * 1.5);

        const midX = (craft.position.x + station.position.x) / 2;
        const midY = (craft.position.y + station.position.y) / 2;

        ctx.translate(this.zoomedMissionControlCanvas.width / 2 - midX * zoomScale, this.zoomedMissionControlCanvas.height / 2 + midY * zoomScale);

        gameObjects.forEach(obj => {
            const isCraft = obj.id === 'craft';
            ctx.fillStyle = isCraft ? 'red' : 'yellow';
            const x = obj.position.x * zoomScale;
            const y = -obj.position.y * zoomScale;
            ctx.beginPath();
            ctx.arc(x, y, isCraft ? 4 : 6, 0, 2 * Math.PI);
            ctx.fill();

            if (isCraft) {
                ctx.strokeStyle = 'white';
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + Math.cos(obj.thrust.angle) * 20, y - Math.sin(obj.thrust.angle) * 20);
                ctx.stroke();
            }

            ctx.fillStyle = 'white';
            ctx.font = '10px sans-serif';
            ctx.fillText(isCraft ? 'Craft' : 'Station', x + 10, y);
        });

        ctx.restore();
    }

    renderPilotView(gameObjects) {
        const ctx = this.pilotCtx;
        ctx.clearRect(0, 0, this.pilotCanvas.width, this.pilotCanvas.height);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.pilotCanvas.width, this.pilotCanvas.height);

        // Draw stars
        ctx.fillStyle = 'white';
        this.stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
            ctx.fill();
        });

        const craft = gameObjects.find(obj => obj.id === 'craft');
        const station = gameObjects.find(obj => obj.id === 'station');

        // Draw Earth horizon
        const earthDist = Math.sqrt(craft.position.x * craft.position.x + craft.position.y * craft.position.y);
        const earthVisibleRadius = R_EARTH / (earthDist - R_EARTH) * 100;
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.pilotCanvas.width / 2, this.pilotCanvas.height + earthVisibleRadius, earthVisibleRadius, 0, 2 * Math.PI);
        ctx.fill();

        // Draw Station indicator (box)
        const dx = station.position.x - craft.position.x;
        const dy = station.position.y - craft.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const stationAngle = Math.atan2(dy, dx);
        const relativeAngle = stationAngle - craft.thrust.angle;

        // Calculate position for the station indicator box
        const indicatorSize = Math.max(10, Math.min(50, 50000 / distance)); // Size scales with inverse distance, clamped
        const indicatorDistance = Math.min(distance * this.scale * 500, this.pilotCanvas.width / 2 - indicatorSize); // Clamped to screen edge

        const indicatorX = this.pilotCanvas.width / 2 + Math.cos(relativeAngle) * indicatorDistance;
        const indicatorY = this.pilotCanvas.height / 2 - Math.sin(relativeAngle) * indicatorDistance;

        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.strokeRect(indicatorX - indicatorSize / 2, indicatorY - indicatorSize / 2, indicatorSize, indicatorSize);

        ctx.fillStyle = 'yellow';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Station', indicatorX, indicatorY - indicatorSize / 2 - 5);
    }
}