# Rendezvous: An Orbital Docking Game

This document outlines the plan and product requirements for "Rendezvous," a browser-based game simulating the orbital dynamics of space rendezvous.

## 1. Game Concept

The player, an astronaut, pilots a spacecraft to rendezvous and dock with a space station. Both the spacecraft and the station are in the same initial orbital plane around the Earth. The player's objective is to use the spacecraft's thrusters to safely approach and dock with the station.

## 2. Gameplay Mechanics

*   **Physics-Based Simulation:** The core of the game is a realistic 2D simulation of orbital mechanics. The gravitational pull of the Earth and the thrust from the spacecraft's engine will be the primary forces acting on the spacecraft.
*   **Spacecraft Control:**
    *   **Thrust Vector:** The player can adjust the direction of the spacecraft's thrust using the **Up** and **Down** arrow keys.
    *   **Thrust Application:** The player fires the engine by holding down the **Spacebar**.
*   **Objective:** The primary goal is to match the orbit of the space station and achieve a gentle docking.

## 3. Game Views

The game will feature a two-window display:

*   **Window 1: Mission Control View:**
    *   A top-down view of the Earth, the space station, and the player's spacecraft.
    *   Lines will indicate the orbital paths of both the station and the spacecraft.
    *   This view provides situational awareness and helps the player plan their maneuvers.
*   **Window 2: Pilot View:**
    *   A first-person view from the cockpit of the spacecraft.
    *   The view will be oriented in the direction of travel.
    *   The Earth will be visible at the bottom of the screen, providing a visual reference for orientation.

---

# Product Requirements Document (PRD)

## 1. Introduction

This PRD describes "Rendezvous," a web-based game that provides an educational and engaging experience of orbital mechanics. Players will learn the non-intuitive nature of orbital maneuvers through hands-on piloting of a spacecraft.

## 2. Goals

*   To create a fun and challenging game that is easy to learn but difficult to master.
*   To accurately simulate 2D orbital dynamics to provide an educational experience.
*   To develop a game that can be played in a standard web browser without any plugins.

## 3. Target Audience

*   Space enthusiasts and students interested in physics and astronomy.
*   Gamers who enjoy simulation and skill-based challenges.

## 4. Core Features

### 4.1. Orbital Dynamics Simulation

*   The simulation will model the gravitational force of the Earth on the spacecraft and the space station.
*   The simulation will be in 2D, confined to the orbital plane.
*   The physics engine will update in real-time based on player input.

### 4.2. Spacecraft Control

*   The player will have direct control over the spacecraft's propulsion system.
*   **Up/Down Arrow Keys:** Adjust the angle of the thruster relative to the spacecraft's orientation.
*   **Spacebar:** Fire the thruster, applying force to the spacecraft.

### 4.3. Game Views

*   **Mission Control View:** A 2D representation of the orbital environment, showing the Earth, station, and spacecraft. Orbital paths will be drawn for the station and the spacecraft.
*   **Pilot View:** A first-person perspective from the spacecraft, showing the starfield and the Earth below.

### 4.4. Win/Loss Conditions

*   **Win Condition:** Successfully docking with the space station. This will be defined as bringing the spacecraft to a specific proximity and low relative velocity to the station.
*   **Loss Conditions:**
    *   Crashing into the space station.
    *   Entering the Earth's atmosphere (de-orbiting).
    *   Running out of fuel (if implemented).

### 4.5. Docking Mode and Indicators

*   **Docking Mode:** When the spacecraft is within a certain range of the station, docking mode will be activated, providing more precise controls.
    *   **Translational Controls:** WASD keys for fine-tuned movement (up, down, left, right).
    *   **Rotational Controls:** Q and E keys for fine-tuned rotation.
*   **Pilot View Indicator:** An on-screen box will highlight the station's location. If the station is off-screen, an arrow will point towards it.
*   **Mission View Indicator:** A line will be drawn on the spacecraft to indicate its docking port, showing the correct orientation for docking.

## 5. Technical Stack

*   **Language:** JavaScript (or TypeScript for improved maintainability).
*   **Graphics:** HTML5 Canvas or a library like p5.js or Phaser for rendering.
*   **Physics:** A simple, custom-built physics engine to handle the 2D orbital mechanics.

## 6. Future Enhancements

*   **Fuel Management:** Introduce a limited fuel supply to add a layer of resource management.
*   **3D Simulation:** Expand the game into a full 3D environment.
*   **Multiple Levels:** Introduce different starting scenarios with varying difficulty.
*   **Docking Controls:** Add specific controls for the final docking procedure (e.g., translation thrusters).

---

# Product Design Document: Rendezvous

## 1. Overview

This document outlines the software architecture and design for the orbital rendezvous game. The design is modular to allow for parallel development and future extensibility.

## 2. System Architecture

The game will be built using a modular architecture. Each module will have a specific responsibility and a well-defined interface for interacting with other modules.

### 2.1. Modules

The system will be composed of the following modules:

*   **Game Engine:** The core of the game, responsible for the main game loop and coordinating all other modules.
*   **Physics Engine:** Handles all physics calculations, including orbital mechanics and spacecraft propulsion.
*   **Graphics Engine:** Renders all visual elements of the game, including the two game views.
*   **Input Handler:** Captures and processes player input.
*   **Game State Manager:** Manages the state of the game objects and the overall game flow (e.g., win/loss conditions).
*   **UI Manager:** Manages the user interface elements, such as readouts for fuel, velocity, and distance.

### 2.2. Module Interaction Diagram

