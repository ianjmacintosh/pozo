import React from "react";

import Alert from "./Alert";
import Menu from "./Menu";
import Scoreboard from "./Scoreboard";
import Field from "./Field";
import Homebase from "./Homebase";
import Counter from "./Counter";
import { getRandomInt } from "../helpers";
import { gsap } from "gsap";

import "../css/App.css";

// const colorMap = {
//   0: "cyan",
//   1: "magenta",
//   2: "yellow",
//   3: "black",
// };

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
    colorScheme: {
      backgroundColor: "#112131",
    },
  },
  {
    monsters: 50,
    creationRate: 2,
    waveDuration: 20,
    rateMultiplier: 1.5,
    colorScheme: {
      backgroundColor: "#41EAD4",
    },
  },
  {
    monsters: 50,
    creationRate: 2,
    waveDuration: 10,
    rateMultiplier: 1.75,
    colorScheme: {
      backgroundColor: "#FF206E",
    },
  },
  {
    monsters: 50,
    creationRate: 3,
    waveDuration: 5,
    rateMultiplier: 1.1,
    colorScheme: {
      backgroundColor: "#9D4EDD",
    },
  },
];

class App extends React.Component {
  state = {
    alertText: "",
    gameActive: false,
    menuOption: 0,
    currentStage: 0,
    stageSettings: {
      monsters: 0,
      creationRate: 0,
      waveDuration: 0,
      rateMultiplier: 0,
    },
    menuOptions: [
      {
        title: "Start Game",
        action: () => {
          this.start();
        },
        selected: true,
      },
      {
        title: "Instructions",
        action: () => {
          console.log("Instructions");
        },
        selected: false,
      },
      {
        title: "Options",
        action: () => {
          console.log("Options");
        },
        selected: false,
      },
      {
        title: "Credits",
        action: () => {
          console.log("Credits");
        },
        selected: false,
      },
    ],
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

  changeMenuOption = (advance) => {
    let menuOption = this.state.menuOption;
    if (advance) {
      menuOption++;
    } else {
      menuOption--;
    }
    if (menuOption > this.state.menuOptions.length - 1) {
      menuOption = 0;
    } else if (menuOption < 0) {
      menuOption = this.state.menuOptions.length - 1;
    }
    let newMenuOptions = this.state.menuOptions;
    newMenuOptions.map(
      (option, index) => (option.selected = menuOption === index)
    );
    this.setState({ menuOptions: newMenuOptions, menuOption });
  };

  chooseMenuOption = () => {
    this.state.menuOptions[this.state.menuOption].action();
  };

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
      Enter: "strike",
    };

    if (key in keyMappings) {
      const command = keyMappings[key];
      // Determine if user is controlling hero in game or navigating menu
      // If navigating menu:
      if (!this.state.gameActive) {
        switch (command) {
          default:
            // If movement, update menu position
            this.changeMenuOption(command === "down" || command === "right");
            break;
          case "strike":
            // If strike, determine menu position and execute associated routine
            this.chooseMenuOption();
            break;
        }
      } else {
        // If playing game:
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
    }
  };

  monsterTimer = null;
  waveTimer = null;

  start = (stageNumber = 0) => {
    // Activate game
    this.setState({ gameActive: true });

    // Clear all queues
    let fields = this.state.fields;
    fields.up.queues = [[], [], [], []];
    fields.down.queues = [[], [], [], []];
    fields.left.queues = [[], [], [], []];
    fields.right.queues = [[], [], [], []];
    this.setState({ fields });

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

    // Change background color
    document.body.style.backgroundColor =
      stageSettings.colorScheme.backgroundColor;

    // Number of monsters in stage (e.g., 50)
    this.setState({ stageSettings }, setTimers);
    this.setState({
      monstersRemaining: stageSettings.monsters,
      alertText: `Stage ${stageNumber}`,
    });
    console.log(`Stage ${stageNumber}`);
  };

  // Update state to add monster of randomColor to randomQueue of randomField
  addMonster = (direction = "up", queueNumber = 0, colorNumber = 0) => {
    // Update the state for the given queue to add a monster to it
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

  reportElimination = (monstersEliminated) => {
    this.updateScoreboard(monstersEliminated);
    this.updateCounter(monstersEliminated);
  };

  strike = (field, queue, strikeColor) => {
    // Find out direction to strike (up, left, down, right)
    let x = 0,
      y = 0,
      squareSize = 40,
      sizeOfQueue = this.state.fields[field].queueLengthLimit * squareSize,
      heroToEdge = 0,
      distanceToTravel = 0;

    // Calculate distance from current location to end of target queue
    // Calculate distance from hero to edge of base
    switch (field) {
      case "up":
        // 1 should go just the distance of the queue
        heroToEdge = (this.state.hero.y - 1) * squareSize;
        break;

      case "down":
        heroToEdge = (4 - this.state.hero.y) * squareSize;
        break;

      case "left":
        heroToEdge = (this.state.hero.x - 1) * squareSize;
        break;

      case "right":
        heroToEdge = (4 - this.state.hero.x) * squareSize;
        break;

      default:
        heroToEdge = 0;
    }

    distanceToTravel = heroToEdge + sizeOfQueue;

    if (field === "up" || field === "left") {
      distanceToTravel *= -1;
    }
    if (field === "up" || field === "down") {
      y = distanceToTravel;
    } else {
      x = distanceToTravel;
    }
    // Animate that transition
    let tl = gsap.timeline();
    tl.to(".hero", {
      duration: 0.1,
      x,
      y,
    });
    tl.to(".hero", {
      duration: 0.1,
      x: 0,
      y: 0,
    });
    // Handler reads hero coords and direction to determine which queue to strike
    let fields = { ...this.state.fields },
      targetQueue = fields[field].queues[queue],
      monsterColor = targetQueue[0];

    if (strikeColor === monsterColor) {
      const streak = 1 + this.state.streak;
      this.setState({ streak });
      targetQueue.shift();

      this.reportElimination(1);
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
  };

  endStage = (playerDidWin) => {
    clearInterval(this.monsterTimer);
    clearInterval(this.waveTimer);

    if (playerDidWin) {
      // Congratulate user, show score, then call App.setStage with settings for next level
      this.setState({ alertText: "Stage Complete" });
      let currentStage = this.state.currentStage + 1;
      this.setState({ currentStage });
      if (stages[currentStage]) {
        this.start(currentStage);
      } else {
        this.setState({ alertText: "Victory" });
      }
    } else {
      this.setState({ alertText: "Game Over" });
    }
  };

  updateScoreboard = (monsterCount) => {
    let score = this.state.score,
      streak = this.state.streak,
      pointsToAdd = monsterCount * 100 * streak;

    score += pointsToAdd;

    // Scoreboard.update() manages streak tally? Need to figure out how to manage this
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
  };

  render() {
    if (this.state.gameActive) {
      return (
        <div className="App">
          <Alert text={this.state.alertText} animated={false}></Alert>
          <div className="board">
            <header>
              <Scoreboard score={this.state.score} />
            </header>
            <main>
              <Field direction="up" queues={this.state.fields.up.queues} />
              <Field direction="left" queues={this.state.fields.left.queues} />
              <Field
                direction="right"
                queues={this.state.fields.right.queues}
              />
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
            </footer>
          </div>
        </div>
      );
    } else {
      return (
        <div className="App main-menu">
          <Menu options={this.state.menuOptions} />
        </div>
      );
    }
  }
}

export default App;
