// Purpose of this component:
// Define the DOM hierarchy all components associated with the "game board"

import React from "react";
import "./Board.css";
import "./Alert.css";

// Scoreboard shows the current score
import Scoreboard from "./Scoreboard";

// Fields store queues, which may contain monsters
import Field from "./Field";

// Homebase stores the hero
import Homebase from "./Homebase";

// Hero represents the player's status (position, orientation, color)
import Hero from "./Hero";

// Control Panel allows players to change settings
import ControlPanel from "./ControlPanel";

// Counter shows how many monsters remain on this stage
import Counter from "./Counter";

// Get random int provides a random number generator
import { getRandomInt } from "../helpers";

// All these sounds are used by audio elements
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
        queueLengthLimit: this.props.shortQueueSize,
        queues: [[], [], [], []],
      },
      left: {
        // Left and right queues will end the game when their length > 8
        queueLengthLimit: this.props.longQueueSize,
        queues: [[], [], [], []],
      },
      right: {
        queueLengthLimit: this.props.longQueueSize,
        queues: [[], [], [], []],
      },
      down: {
        queueLengthLimit: this.props.shortQueueSize,
        queues: [[], [], [], []],
      },
    },
    base: {
      size: 4,
    },
    // I don't know where I should store these properties:
    streak: 0,
    heroColor: 0,
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

  // Counter needs this
  // This method updates the counter when a monster is eliminated
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

  // Scoreboard needs this
  // This method defines behavior when eliminating a monster
  reportElimination = (monstersEliminated) => {
    this.props.playSound("eliminate");
    this.updateScoreboard(monstersEliminated);
    this.updateCounter(monstersEliminated);
  };

  // Scoreboard needs this
  // This method reports eliminations to the scoreboard
  updateScoreboard = (monsterCount) => {
    let score = this.state.score,
      streak = this.state.streak,
      pointsToAdd = monsterCount * 100 * streak;

    score += pointsToAdd;

    // Scoreboard.update() manages streak tally? Need to figure out how to manage this
    this.setState({ score });
  };

  // Scoreboard needs this (probably)
  // This method updates the streak property
  endStreak = () => {
    this.setState({ streak: 0 });
  };

  // Multiple components need this; Hero and Field
  // This method prevents hero from moving and monsters from generating
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

  // Field needs this
  // This method adds a monster to a field's queue
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

  // Field needs this
  // This method chooses the queue to add a monster to
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

  // Hero needs this
  // This method applies the strike method to the queue requested
  handleStrikeCall = (field, queue, color) => {
    // 🙅🏻‍♂️ TODO
    // Since setState doesn't support nested objects, updating a monster in a queue in a field requires
    //   making a copy of the fields, then updating the object. This is extremely bad for performance!

    // Make a copy of the fields
    const newFields = {...this.state.fields};

    // Update the relevant queue on that field
    newFields[field].queues[queue] = this.strike(this.state.fields[field].queues[queue], color);

    // Update the state
    this.setState({
      fields: newFields
    });
  }

  changeHeroColor = (color) => {
    this.setState({
      heroColor: color
    })
  }

  // Board needs this
  // This method returns a queue after a strike
  strike = (contents, strikeColor) => {
    // Make a safe copy of contents
    // See https://www.freecodecamp.org/news/handling-state-in-react-four-immutable-approaches-to-consider-d1f5c00249d5/
    let newContents = [...contents],
      // Get a list of _just_ the monsters
      monsterQueue = newContents.filter((item) => item.type === "monster");

    // Process the queue, removing items of the same color until hitting a different-colored item
    for (const monster of monsterQueue) {
      // If monster is same color as the strike, eliminate it
      if (monster.color === strikeColor) {
        // Remove the monster from the contents
        newContents.splice(newContents.indexOf(monster), 1);

        // Update the counter
        this.updateCounter(1);
      }

      // If the monster is not the same color as the strike, swap colors
      else {
        // Make a new monster from the old monster
        let newMonster = {...newContents[newContents.indexOf(monster)]};

        // Update the hero color to the old monster's color
        this.changeHeroColor(monster.color);

        // Change the new monster's color
        newMonster.color = strikeColor;

        // Update the new contents array with the new monster
        newContents[newContents.indexOf(monster)] = newMonster;

        // Stop processing the queue
        break;
      }
    }

    return newContents;
  }

  // Multiple components need this; Field and Alert
  // This method updates the board
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

  // Board needs this
  // This method handles input from the user to pause the game
  handleKeypress = ({ key }) => {
    const keyMappings = {
      Escape: "pause"
    };

    if (key in keyMappings) {
      const command = keyMappings[key];

      // If it's a pause button, run the pause command
      if (command === "pause") {
        this.pause();
        return;
      }
    }
  };

  // Multiple components need this; Field, Scoreboard, Counter, and Hero
  // This method sets the board
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
            handleKeypress={this.handleKeypress}
          >
            <Hero
              color={this.state.heroColor}
              canMove={this.props.isGameActive}
              playSound={this.props.playSound}
              longQueueSize={this.props.longQueueSize}
              shortQueueSize={this.props.shortQueueSize}
              handleStrikeCall={this.handleStrikeCall}
            />
          </Homebase>
          <audio data-sound="eliminate" src={eliminateSound}></audio>
          <audio data-sound="menuSelect" src={menuSelectSound}></audio>
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