```
+--------------+       +-----------------+       +--------------------+
| Input Handler|------>|   Game Engine   |<----->| Game State Manager |
+--------------+       +-------+---------+       +--------------------+
                             |                     ^
                             |                     |
                             v                     |
+--------------+       +-----------------+       +--------------------+
| Physics Engine |<----->| Graphics Engine |       |     UI Manager     |
+--------------+       +-----------------+       +--------------------+
```

## 3. Module Specifications

### 3.1. Game Engine

*   **Responsibility:**
    *   Initializes all other modules.
    *   Contains the main game loop.
    *   Coordinates the flow of data between modules.
*   **Key Functions/Methods:**
    *   `start()`: Starts the game loop.
    *   `pause()`: Pauses the game loop.
    *   `update(deltaTime)`: The main update function called on each frame.
*   **Interaction:**
    *   Receives input from the `Input Handler`.
    *   Calls the `Physics Engine` to update the game state.
    *   Calls the `Graphics Engine` to render the game.
    *   Consults the `Game State Manager` to check for win/loss conditions.

### 3.2. Physics Engine

*   **Responsibility:**
    *   Calculates the gravitational forces.
    *   Applies thrust to the spacecraft based on player input.
    *   Updates the position and velocity of all game objects.
*   **Key Functions/Methods:**
    *   `update(deltaTime, gameObjects, thrustVector)`: Updates the physics state.
    *   `getPhysicsState()`: Returns the current position and velocity of all objects.
*   **Data Structures:**
    *   `PhysicsObject`: A structure containing position, velocity, mass, and other physics-related properties for each object.
*   **Interaction:**
    *   Receives thrust information from the `Game Engine`.
    *   Provides the updated physics state to the `Game Engine`.

### 3.3. Graphics Engine

*   **Responsibility:**
    *   Renders the Mission Control View.
    *   Renders the Pilot View.
    *   Draws the Earth, spacecraft, space station, and orbital paths.
*   **Key Functions/Methods:**
    *   `render(gameObjects)`: Renders a single frame.
    *   `setMissionControlView()`: Switches to the mission control view.
    *   `setPilotView()`: Switches to the pilot view.
*   **Interaction:**
    *   Receives the game state from the `Game Engine` to be rendered.

### 3.4. Input Handler

*   **Responsibility:**
    *   Listens for keyboard events (arrow keys and spacebar).
    *   Translates raw input into game-specific commands.
*   **Key Functions/Methods:**
    *   `getThrustVector()`: Returns the current direction of thrust.
    *   `isFiring()`: Returns true if the spacebar is being held down.
*   **Interaction:**
    *   Provides the player's input to the `Game Engine`.

### 3.5. Game State Manager

*   **Responsibility:**
    *   Maintains the state of all game objects (spacecraft, station).
    *   Tracks the overall game state (e.g., `playing`, `paused`, `docked`, `crashed`).
    *   Checks for win/loss conditions.
*   **Key Functions/Methods:**
    *   `getGameState()`: Returns the current game state.
    *   `updateState(gameObjects)`: Updates the game state based on the positions and velocities of the game objects.
*   **Data Structures:**
    *   `GameObject`: A structure containing information about each object in the game (e.g., position, velocity, type).
*   **Interaction:**
    *   Provides the current game state to the `Game Engine`.

### 3.6. UI Manager

*   **Responsibility:**
    *   Displays textual information to the player.
    *   Renders readouts for relative velocity, distance to the station, fuel levels, etc.
*   **Key Functions/Methods:**
    *   `update(uiData)`: Updates the UI elements.
*   **Data Structures:**
    *   `UIData`: A structure containing the data to be displayed on the UI.
*   **Interaction:**
    *   Receives data from the `Game Engine` to be displayed.

## 4. Data Flow

1.  The `Input Handler` captures the player's key presses.
2.  The `Game Engine` reads the input from the `Input Handler`.
3.  The `Game Engine` passes the thrust vector and firing status to the `Physics Engine`.
4.  The `Physics Engine` updates the positions and velocities of the spacecraft and station.
5.  The `Game Engine` retrieves the updated game state from the `Physics Engine`.
6.  The `Game State Manager` checks for win/loss conditions based on the new game state.
7.  The `Game Engine` passes the updated game state to the `Graphics Engine` for rendering.
8.  The `Game Engine` sends relevant data (e.g., relative velocity) to the `UI Manager` for display.
9.  The `Graphics Engine` and `UI Manager` draw the new frame on the screen.
10. The loop repeats.

---

# Implementation Progress

*   **Initial Setup:** Created the basic `index.html`, `style.css`, and `main.js` files.
*   **Modular Architecture:** Set up the `src` directory with separate modules for `GameEngine`, `PhysicsEngine`, `GraphicsEngine`, `InputHandler`, `GameStateManager`, and `UIManager`.
*   **Game Loop:** Implemented the main game loop in `GameEngine.js`.
*   **Game State:** Defined the initial state of the spacecraft and space station in `GameStateManager.js`.
*   **Physics:** Implemented gravity and thrust calculations in `PhysicsEngine.js`.
*   **Graphics:** Implemented the Mission Control and Pilot views in `GraphicsEngine.js`. The Mission Control view now shows the Earth, spacecraft, station, and orbits. The Pilot View shows the Earth and the station.
*   **Input:** Implemented keyboard input for spacecraft control in `InputHandler.js`.
*   **UI:** Implemented a UI to display distance, relative velocity, and fuel in `UIManager.js`.
*   **Development Server:** Set up a local development server to run the game.