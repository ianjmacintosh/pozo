import React from "react";

import Scoreboard from "./Scoreboard";
import Field from "./Field";
import Homebase from "./Homebase";
import Counter from "./Counter";
import { getRandomInt } from "../helpers";

import "../css/App.css";

const colorMap = {
  0: "cyan",
  1: "magenta",
  2: "yellow",
  3: "black",
};

const directionMap = {
  0: "north",
  1: "west",
  2: "east",
  3: "south",
};

const stages = [
  {
    monsters: 10,
    creationRate: 3,
    waveDuration: 10,
    rateMultiplier: 1.25,
  },
];

class App extends React.Component {
  state = {
    currentStage: 0,
    stageSettings: {
      monsters: 0,
      creationRate: 0,
      waveDuration: 0,
      rateMultiplier: 0,
    },
    fields: {
      north: {
        // North and south queues will end the game when their length > 5
        queueLengthLimit: 5,
        queues: [[], [], [], []],
      },
      west: {
        // West and east queues will end the game when their length > 8
        queueLengthLimit: 8,
        queues: [[], [], [], []],
      },
      east: {
        queueLengthLimit: 8,
        queues: [[], [], [], []],
      },
      south: {
        queueLengthLimit: 5,
        queues: [[], [], [], []],
      },
    },
    base: {
      size: 4,
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
    window.addEventListener("keydown", this.handleKeypress);
  }

  handleKeypress = ({ key }) => {
    // Each movement updates app state for hero x & y
    const keyMappings = {
      w: "up",
      d: "right",
      s: "down",
      a: "left",
      " ": "strike",

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
      if (keyMappings[key] === "strike") {
        let direction = this.state.hero.orientation,
          queue = this.state.hero.y - 1,
          color = this.state.hero.color;

        // If the hero is pointed north or south, use X coord for queue
        if (direction === "north" || direction === "south") {
          queue = this.state.hero.x - 1;
        }

        this.strike(direction, queue, color);
      } else {
        this.walk(keyMappings[key]);
      }
    }
  };

  setStage = (stageNumber) => {
    const stageSettings = stages[stageNumber];

    // Number of monsters in stage (e.g., 50)
    this.setState({ stageSettings });

    // Rate of monster creation (interval at which a new monster created; e.g., 3)
    // Wave duration (interval at which rate accelerates; e.g., 10)
    // Rate of acceleration (multiplier to apply to rate; e.g. 0.75)
    // In the example above: 50 monsters need to be eliminated to move to next stage. A new monster is provided every 3 seconds. Every 10 seconds, the duration decreases by 25% -- instead of monsters being created every 3 seconds, new monsters get created every 2.25 seconds. After 10 more seconds, a new monster gets created every 1.6875 seconds
    console.log("Setting stage");
  };

  monsterTimer = null;
  waveTimer = null;

  start = () => {
    this.monsterTimer = window.setInterval(() => {
      this.addMonster(
        directionMap[getRandomInt(0, 3)],
        getRandomInt(0, 3),
        getRandomInt(0, 3)
      );
    }, this.state.stageSettings.creationRate * 1000);

    this.waveTimer = window.setInterval(() => {
      let stageSettings = this.state.stageSettings;
      stageSettings.creationRate =
        stageSettings.creationRate / stageSettings.rateMultiplier;
      console.log(
        `A new monster will now be created every ${stageSettings.creationRate} seconds`
      );

      this.setState({ stageSettings });
      clearInterval(this.monsterTimer);

      this.monsterTimer = window.setInterval(() => {
        this.addMonster(
          directionMap[getRandomInt(0, 3)],
          getRandomInt(0, 3),
          getRandomInt(0, 3)
        );
      }, this.state.stageSettings.creationRate * 1000);
    }, this.state.stageSettings.waveDuration * 1000);
  };

  // Update state to add monster of randomColor to randomQueue of randomField
  addMonster = (direction = "north", queueNumber = 0, colorNumber = 0) => {
    // Update the state for the given queue to add a monster to it
    console.log(
      `Adding a ${colorMap[colorNumber]} monster to ${direction} queue #${queueNumber}`
    );
    // Make a copy of the field
    let fields = this.state.fields;

    // Add a monster to the front of it
    fields[direction].queues[queueNumber].push(colorNumber);

    // Update the state
    this.setState({ fields });

    // Determine if we're over the max queue length and if so, end the stage
    if (
      fields[direction].queues[queueNumber].length >
      fields[direction].queueLengthLimit
    ) {
      this.endStage();
    }
    // Create new Monster component within the appropriate queue (this should be handled automatically)
  };

  strike = (field, queue, strikeColor) => {
    // Handler reads hero coords and direction to determine which queue to strike
    let fields = { ...this.state.fields },
      targetQueue = fields[field].queues[queue],
      monsterColor = targetQueue[0];

    if (strikeColor === monsterColor) {
      console.log("Matches the color!");
      targetQueue.shift();
      this.setState({ fields });
      this.strike(field, queue, strikeColor);
    }
    // Otherwise, color does not match monster color
    else {
      console.log("Does not match the color!");
      //   Report streak end via App.endStreak()
      this.endStreak();

      //   Update hero color via Hero.changeColor()
      if (monsterColor) {
        this.changeColor(monsterColor);
      }
    }
    console.log(`Strike at the right queue!`);
  };

  endStreak = () => {
    console.log("Streak is over!");
  };

  endStage = () => {
    clearInterval(this.monsterTimer);
    clearInterval(this.waveTimer);
    // Congratulate user, show score, then call App.setStage with settings for next level
    console.log(`🏁 Congratulations! You completed the stage 🏁`);
  };

  changeColor = (newColor) => {
    const hero = { ...this.state.hero };
    hero.color = newColor;

    // Update app state for hero color
    this.setState({ hero });
  };

  // Walk accepts a direction, and calls move
  walk = (direction) => {
    // Each movement updates app state for hero x & y
    const directionChanges = {
        up: [0, -1],
        right: [1, 0],
        down: [0, 1],
        left: [-1, 0],
      },
      baseSize = this.state.base.size;

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
  };

  render() {
    return (
      <div className="App">
        <header>
          <Scoreboard />
        </header>
        <main>
          <Field direction="north" queues={this.state.fields.north.queues} />
          <Field direction="west" queues={this.state.fields.west.queues} />
          <Field direction="east" queues={this.state.fields.east.queues} />
          <Field direction="south" queues={this.state.fields.south.queues} />
          <Homebase
            heroX={this.state.hero.x}
            heroY={this.state.hero.y}
            heroDirection={this.state.hero.direction}
            heroColor={this.state.hero.color}
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
