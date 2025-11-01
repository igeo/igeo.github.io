const G = 6.67430e-11; // Gravitational constant
const M_EARTH = 5.972e24; // Mass of Earth in kg

export default class PhysicsEngine {
    update(deltaTime, gameObjects, input, dockingMode) {
        const dt = deltaTime / 1000; // Convert ms to s

        gameObjects.forEach(obj => {
            const distSq = obj.position.x * obj.position.x + obj.position.y * obj.position.y;
            const dist = Math.sqrt(distSq);
            const forceGrav = G * M_EARTH * obj.mass / distSq;
            const gravAngle = Math.atan2(-obj.position.y, -obj.position.x);

            let forceX = forceGrav * Math.cos(gravAngle);
            let forceY = forceGrav * Math.sin(gravAngle);

            if (obj.id === 'craft') {
                // Thrust angle adjustment (relative to craft orientation)
                if (input.up) {
                    obj.thrust.angle -= 0.01;
                }
                if (input.down) {
                    obj.thrust.angle += 0.01;
                }

                if (dockingMode) {
                    // Rotational thrust
                    let torque = 0;
                    if (input.q) {
                        torque = -100000; // Nm
                    }
                    if (input.e) {
                        torque = 100000; // Nm
                    }
                    const angularAcceleration = torque / (obj.mass * 100); // I = m * r^2, simplified
                    obj.angularVelocity += angularAcceleration * dt;

                    // Translational thrust
                    const thrustMagnitude = 10000; // Lower thrust for docking
                    if (input.w) {
                        forceX += thrustMagnitude * Math.cos(obj.orientation);
                        forceY += thrustMagnitude * Math.sin(obj.orientation);
                    }
                    if (input.s) {
                        forceX -= thrustMagnitude * Math.cos(obj.orientation);
                        forceY -= thrustMagnitude * Math.sin(obj.orientation);
                    }
                    if (input.a) {
                        forceX += thrustMagnitude * Math.cos(obj.orientation - Math.PI / 2);
                        forceY += thrustMagnitude * Math.sin(obj.orientation - Math.PI / 2);
                    }
                    if (input.d) {
                        forceX += thrustMagnitude * Math.cos(obj.orientation + Math.PI / 2);
                        forceY += thrustMagnitude * Math.sin(obj.orientation + Math.PI / 2);
                    }
                    obj.thrust.magnitude = 0; // Main engine disabled in docking mode
                } else {
                    if (input.space) {
                        obj.thrust.magnitude = 100000; // Newtons
                    } else {
                        obj.thrust.magnitude = 0;
                    }

                    const totalThrustAngle = obj.orientation + obj.thrust.angle;
                    forceX += obj.thrust.magnitude * Math.cos(totalThrustAngle);
                    forceY += obj.thrust.magnitude * Math.sin(totalThrustAngle);
                }

                obj.orientation += obj.angularVelocity * dt;
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