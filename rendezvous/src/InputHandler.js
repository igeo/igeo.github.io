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
        };
    }
}
