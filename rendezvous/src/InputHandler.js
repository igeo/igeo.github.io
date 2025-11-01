export default class InputHandler {
    constructor() {
        this.keys = {};
        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);
    }

    getInput() {
        return {
            up: this.keys['ArrowUp'] || false,
            down: this.keys['ArrowDown'] || false,
            space: this.keys['Space'] || false,
            w: this.keys['KeyW'] || false,
            a: this.keys['KeyA'] || false,
            s: this.keys['KeyS'] || false,
            d: this.keys['KeyD'] || false,
            q: this.keys['KeyQ'] || false,
            e: this.keys['KeyE'] || false,
        };
    }
}
