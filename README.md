# Superseed Maze Challenge

A web-based maze game where players navigate through a maze to reach a goal using arrow keys (on desktop) or on-screen controls (on mobile). The game features multiple difficulty levels, a timer, and a responsive design with a dynamic background that transitions on load.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)

## Overview

Superseed Maze Challenge is an interactive game built with HTML, CSS, and JavaScript. Players guide a character through a maze to a target, with options to shuffle the maze or reset their position. The game adapts to both desktop and mobile devices, offering a seamless experience with a fade-in transition for the game content on page load.

## Features

- **Multiple Levels**: Choose from Newbie (26x16), Adventurer (50x30), Veteran (100x60), and Legend (150x90) mazes. Larger levels are PC-only.
- **Responsive Design**:
  - Desktop: Arrow key controls, buttons beside the level selector.
  - Mobile: On-screen arrow buttons, duplicated background (top and bottom).
- **Dynamic Background**:
  - Desktop: Single centered background.
  - Mobile: Background duplicated at the top and bottom.
- **Fade-In Transition**: Game content fades in on page load while the background displays immediately.
- **Timer**: Tracks time taken to complete the maze.
- **Shuffle & Reset**: Options to regenerate the maze or reset the player’s position.
- **Popups**: Notifications for mobile limitations and level completion.

## Installation

1. **Clone or Download**:

   ```bash
   git clone https://github.com/your-username/superseed-maze-challenge.git

   Or download the ZIP file and extract it.
   Navigate to the Project Directory:
   bash
   ```

cd superseed-maze-challenge

Open in a Browser:
Open index.html in a web browser (e.g., Chrome, Firefox).

No server is required for basic functionality, but a local server is recommended for development (see below).

Optional: Local Server:
Use a tool like live-server or Python’s HTTP server to avoid CORS issues with local files:
bash

# Using Python

python -m http.server 8000

Then visit http://localhost:8000 in your browser.

Usage
Desktop:
Select a level from the dropdown (all levels available).

Use arrow keys to move the player.

Click "Shuffle Maze" to regenerate the maze or "Reset Seed" to start over.

Mobile:
Select a level (Newbie or Adventurer only).

Use the on-screen arrow buttons to move.

Buttons below the maze allow shuffling or resetting.

Objective: Reach the goal as quickly as possible!

File Structure

superseed-maze-challenge/
├── index.html # Main HTML file
├── styles.css # CSS styles for layout and responsiveness
├── script.js # JavaScript for game logic and fade-in effect
└── README.md # Project documentation

Customization
Background: Adjust background-size or background properties in styles.css to change the background behavior.

Fade-In: Modify the transition duration (e.g., 0.5s or 2s) in #game-container’s CSS.

Colors: Update #00ffcc (cyan), #ff007a (pink), or #1a1a1a (dark gray) in styles.css for a different theme.

Levels: Add new <option> elements in index.html and update the maze logic in script.js.

Mobile Breakpoint: Change 600px in media queries to adjust when mobile mode triggers.

Contributing
Fork the repository.

Create a feature branch (git checkout -b feature-name).

Commit your changes (git commit -m "Add feature").

Push to the branch (git push origin feature-name).

Open a pull request.

Feel free to report issues or suggest enhancements via the GitHub Issues tab!
License
This project is licensed under the MIT License. See LICENSE for details.
