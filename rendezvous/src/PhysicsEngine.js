const G = 6.67430e-11; // Gravitational constant
const M_EARTH = 5.972e24; // Mass of Earth in kg

export default class PhysicsEngine {
    update(deltaTime, gameObjects, input) {
        const dt = deltaTime / 1000; // Convert ms to s

        gameObjects.forEach(obj => {
            const distSq = obj.position.x * obj.position.x + obj.position.y * obj.position.y;
            const dist = Math.sqrt(distSq);
            const forceGrav = G * M_EARTH * obj.mass / distSq;
            const gravAngle = Math.atan2(-obj.position.y, -obj.position.x);

            let forceX = forceGrav * Math.cos(gravAngle);
            let forceY = forceGrav * Math.sin(gravAngle);

            if (obj.id === 'craft') {
                if (input.up) {
                    obj.thrust.angle -= 0.01;
                }
                if (input.down) {
                    obj.thrust.angle += 0.01;
                }
                if (input.space) {
                    obj.thrust.magnitude = 100000; // Newtons
                } else {
                    obj.thrust.magnitude = 0;
                }

                forceX += obj.thrust.magnitude * Math.cos(obj.thrust.angle);
                forceY += obj.thrust.magnitude * Math.sin(obj.thrust.angle);
            }

            const ax = forceX / obj.mass;
            const ay = forceY / obj.mass;

            obj.velocity.x += ax * dt;
            obj.velocity.y += ay * dt;

            obj.position.x += obj.velocity.x * dt;
            obj.position.y += obj.velocity.y * dt;
        });
    }
}