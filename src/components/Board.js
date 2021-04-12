// Purpose of this component:
// Define the DOM hierarchy all components associated with the "game board"

import React from "react";
import "./Board.css";
import "./Alert.css";

import Scoreboard from "./Scoreboard"; // Shows the current score
import Field from "./Field"; // Fields store queues, which may contain monsters
import Homebase from "./Homebase"; // The area the hero protects
import Hero from "./Hero"; // Shows the player's position, orientation, and color
import ControlPanel from "./ControlPanel"; // Allows players to change settings
import Counter from "./Counter"; // Shows how many monsters remain on this stage
import AudioPlayer from "./AudioPlayer"; // Handles playing sounds
import { changeMusic } from "./AudioPlayer"; // Handles playing music
import { getRandomInt, isMonster } from "../helpers"; // RNG and filter helper function

/*

          handleSound={this.handleSound}
          changeMusic={this.changeMusic}
          changeGameActive={this.changeGameActive}
          showAlert={this.showAlert}
          updateAlert={this.updateAlert}
          setStage={this.setStage}
          toggleMute={this.toggleMute}
          toggleSfxMute={this.toggleSfxMute}
          toggleMusicMute={this.toggleMusicMute}
          isGameActive={this.state.gameActive}
          muted={this.state.muted}
          sfxMuted={this.state.sfxMuted}
          musicMuted={this.state.musicMuted}
          stage={this.state.stage}
          longQueueSize={8}
          shortQueueSize={5}
*/

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
    stageSettings: {
      monsters: 0,
      creationRate: 0,
      waveDuration: 0,
      rateMultiplier: 0,
    },
    paused: false,
    squareSize: "40px",
    sfxMuted: true,
    musicMuted: true,
  };

  componentDidUpdate(prevProps) {
    if (this.props.isGameActive !== prevProps.isGameActive) {
      if (this.props.isGameActive) {
        let squareSize = parseInt(
          getComputedStyle(document.querySelector(".board")).getPropertyValue(
            "--square-size"
          ),
          10
        );
        this.setState({ squareSize });
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
    this.props.handleSound("eliminate", 0, 1, 50);
    this.updateScoreboard(monstersEliminated);
    this.updateCounter(monstersEliminated);
  };

  // Scoreboard needs this
  // This method reports eliminations to the scoreboard
  updateScoreboard = (monstersEliminated) => {
    // Update score appropriately
    let score = this.state.score;

    for (
      let i = 0, streak = this.state.streak;
      i < monstersEliminated;
      i += 1
    ) {
      score += 100 * (i + streak);
    }

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
    //   making a copy of all fields, then updating the object. This is extremely bad for performance!

    // Make a copy of the fields
    let newFields = { ...this.state.fields },
      targetQueue = newFields[field].queues[queue],
      newQueue = this.getStrikeResults(targetQueue, color);

    // Record how many monsters were eliminated
    const monstersEliminated =
      targetQueue.filter(isMonster).length - newQueue.filter(isMonster).length;

    // Update the streak if monsters were eliminated
    if (monstersEliminated) {
      let streak = this.state.streak;
      streak++;

      // Update new queue copy with correct ghost scores
      newQueue = newQueue.map((item, index) => {
        if (item.type === "ghost") {
          item.content = 100 * (index + streak);
        }

        return item;
      });

      this.setState({ streak });
    }
    // Clear the streak if no monsters were eliminated
    else if (targetQueue.filter(isMonster).length !== 0) {
      this.props.handleSound("swap", 0, 1, 0);
      this.setState({ streak: 0 });
    }

    // Update new fields copy with new queue copy
    newFields[field].queues[queue] = newQueue;

    // If the queue has a monster left in it, update hero color
    if (newQueue.some(isMonster)) {
      // Get the color of the first monster in the queue
      const firstMonsterColor = targetQueue
        .filter(isMonster) // Only look for monsters
        .find((item) => item.color !== color).color;

      // Update the hero color
      this.changeHeroColor(firstMonsterColor);
    }

    // Do everything associated with clearing monsters
    if (monstersEliminated > 0) {
      this.reportElimination(monstersEliminated);
    }

    // Set a timer to remove the ghosts
    setTimeout(() => {
      let fieldCopy = this.state.fields;
      let queueCopy = fieldCopy[field].queues[queue];
      fieldCopy[field].queues[queue] = this.getWithoutGhosts(queueCopy);
    }, 750);

    // Update the queue (by updating every single field 🤢)
    this.setState({
      fields: newFields,
    });
  };

  getWithoutGhosts = (queue) => {
    return queue.filter((item) => {
      return item.type !== "ghost";
    });
  };

  changeHeroColor = (color) => {
    this.setState({
      heroColor: color,
    });
  };

  // Board needs this
  // This method returns a queue after a strike
  getStrikeResults = (contents, strikeColor) => {
    // Make a safe copy of contents
    // See https://www.freecodecamp.org/news/handling-state-in-react-four-immutable-approaches-to-consider-d1f5c00249d5/
    let newContents = [...contents],
      // Get a list of _just_ the monsters
      monsterQueue = [...newContents].filter(isMonster);

    // Process the queue, removing items of the same color until hitting a different-colored item
    for (const monster of monsterQueue) {
      // If monster is same color as the strike, replace it with a ghost
      if (monster.color === strikeColor) {
        let newGhost = {
          type: "ghost",
        };

        // Turn monster into a ghost
        newContents[newContents.indexOf(monster)] = newGhost;
      }

      // If the monster is not the same color as the strike, swap colors
      else {
        // Make a new-colored monster from the old monster
        let newMonster = {
          ...newContents[newContents.indexOf(monster)],
          color: strikeColor,
        };

        // Replace the old monster with the new monster in the new queue
        newContents[newContents.indexOf(monster)] = newMonster;

        // Stop processing the queue
        break;
      }
    }

    return newContents;
  };

  // Multiple components need this; Field and Alert
  // This method updates the board
  endStage = (playerDidWin) => {
    clearInterval(this.monsterTimer);
    clearInterval(this.waveTimer);
    this.setState({ redAlert: false });

    if (playerDidWin) {
      let currentStage = this.props.stage + 1;
      if (stages[currentStage - 1]) {
        this.props.handleSound("stageClear");
        this.props.setStage(currentStage);
        this.start(currentStage);
      } else {
        this.props.changeGameActive(false);
        this.props.handleSound("victory");
        this.props.showAlert("victory", false);
      }
    } else {
      this.props.setStage(1);
      this.props.changeGameActive(false);
      this.props.handleSound("gameOver");
      this.props.showAlert("gameOver", false);
    }
  };

  // Board needs this
  // This method handles input from the user to pause the game
  handleKeypress = ({ key }) => {
    const keyMappings = {
      Escape: "pause",
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
  start = (stageNumber = 1) => {
    // Activate game
    this.setState({ gameActive: true, redAlert: false }, () => {
      if (stageNumber === 1) {
        this.setState({ score: 0 });
        if (this.props.musicMuted === false) {
          changeMusic("music");
        }
        this.props.handleSound("menuSelect", 0, 0.2);
      }
    });

    this.props.setStage(stageNumber);

    // Clear all queues
    let fields = this.state.fields;
    fields.up.queues = [[], [], [], []];
    fields.down.queues = [[], [], [], []];
    fields.left.queues = [[], [], [], []];
    fields.right.queues = [[], [], [], []];
    this.setState({ fields });

    const stageSettings = { ...stages[stageNumber - 1] },
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

    // Number of monsters in stage (e.g., 50)
    this.setState({ stageSettings }, setTimers);
    this.setState({
      monstersRemaining: stageSettings.monsters,
    });
    this.props.updateAlert("stageAnnouncement", {
      content: <h1>{`Stage ${stageNumber}`}</h1>,
    });
    this.props.showAlert("stageAnnouncement");
  };

  render() {
    if (!this.props.isGameActive) {
      return null;
    } else {
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
            <Homebase handleKeypress={this.handleKeypress}>
              <Hero
                squareSize={this.state.squareSize}
                showAlert={this.props.showAlert}
                color={this.state.heroColor}
                canMove={this.props.isGameActive}
                handleSound={this.props.handleSound}
                longQueueSize={this.props.longQueueSize}
                shortQueueSize={this.props.shortQueueSize}
                handleStrikeCall={this.handleStrikeCall}
              />
            </Homebase>
          </main>
          <footer>
            <ControlPanel
              muted={this.props.muted}
              sfxMuted={this.props.sfxMuted}
              musicMuted={this.props.musicMuted}
              toggleMute={this.props.toggleMute}
              toggleSfxMute={this.props.toggleSfxMute}
              toggleMusicMute={this.props.toggleMusicMute}
            />
            <Counter count={this.state.monstersRemaining} />
          </footer>
          <nav className="self-promo" role="navigation">
            Made by{" "}
            <a
              href="https://www.ianjmacintosh.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ian J. MacIntosh
            </a>
          </nav>
          <AudioPlayer sfxMuted={this.state.sfxMuted}></AudioPlayer>
        </div>
      );
    }
  }
}
export default Board;
