import React from "react";

import Alert from "./Alert";
import Board from "./Board";

import "./App.css";

// 246ms long
import menuMoveSound from "../sounds/menuMove.wav";
import menuSelectSound from "../sounds/menuSelect.wav";

class App extends React.Component {
  state = {
    alert: {
      content: "",
      shown: false,
      autodismiss: true,
      persistent: true,
    },
    alerts: {
      mainMenu: {
        content: <h1>Pozo</h1>,
        shown: true,
      },
      instructions: {
        content: (
          <React.Fragment>
            <h1 className="small-headline">Instructions</h1>
            <p>
              Pozo is an arcade puzzle game where your goal is to clear blocks
              before they enter your base
            </p>
            <p>To move, use the arrow keys (or A, S, D, F)</p>
            <p>To attack, use the spacebar</p>
            <p>
              If you strike a block the same color as you, you will clear it
            </p>
            <p>
              If it is a different color, you and the block will swap colors
            </p>
            <p>
              The number to the lower right of your base shows how many blocks
              are left in order to complete the stage
            </p>
          </React.Fragment>
        ),
        shown: false,
      },
      gameOver: {
        content: (
          <React.Fragment>
            <h1>Game Over</h1>
          </React.Fragment>
        ),
        shown: false,
      },
    },
    activeMenuName: "mainMenu",
    redAlert: false,
    gameActive: false,
    menus: {
      mainMenu: [
        {
          title: "Start Game",
          action: () => {
            let alerts = this.state.alerts;
            alerts.mainMenu.shown = false;

            this.setState({ gameActive: true });
          },
          selected: true,
        },
        {
          title: "Instructions",
          action: () => {
            let alerts = this.state.alerts;
            alerts.instructions.shown = true;
            this.setState({
              alerts,
              activeMenuName: "instructions",
            });
          },
          selected: false,
        },
        // {
        //   title: "Options",
        //   action: () => {
        //     console.log("Options");
        //   },
        //   selected: false,
        // },
        {
          title: "Credits",
          action: () => {
            this.showAlert(
              <React.Fragment>
                <h1 className="small-headline">Credits</h1>
                <dl>
                  <dt>Development</dt>
                  <dd>Ian MacIntosh</dd>
                  <dt>Sound Effects</dt>
                  <dd>
                    <a href="https://freesound.org/people/Breviceps/">
                      Breviceps
                    </a>{" "}
                    (soundeffects.org)
                  </dd>
                  <dd>
                    <a href="https://freesound.org/people/LittleRobotSoundFactory/">
                      LittleRobotSoundFactory
                    </a>{" "}
                    (soundeffects.org)
                  </dd>
                  <dd>
                    <a href="https://freesound.org/people/LukeSharples/">
                      LukeSharples
                    </a>{" "}
                    (soundeffects.org)
                  </dd>
                  <dd>
                    <a href="https://freesound.org/people/SgtPepperArc360/">
                      SgtPepperArc360
                    </a>{" "}
                    (soundeffects.org)
                  </dd>
                </dl>

                <p>
                  This game is derivative of the mid-1990's arcade puzzle game{" "}
                  <i>Zoop</i>, which was developed by Hookstone Media and
                  published by Viacom New Media.
                </p>
              </React.Fragment>,
              false
            );
          },
          selected: false,
        },
      ],
      instructions: [
        {
          title: "Continue",
          action: () => {
            let alerts = this.state.alerts;
            alerts.instructions.shown = false;
            this.setState({
              alerts,
              activeMenuName: "main",
            });
          },
          selected: true,
        },
      ],
      gameOver: [
        {
          title: "Try Again",
          action: () => {
            let alerts = this.state.alerts;
            alerts.gameOver.shown = false;

            this.setState({
              alerts,
              gameActive: true,
            });
          },
          selected: true,
        },
        {
          title: "Main Menu",
          action: () => {
            let alerts = this.state.alerts;
            alerts.gameOver.shown = false;
            this.setState({
              alerts,
              activeMenuName: "main",
            });
          },
          selected: false,
        },
      ],
    },
  };

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeypress);
  }

  changeGameActive = (newState) => {
    this.setState({ gameActive: newState });
  };

  changeMenuOption = (advance) => {
    const newMenusObject = this.state.menus;
    const activeMenu = newMenusObject[this.state.activeMenuName];
    this.playSound("menuMove", 0.05);

    // Get index of selected menu option
    let menuOption = activeMenu.findIndex((option) => option.selected === true);

    // Mark previous or next menu option as selected
    if (advance) {
      menuOption++;
    } else {
      menuOption--;
    }
    if (menuOption > activeMenu.length - 1) {
      menuOption = 0;
    } else if (menuOption < 0) {
      menuOption = activeMenu.length - 1;
    }

    // Update the menu object to show the new item is selected
    activeMenu.map((option, index) => (option.selected = menuOption === index));

    this.setState({ menus: newMenusObject });
  };

  chooseMenuOption = () => {
    this.state.menus[this.state.activeMenuName]
      .find((option) => option.selected === true)
      .action();
  };

  handleKeypress = ({ key }) => {
    // Each movement updates app state for hero x & y
    const keyMappings = {
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
      // If an alert is shown, hide it
      if (this.state.alert.shown && !this.state.alert.persistent) {
        this.dismissAlert();
        return;
      }

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
      }
    }
  };

  monsterTimer = null;
  waveTimer = null;

  showAlert = (content, autodismiss = true, persistent = false) => {
    const alert = {
      content,
      persistent,
      shown: true,
      autodismiss,
    };
    this.setState({ alert });
  };

  dismissAlert = (alertName) => {
    let alert = this.state.alert;
    if (alertName) {
      alert = this.state.alerts[alertName];
    }
    alert.shown = false;
    this.setState({ alert });
  };

  playSound = (soundKey, startPoint = 0, volume = 1) => {
    const audio = document.querySelector(`[data-sound=${soundKey}]`);
    audio.currentTime = startPoint;
    audio.volume = volume;
    audio.play();
  };

  render() {
    return (
      <div
        className={`App stage${this.state.currentStage} ${
          this.state.redAlert ? "red-alert" : ""
        }`}
      >
        <Alert
          name="main-menu"
          content={<h1>Pozo</h1>}
          menu={{
            name: "main-menu",
            options: this.state.menus.mainMenu,
          }}
          shown={this.state.alerts.mainMenu.shown}
        ></Alert>
        <Alert
          content={this.state.alert.content}
          shown={this.state.alert.shown}
          autodismiss={this.state.alert.autodismiss}
          dismissAlert={this.dismissAlert}
        ></Alert>
        <Alert
          name="game-over"
          content={this.state.alerts.gameOver.content}
          menu={{
            name: "game-over",
            options: this.state.menus.gameOver,
          }}
          shown={this.state.alerts.gameOver.shown}
          dismissAlert={this.dismissAlert}
        ></Alert>
        <Alert
          content={this.state.alerts.instructions.content}
          menu={{
            name: "instructions",
            options: this.state.menus.instructions,
          }}
          shown={this.state.alerts.instructions.shown}
          dismissAlert={this.dismissAlert}
        ></Alert>
        <audio data-sound="menuSelect" src={menuSelectSound}></audio>
        <audio data-sound="menuMove" src={menuMoveSound}></audio>
        <Alert
          content={this.state.alert.content}
          shown={this.state.alert.shown}
          autodismiss={this.state.alert.autodismiss}
          dismissAlert={this.dismissAlert}
        ></Alert>
        <Board
          changeGameActive={this.changeGameActive}
          isGameActive={this.state.gameActive}
          showAlert={this.showAlert}
        />
      </div>
    );
  }
}

export default App;
