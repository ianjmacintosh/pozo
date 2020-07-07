import React from "react";

import Scoreboard from "./Scoreboard";
import Field from "./Field";
import Homebase from "./Homebase";
import Counter from "./Counter";
import StartButton from "./StartButton";
import { getRandomInt } from "../helpers";

import "../css/App.css";

const colorMap = {
  0: "cyan",
  1: "magenta",
  2: "yellow",
  3: "black",
};

const directionMap = {
  0: "up",
  1: "left",
  2: "right",
  3: "down",
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
      up: {
        // Up and down queues will end the game when their length > 5
        queueLengthLimit: 5,
        queues: [[], [], [], []],
      },
      left: {
        // Left and right queues will end the game when their length > 8
        queueLengthLimit: 8,
        queues: [[], [], [], []],
      },
      right: {
        queueLengthLimit: 8,
        queues: [[], [], [], []],
      },
      down: {
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
      orientation: "up",
    },
    streak: 0,
    score: 0,
    monstersRemaining: 0,
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
        if (direction === "up" || direction === "down") {
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
    console.log(`Setting stage ${stageNumber}`);
  };

  monsterTimer = null;
  waveTimer = null;

  start = (stageNumber = 0) => {
    const stageSettings = stages[stageNumber],
      setTimers = () => {
        clearInterval(this.monsterTimer);
        clearInterval(this.waveTimer);

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

    // Number of monsters in stage (e.g., 50)
    this.setState({ stageSettings }, setTimers);
    this.setState({ monstersRemaining: stageSettings.monsters });
  };

  // Update state to add monster of randomColor to randomQueue of randomField
  addMonster = (direction = "up", queueNumber = 0, colorNumber = 0) => {
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
    console.log(
      `Striking at ${field} queue #${queue} with color ${strikeColor}`
    );
    // Handler reads hero coords and direction to determine which queue to strike
    let fields = { ...this.state.fields },
      targetQueue = fields[field].queues[queue],
      monsterColor = targetQueue[0];

    if (strikeColor === monsterColor) {
      const streak = 1 + this.state.streak;
      console.log("Matches the color!");
      this.setState({ streak });
      targetQueue.shift();
      this.updateScoreboard(1);
      this.updateCounter(1);

      this.setState({ fields });
      this.strike(field, queue, strikeColor);
    }
    // If there's a monster in the queue struck
    else if (targetQueue.length > 0) {
      // Report streak end via App.endStreak()
      if (this.state.streak > 0) {
        this.endStreak();
      }

      //   Update hero color
      this.changeColor(monsterColor);

      //   Update monster color
      targetQueue[0] = strikeColor;

      this.setState({ fields });
    }
  };

  endStreak = () => {
    this.setState({ streak: 0 });
    console.log("Streak is over!");
  };

  endStage = (playerDidWin) => {
    clearInterval(this.monsterTimer);
    clearInterval(this.waveTimer);

    if (playerDidWin) {
      // Congratulate user, show score, then call App.setStage with settings for next level
      alert(`🏁 Congratulations! You completed the stage 🏁`);
      let currentStage = this.state.currentStage + 1;
      this.setState({ currentStage });
      if (stages[currentStage]) {
        this.start(currentStage);
      } else {
        alert("You finished the game too! No more stages left! 🍾");
      }
    } else {
      alert("Sorry, because your base got invaded, you have lost the game");
    }
  };

  updateScoreboard = (monsterCount) => {
    let score = this.state.score,
      streak = this.state.streak,
      pointsToAdd = monsterCount * 100 * streak;

    score += pointsToAdd;

    // Scoreboard.update() manages streak tally? Need to figure out how to manage this
    console.log(
      `Eliminated ${monsterCount} monster! Streak is ${streak}, adding ${pointsToAdd}...`
    );
    this.setState({ score });
  };

  updateCounter = (monsterCount) => {
    let monstersRemaining = this.state.monstersRemaining;
    monstersRemaining -= monsterCount;
    if (monstersRemaining <= 0) {
      monstersRemaining = 0;
    }

    this.setState({ monstersRemaining }, () => {
      if (monstersRemaining === 0) {
        this.endStage(true);
      }
    });
  };

  changeColor = (newColor) => {
    console.log(`Changing color to ${newColor}`);
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

    hero.orientation = direction;

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
          <Scoreboard score={this.state.score} />
        </header>
        <main>
          <Field direction="up" queues={this.state.fields.up.queues} />
          <Field direction="left" queues={this.state.fields.left.queues} />
          <Field direction="right" queues={this.state.fields.right.queues} />
          <Field direction="down" queues={this.state.fields.down.queues} />
          <Homebase
            heroX={this.state.hero.x}
            heroY={this.state.hero.y}
            heroOrientation={this.state.hero.orientation}
            heroColor={this.state.hero.color}
          />
        </main>
        <footer>
          <Counter count={this.state.monstersRemaining} />
          <StartButton
            currentStage={this.state.currentStage}
            setStage={this.setStage}
            start={this.start}
          />
        </footer>
      </div>
    );
  }
}

export default App;
