export default class UIManager {
    constructor() {
        this.uiContainer = document.getElementById('ui-container');
    }

    update(uiData) {
        if (uiData.gameState !== 'playing') {
            this.renderWinLossScreen(uiData.gameState);
            return;
        }

        if (!uiData.craft || !uiData.station) {
            this.uiContainer.innerHTML = "Awaiting data...";
            return;
        }

        const formatValue = (val) => (val / 1000).toFixed(2);

        this.uiContainer.innerHTML = `
            <h4>Craft</h4>
            <table>
                <tr><td>Pos X</td><td>${formatValue(uiData.craft.position.x)} km</td></tr>
                <tr><td>Pos Y</td><td>${formatValue(uiData.craft.position.y)} km</td></tr>
                <tr><td>Vel X</td><td>${formatValue(uiData.craft.velocity.x)} km/s</td></tr>
                <tr><td>Vel Y</td><td>${formatValue(uiData.craft.velocity.y)} km/s</td></tr>
                <tr><td>Altitude</td><td>${formatValue(uiData.craft.altitude)} km</td></tr>
                <tr><td>Speed</td><td>${formatValue(uiData.craft.speed)} km/s</td></tr>
            </table>

            <h4>Station</h4>
            <table>
                <tr><td>Pos X</td><td>${formatValue(uiData.station.position.x)} km</td></tr>
                <tr><td>Pos Y</td><td>${formatValue(uiData.station.position.y)} km</td></tr>
                <tr><td>Vel X</td><td>${formatValue(uiData.station.velocity.x)} km/s</td></tr>
                <tr><td>Vel Y</td><td>${formatValue(uiData.station.velocity.y)} km/s</td></tr>
                <tr><td>Altitude</td><td>${formatValue(uiData.station.altitude)} km</td></tr>
                <tr><td>Speed</td><td>${formatValue(uiData.station.speed)} km/s</td></tr>
            </table>

            <h4>Relative</h4>
            <table>
                <tr><td>Distance</td><td>${(uiData.relative.distance / 1000).toFixed(2)} km</td></tr>
                <tr><td>Velocity</td><td>${(uiData.relative.velocity).toFixed(2)} m/s</td></tr>
            </table>

            <h4>Fuel: ${uiData.fuel.toFixed(2)}%</h4>

            <div id="instructions">
                <h4>Key</h4>
                <p><span style="color: white;">White line:</span> Thrust vector</p>
                <p><span style="color: lime;">Green line:</span> Docking port</p>
            </div>
        `;
    }

    renderWinLossScreen(gameState) {
        let message = '';
        switch (gameState) {
            case 'docked':
                message = '<h1>Docking Successful!</h1><p>Mission Accomplished.</p>';
                break;
            case 'crashed':
                message = '<h1>Mission Failed!</h1><p>You crashed into the station.</p>';
                break;
            case 'de-orbited':
                message = '<h1>Mission Failed!</h1><p>You have de-orbited and entered the Earth\'s atmosphere.</p>';
                break;
        }

        this.uiContainer.innerHTML = `
            <div class="win-loss-message">
                ${message}
                <button id="restart">Restart</button>
            </div>
        `;

        document.getElementById('restart').addEventListener('click', () => {
            window.location.reload(); // Simple restart for now
        });
    }
}
