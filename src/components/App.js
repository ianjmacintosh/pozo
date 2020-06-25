import React from "react";

import "../css/App.css";
import Scoreboard from "./Scoreboard";
import Field from "./Field";
import Homebase from "./Homebase";
import Counter from "./Counter";

class App extends React.Component {
  state = {
    board: {
      north: {
        // North and south queues will end the game when their length > 5
        queueLengthLimit: 5,
        queues: [
          [
            // Each item represents a monster where the value represents its color
            0,
          ],
          [],
          [],
          [],
        ],
      },
      west: {
        // West and east queues will end the game when their length > 8
        queueLengthLimit: 8,
        queues: [[], [], [], []],
      },
      east: [[], [], [], []],
      south: [[], [], [], []],
      base: {
        size: 4,
      },
    },
    hero: {
      color: 0,
      x: 1,
      y: 1,
      orientation: "north",
    },
    streaking: true,
    score: 200,
    monstersRemaining: 28,
  };

  componentDidMount() {
    window.addEventListener("keydown", this.walk);
  }

  setStage = (settings) => {
    // Number of monsters in stage (e.g., 50)
    // Rate of monster creation (interval at which a new monster created; e.g., 3)
    // Wave duration (interval at which rate accelerates; e.g., 10)
    // Rate of acceleration (multiplier to apply to rate; e.g. 0.75)
    // In the example above: 50 monsters need to be eliminated to move to next stage. A new monster is provided every 3 seconds. Every 10 seconds, the duration decreases by 25% -- instead of monsters being created every 3 seconds, new monsters get created every 2.25 seconds. After 10 more seconds, a new monster gets created every 1.6875 seconds
    console.log("Setting stage");
  };

  addMonster = () => {
    // Update state to add monster of randomColor to randomQueue of randomField
    // Create new Monster component within the appropriate queue (this should be handled automatically)
    console.log("Add a monster to a random queue");
  };

  strike = () => {
    // Read hero coords and direction to determine which queue to strike
    // Call Queue.strike() on appropriate queue
    console.log(`Strike at the right queue!`);
  };

  endStreak = () => {
    console.log("Streak is over!");
  };

  endStage = () => {
    // Congratulate user, show score, then call App.setStage with settings for next level
    console.log(`🏁 Congratulations! You completed the stage 🏁`);
  };

  // Walk accepts a direction, and calls move
  walk = ({ key }) => {
    // Each movement updates app state for hero x & y
    const keyMappings = {
      w: "up",
      d: "right",
      s: "down",
      a: "left",

      W: "up",
      D: "right",
      S: "down",
      A: "left",

      ArrowUp: "up",
      ArrowRight: "right",
      ArrowDown: "down",
      ArrowLeft: "left",
    };

    if (key in keyMappings) {
      const direction = keyMappings[key],
        directionChanges = {
          up: [0, -1],
          right: [1, 0],
          down: [0, 1],
          left: [-1, 0],
        },
        baseSize = this.state.board.base.size;

      // Update hero coordinates based on direction movement
      let hero = { ...this.state.hero };

      hero.direction = direction;

      // Each coordinate must be between 1 and 4 (inclusive)
      hero.x += directionChanges[direction][0];
      hero.x = Math.max(1, hero.x);
      hero.x = Math.min(baseSize, hero.x);

      hero.y += directionChanges[direction][1];
      hero.y = Math.max(1, hero.y);
      hero.y = Math.min(baseSize, hero.y);

      this.setState({ hero });

      console.log(this.state.hero);
    }
  };

  render() {
    return (
      <div className="App">
        <header>
          <Scoreboard />
        </header>
        <main>
          <Field className="north-field" />
          <Field className="west-field" />
          <Field className="east-field" />
          <Field className="south-field" />
          <Homebase
            heroX={this.state.hero.x}
            heroY={this.state.hero.y}
            heroDirection={this.state.hero.direction}
          />
        </main>
        <footer>
          <Counter />
        </footer>
      </div>
    );
  }
}

export default App;
