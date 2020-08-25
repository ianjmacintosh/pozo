import React from "react";

import Alert from "./Alert";
import Menu from "./Menu";
import Scoreboard from "./Scoreboard";
import Field from "./Field";
import Homebase from "./Homebase";
import Counter from "./Counter";
import { getRandomInt } from "../helpers";
import { gsap } from "gsap";

import "./App.css";

// 246ms long
import strikeSound from "../sounds/strike.wav";
import menuMoveSound from "../sounds/menuMove.wav";
import menuSelectSound from "../sounds/menuSelect.wav";
import walkSound from "../sounds/walk.wav";
import eliminateSound from "../sounds/eliminate.wav";
import swapSound from "../sounds/swap.wav";
import gameOverSound from "../sounds/gameOver.wav";
import stageClearSound from "../sounds/stageClear.wav";

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
    monsters: 5,
    creationRate: 3,
    waveDuration: 10,
    rateMultiplier: 1.25,
  },
  {
    monsters: 10,
    creationRate: 2,
    waveDuration: 5,
    rateMultiplier: 1.1,
  },
  {
    monsters: 25,
    creationRate: 2,
    waveDuration: 10,
    rateMultiplier: 1.75,
  },
  {
    monsters: 50,
    creationRate: 2,
    waveDuration: 5,
    rateMultiplier: 1.1,
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
    this.playSound("menuMove", 0.05);

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
    this.setState({ gameActive: true }, () => {
      if (stageNumber === 0) {
        this.playSound("menuSelect");
      }
    });

    // Clear all queues
    let fields = this.state.fields;
    fields.up.queues = [[], [], [], []];
    fields.down.queues = [[], [], [], []];
    fields.left.queues = [[], [], [], []];
    fields.right.queues = [[], [], [], []];
    this.setState({ fields });

    const chooseQueue = () => {
      let fieldNumber = getRandomInt(0, 3),
        queueNumber = getRandomInt(0, 3),
        colorNumber = getRandomInt(0, 3);

      // If queue length is 2 monsters more than any other in field:
      // Get length of this queue
      let field = this.state.fields[directionMap[fieldNumber]];

      let fieldWouldBeUnbalanced = (allQueues, targetQueue) =>
        field.queues.some(
          (thisQueue) => allQueues[targetQueue].length - thisQueue.length > 1
        );

      // Get length of shortest queue
      while (fieldWouldBeUnbalanced(field.queues, queueNumber)) {
        queueNumber = getRandomInt(0, 3);
      }
      // If longest queue - shortest queue is > 2, choose a different queue
      // queueNumber = getRandomInt(0, 3);
      this.addMonster(directionMap[fieldNumber], queueNumber, colorNumber);
    };

    const stageSettings = stages[stageNumber],
      setTimers = () => {
        clearInterval(this.monsterTimer);
        clearInterval(this.waveTimer);

        this.monsterTimer = window.setInterval(
          chooseQueue,
          this.state.stageSettings.creationRate * 1000
        );

        this.waveTimer = window.setInterval(() => {
          let stageSettings = this.state.stageSettings;
          stageSettings.creationRate =
            stageSettings.creationRate / stageSettings.rateMultiplier;
          clearInterval(this.monsterTimer);

          this.monsterTimer = window.setInterval(
            chooseQueue,
            this.state.stageSettings.creationRate * 1000
          );
        }, this.state.stageSettings.waveDuration * 1000);
      };

    // Apply stage color scheme
    document.body.classList.remove(`stage${stageNumber - 1}`);
    document.body.classList.add(`stage${stageNumber}`);

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
    fields[direction].queues[queueNumber].push({
      type: "monster",
      color: colorNumber,
    });

    // Update the state
    this.setState({ fields });

    // Determine if we're over the max queue length and if so, end the stage
    if (
      fields[direction].queues[queueNumber].length >
      fields[direction].queueLengthLimit
    ) {
      this.endStage();
    }

    // If there's 1 square or fewer between the home base and the monster, go red alert
    if (
      fields[direction].queueLengthLimit -
        fields[direction].queues[queueNumber].length <=
      1
    ) {
      document.body.classList.add("red-alert");
    }

    // Create new Monster component within the appropriate queue (this should be handled automatically)
  };

  reportElimination = (monstersEliminated) => {
    this.playSound("eliminate");
    this.updateScoreboard(monstersEliminated);
    this.updateCounter(monstersEliminated);
  };

  strike = (field, queue, strikeColor) => {
    // Play sound
    this.playSound("strike", 0, 0.5);

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
      monsterQueue = targetQueue.filter((item) => item.type === "monster"),
      monsterColor;

    if (monsterQueue.length > 0) {
      monsterColor = monsterQueue[0].color;
      console.dir(monsterQueue[0]);
    } else {
      monsterColor = null;
    }

    // If monster is same color, eliminate it
    if (strikeColor === monsterColor) {
      console.log("Eliminating monster");
      // Update streak
      const streak = 1 + this.state.streak;
      this.setState({ streak });

      // Was that queue putting us in red alert?
      const oldBreathingRoom =
        fields[field].queueLengthLimit - monsterQueue.length;

      // Here we deftly remove the last element:
      targetQueue.shift();

      // Add a ghost element
      targetQueue.push({ type: "ghost", content: "FOO" });

      const newBreathingRoom =
        fields[field].queueLengthLimit - monsterQueue.length;

      if (oldBreathingRoom < 2 && newBreathingRoom > 1) {
        const hasEnoughRoom = (queue, lengthLimit) => {
          return lengthLimit - queue.length > 1;
        };

        // Are all queues under control?
        if (
          fields.down.queues.every((queue) =>
            hasEnoughRoom(queue, fields.down.queueLengthLimit)
          ) &&
          fields.up.queues.every((queue) =>
            hasEnoughRoom(queue, fields.up.queueLengthLimit)
          ) &&
          fields.left.queues.every((queue) =>
            hasEnoughRoom(queue, fields.left.queueLengthLimit)
          ) &&
          fields.right.queues.every((queue) =>
            hasEnoughRoom(queue, fields.right.queueLengthLimit)
          )
        ) {
          document.body.classList.remove("red-alert");
        }
      }
      this.reportElimination(1);
      this.setState({ fields });
      this.strike(field, queue, strikeColor);
      return;
    }
    // If there's a monster in the queue struck
    else if (monsterQueue.length > 0) {
      this.playSound("swap");
      // Report streak end via App.endStreak()
      if (this.state.streak > 0) {
        this.endStreak();
      }

      //   Update hero color
      this.changeColor(monsterColor);

      //   Update monster color
      monsterQueue[0].color = strikeColor;

      this.setState({ fields });
    }

    // Flip orientation
    let hero = this.state.hero;
    let newDirection;

    switch (hero.orientation) {
      case "up":
        newDirection = "down";
        break;
      case "down":
        newDirection = "up";
        break;
      case "left":
        newDirection = "right";
        break;
      default:
        newDirection = "left";
        break;
    }

    hero.orientation = newDirection;
    this.setState({ hero });
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
        this.playSound("stageClear");
        this.start(currentStage);
      } else {
        this.setState({ alertText: "Victory" });
      }
    } else {
      this.playSound("gameOver");
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
    console.log(newColor);
    const hero = { ...this.state.hero };
    hero.color = newColor;

    // Update app state for hero color
    this.setState({ hero });
  };

  // Walk accepts a direction, and calls move
  walk = (direction) => {
    this.playSound("walk", 0, 0.15);
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

  playSound = (soundKey, startPoint = 0, volume = 1) => {
    const audio = document.querySelector(`[data-sound=${soundKey}]`);
    audio.currentTime = startPoint;
    audio.volume = volume;
    audio.play();
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
              <audio data-sound="eliminate" src={eliminateSound}></audio>
              <audio data-sound="menuSelect" src={menuSelectSound}></audio>
              <audio data-sound="strike" src={strikeSound}></audio>
              <audio data-sound="walk" src={walkSound}></audio>
              <audio data-sound="swap" src={swapSound}></audio>
              <audio data-sound="gameOver" src={gameOverSound}></audio>
              <audio data-sound="stageClear" src={stageClearSound}></audio>
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
          <audio data-sound="menuSelect" src={menuSelectSound}></audio>
          <audio data-sound="menuMove" src={menuMoveSound}></audio>
          <Menu options={this.state.menuOptions} />
        </div>
      );
    }
  }
}

export default App;
