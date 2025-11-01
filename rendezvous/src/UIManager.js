export default class UIManager {
    constructor() {
        this.uiContainer = document.getElementById('ui-container');
    }

    update(uiData) {
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
        `;
    }
}
