import React from "react";
import "./Board.css";
import "./Alert.css";
import Scoreboard from "./Scoreboard";
import Field from "./Field";
import Homebase from "./Homebase";
import ControlPanel from "./ControlPanel";
import Counter from "./Counter";
import { getRandomInt } from "../helpers";
import { gsap } from "gsap";

import strikeSound from "../sounds/strike.wav";
import walkSound from "../sounds/walk.wav";
import eliminateSound from "../sounds/eliminate.wav";
import swapSound from "../sounds/swap.wav";
import gameOverSound from "../sounds/gameOver.wav";
import stageClearSound from "../sounds/stageClear.wav";
import menuSelectSound from "../sounds/menuSelect.wav";

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

const directionMap = {
  0: "up",
  1: "left",
  2: "right",
  3: "down",
};

class Board extends React.Component {
  state = {
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
    hero: {
      color: 0,
      x: 1,
      y: 1,
      orientation: "up",
    },
    base: {
      size: 4,
    },
    streak: 0,
    score: 0,
    monstersRemaining: 0,
    currentStage: 0,
    stageSettings: {
      monsters: 0,
      creationRate: 0,
      waveDuration: 0,
      rateMultiplier: 0,
    },
    paused: false,
  };

  componentDidUpdate(prevProps) {
    if (this.props.isGameActive !== prevProps.isGameActive) {
      if (this.props.isGameActive) {
        this.start();
      } else {
        clearInterval(this.monsterTimer);
        clearInterval(this.waveTimer);
      }
    }
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeypress);
  }

  changeColor = (newColor) => {
    const hero = { ...this.state.hero };
    hero.color = newColor;

    // Update app state for hero color
    this.setState({ hero });
  };

  reportElimination = (monstersEliminated) => {
    this.props.playSound("eliminate");
    this.updateScoreboard(monstersEliminated);
    this.updateCounter(monstersEliminated);
  };

  endStreak = () => {
    this.setState({ streak: 0 });
  }; // Pause will record how much time is left on the interval
  pause = () => {
    let paused = this.state.paused;

    if (paused) {
      this.props.showAlert(
        <React.Fragment>
          <h1>Go!</h1>
        </React.Fragment>
      );

      // Resume the timers
      this.monsterTimer = window.setInterval(
        this.chooseQueue,
        this.state.stageSettings.creationRate * 1000
      );

      this.waveTimer = window.setInterval(() => {
        let stageSettings = this.state.stageSettings;
        stageSettings.creationRate =
          stageSettings.creationRate / stageSettings.rateMultiplier;
        clearInterval(this.monsterTimer);

        this.monsterTimer = window.setInterval(
          this.chooseQueue,
          this.state.stageSettings.creationRate * 1000
        );
      }, this.state.stageSettings.waveDuration * 1000);
    } else {
      // Save the time remaining on monsterTimer
      this.props.showAlert(
        <React.Fragment>
          <h1>Paused</h1>
        </React.Fragment>
      );
      // Clear the timers
      clearInterval(this.monsterTimer);
      clearInterval(this.waveTimer);
    }

    paused = !paused;
    this.setState({ paused });
  };

  squareSize = () => {
    return parseInt(
      getComputedStyle(document.querySelector(".board")).getPropertyValue(
        "--square-size"
      ),
      10
    );
  };

  endStage = (playerDidWin) => {
    clearInterval(this.monsterTimer);
    clearInterval(this.waveTimer);
    this.setState({ redAlert: false });

    if (playerDidWin) {
      let currentStage = this.state.currentStage + 1;
      if (stages[currentStage]) {
        this.props.playSound("stageClear");
        this.setState({ currentStage });
        this.start(currentStage);
      } else {
        this.props.changeGameActive(false);
        this.props.showAlert("victory", false);
      }
    } else {
      this.props.changeGameActive(false);
      this.props.playSound("gameOver");
      this.props.showAlert("gameOver", false);
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

  handleKeypress = ({ key }) => {
    // Each movement updates app state for hero x & y
    const keyMappings = {
      Escape: "pause",

      w: "up",
      d: "right",
      s: "down",
      a: "left",
      " ": "strike",
      z: "strike",

      W: "up",
      D: "right",
      S: "down",
      A: "left",
      Z: "strike",

      ArrowUp: "up",
      ArrowRight: "right",
      ArrowDown: "down",
      ArrowLeft: "left",
      Enter: "strike",
    };

    if (key in keyMappings) {
      const command = keyMappings[key];
      // If it's a pause button, run the pause command
      if (command === "pause") {
        this.pause();
        return;
      }

      const isPaused = this.state.paused;
      if (isPaused) {
        return;
      }

      // Determine if user is controlling hero in game or navigating menu
      // If playing game:
      if (this.props.isGameActive) {
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
      this.setState({ redAlert: true });
    }

    // Create new Monster component within the appropriate queue (this should be handled automatically)
  };

  chooseQueue = () => {
    console.log("Choosing a queue");
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

  start = (stageNumber = 0) => {
    // Activate game
    this.setState({ gameActive: true, redAlert: false }, () => {
      if (stageNumber === 0) {
        this.props.playSound("menuSelect", 0, 0.2);
      }
    });

    // Clear all queues
    let fields = this.state.fields;
    fields.up.queues = [[], [], [], []];
    fields.down.queues = [[], [], [], []];
    fields.left.queues = [[], [], [], []];
    fields.right.queues = [[], [], [], []];
    this.setState({ fields });

    const stageSettings = { ...stages[stageNumber] },
      setTimers = () => {
        clearInterval(this.monsterTimer);
        clearInterval(this.waveTimer);

        this.monsterTimer = window.setInterval(
          this.chooseQueue,
          this.state.stageSettings.creationRate * 1000
        );

        this.waveTimer = window.setInterval(() => {
          let stageSettings = this.state.stageSettings;
          stageSettings.creationRate =
            stageSettings.creationRate / stageSettings.rateMultiplier;
          clearInterval(this.monsterTimer);

          this.monsterTimer = window.setInterval(
            this.chooseQueue,
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
    });
    this.props.updateAlert("stageAnnouncement", {
      content: <h1>{`Stage ${this.state.currentStage}`}</h1>,
    });
    this.props.showAlert("stageAnnouncement");
  };

  strike = (field, queue, strikeColor) => {
    if (!this.props.isGameActive) {
      console.log("Game is not active");
      return;
    }

    // Play sound
    this.props.playSound("strike", 0, 0.5);

    // Find out direction to strike (up, left, down, right)
    let x = 0,
      y = 0,
      squareSize = this.squareSize(),
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
      monsterColor,
      topMonster;

    if (monsterQueue.length > 0) {
      topMonster = targetQueue.find((item) => item.type === "monster");
      monsterColor = topMonster.color;
    } else {
      monsterColor = null;
    }

    // If monster is same color, eliminate it
    if (strikeColor === monsterColor) {
      // Update streak
      const streak = 1 + this.state.streak;
      this.setState({ streak });

      // Convert monster to ghost
      topMonster.content = 100 * streak;
      topMonster.type = "ghost";

      // Remove the ghost
      setTimeout(() => {
        const index = targetQueue.indexOf(topMonster);
        targetQueue.splice(index, 1);
      }, 2000);

      // Are all queues under control?
      const hasEnoughRoom = (queue, lengthLimit) => {
        const nonGhosts = queue.filter((element) => element.type !== "ghost");

        return lengthLimit - nonGhosts.length > 1;
      };

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
        this.setState({ redAlert: false });
      }
      this.reportElimination(1);
      this.setState({ fields });
      this.strike(field, queue, strikeColor);
      return;
    }
    // If there's a monster in the queue struck
    else if (monsterQueue.length > 0) {
      this.props.playSound("swap");
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

  // Walk accepts a direction, and calls move
  walk = (direction) => {
    this.props.playSound("walk", 0, 0.15);
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
    return (
      <div className="board">
        <header>
          <Scoreboard score={this.state.score} />
        </header>
        <main>
          <Field
            direction="up"
            queues={this.state.fields.up.queues}
            handleKeypress={() => {
              this.handleKeypress({ key: "ArrowUp" });
            }}
          />
          <Field
            direction="left"
            queues={this.state.fields.left.queues}
            handleKeypress={() => {
              this.handleKeypress({ key: "ArrowLeft" });
            }}
          />
          <Field
            direction="right"
            queues={this.state.fields.right.queues}
            handleKeypress={() => {
              this.handleKeypress({ key: "ArrowRight" });
            }}
          />
          <Field
            direction="down"
            queues={this.state.fields.down.queues}
            handleKeypress={() => {
              this.handleKeypress({ key: "ArrowDown" });
            }}
          />
          <Homebase
            heroX={this.state.hero.x}
            heroY={this.state.hero.y}
            heroOrientation={this.state.hero.orientation}
            heroColor={this.state.hero.color}
            handleKeypress={this.handleKeypress}
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
          <ControlPanel
            muted={this.props.muted}
            toggleMute={this.props.toggleMute}
          />
          <Counter count={this.state.monstersRemaining} />
        </footer>
      </div>
    );
  }
}
export default Board;
