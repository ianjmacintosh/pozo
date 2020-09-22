import React from "react";
import "./Alert.css";
import Scoreboard from "./Scoreboard";
import Field from "./Field";
import Homebase from "./Homebase";
import Counter from "./Counter";

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

class Board extends React.Component {
  state = {
    isGameActive: this.props.isGameActive,
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
  };

  componentDidUpdate(prevProps) {
    if (this.props.isGameActive !== prevProps.isGameActive) {
      console.log("Changing game activity state");
    }
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeypress);
  }

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

  playSound = (soundKey, startPoint = 0, volume = 1) => {
    const audio = document.querySelector(`[data-sound=${soundKey}]`);
    audio.currentTime = startPoint;
    audio.volume = volume;
    audio.play();
  };

  start = (stageNumber = 0) => {
    // Activate game
    this.setState({ gameActive: true, redAlert: false }, () => {
      if (stageNumber === 0) {
        this.playSound("menuSelect", 0, 0.2);
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
    this.showAlert(
      <React.Fragment>
        <h1>Stage {stageNumber}</h1>
      </React.Fragment>
    );
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

  render() {
    return (
      <div className="board">
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
    );
  }
}
export default Board;
