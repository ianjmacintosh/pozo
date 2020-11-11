import React from "react";

import Alert from "./Alert";
import Board from "./Board";

import "./App.css";

class App extends React.Component {
  state = {
    muted: true,
    sfxMuted: true,
    musicMuted: true,
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
      stageAnnouncement: {
        content: "Stage 1",
        shown: false,
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
      credits: {
        content: (
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
                    This game is derivative of the mid-1990's arcade puzzle
                    game <i>Zoop</i>, which was developed by Hookstone Media
                    and published by Viacom New Media.
                  </p>
                </React.Fragment>
        ),
        shown: false,

      },
      victory: {
        content: <h1>Victory</h1>,
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
    stage: 0,
    activeMenuName: "mainMenu",
    redAlert: false,
    gameActive: false,
  };

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeypress);
  }

  changeMusic = (songKey, stopMusic = false) => {
    const audio = document.querySelector(`[data-sound=${songKey}]`);

    if (stopMusic) {
      audio.pause();
      return;
    }

    audio.currentTime = 0;
    audio.volume = 0.6;
    audio.play();
  };

  playSound = (soundKey, startPoint = 0, volume = 1) => {
    if (this.state.sfxMuted) {
      return;
    }
    const audio = document.querySelector(`[data-sound=${soundKey}]`);
    if (!audio) { return; }
    audio.currentTime = startPoint;
    audio.volume = volume;
    audio.play();
  };

  changeGameActive = (newState) => {
    console.log(`Game active: ${newState}`);
    this.setState({ gameActive: newState });
  };

  setStage = (newStage) => {
    this.setState({ stage: newStage });
  }

  monsterTimer = null;
  waveTimer = null;

  updateAlert = (alertName, newAlertObject) => {
    let alerts = this.state.alerts;
    alerts[alertName] = { ...alerts[alertName], ...newAlertObject };

    this.setState({ alerts });
  };

  toggleMute = () => {
    console.log(
      `Turning mute from ${this.state.muted} to ${!this.state.muted}`
    );
    let muted = !this.state.muted;
    this.setState({
      muted,
    });
  };

  toggleSfxMute = () => {
    console.log(
      `Turning mute from ${this.state.sfxMuted} to ${!this.state.sfxMuted}`
    );
    let sfxMuted = !this.state.sfxMuted;
    this.setState({
      sfxMuted,
    });
  };

  toggleMusicMute = () => {
    console.log(
      `Turning mute from ${this.state.musicMuted} to ${!this.state.musicMuted}`
    );
    let musicMuted = !this.state.musicMuted;

    this.setState({
      musicMuted,
    });

    if (musicMuted) {
      // Turn the music off
      this.changeMusic("music", true);
    } else {
      // Start the music!
      this.changeMusic("music");
    }
  };

  showAlert = (content, autodismiss = true, persistent = false) => {
    let alerts = this.state.alerts;
    let alert = this.state.alert;

    if (this.state.alerts[content]) {
      if (content === "gameOver") {
        this.setState({ activeMenuName: "gameOver" });
      }
      if (content === "victory") {
        this.setState({ activeMenuName: "victory" });
      }
      alerts[content].shown = true;
    } else {
      alert = {
        content,
        persistent,
        shown: true,
        autodismiss,
      };
    }
    this.setState({ alerts, alert });
  };

  dismissAlert = (alertName) => {
    let alert = this.state.alert;
    if (alertName) {
      alert = this.state.alerts[alertName];
    }
    alert.shown = false;
    this.setState({ alert });
  };

  render() {
    return (
      <div
        className={`App ${this.state.gameActive ? "stage" + this.state.stage : "" } ${
          this.state.redAlert ? "red-alert" : ""
        }`}
      >

        {/* "Stage 1" Announcement */}
        <Alert
          playSound={this.playSound}
          content={this.state.alerts.stageAnnouncement.content}
          shown={this.state.alerts.stageAnnouncement.shown}
          name="stageAnnouncement"
          autodismiss={true}
          dismissAlert={this.dismissAlert}
        ></Alert>

        {/* "Victory" Announcement */}
        <Alert
          playSound={this.playSound}
          content={this.state.alerts.victory.content}
          shown={this.state.alerts.victory.shown}
          menu={{
            name: "victory",
            options: [
              {
                title: "Play Again",
                action: () => {
                  let alerts = this.state.alerts;
                  alerts.victory.shown = false;

                  this.setState({
                    alerts,
                    activeMenuName: "board",
                    gameActive: true,
                  });
                },
                selected: true,
              },
              {
                title: "Main Menu",
                action: () => {
                  let alerts = this.state.alerts;
                  alerts.victory.shown = false;
                  alerts.mainMenu.shown = true;
                  this.setState({
                    alerts,
                    activeMenuName: "mainMenu",
                  });
                },
                selected: false,
              },
            ],
            hasFocus: this.state.activeMenuName === "victory",
          }}
          name="victory"
          dismissAlert={this.dismissAlert}
        ></Alert>

        {/* "Game Over" Announcement */}
        <Alert
          playSound={this.playSound}
          name="game-over"
          content={this.state.alerts.gameOver.content}
          menu={{
            name: "game-over",
            options: [
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
                  alerts.mainMenu.shown = true;
                  this.setState({
                    alerts,
                    activeMenuName: "mainMenu",
                  });
                },
                selected: false,
              },
            ],
            hasFocus: this.state.activeMenuName === "gameOver",
          }}
          shown={this.state.alerts.gameOver.shown}
          dismissAlert={this.dismissAlert}
        ></Alert>

        {/* "Main Menu" Announcement */}
        <Alert
          playSound={this.playSound}
          name="main-menu"
          content={<h1>Pozo</h1>}
          menu={{
            name: "main-menu",
            options: [
              {
                title: "Start Game",
                action: () => {
                  let alerts = this.state.alerts;
                  alerts.mainMenu.shown = false;
                  console.log("You clicked on 'Start Game!'");
                  this.setState({ activeMenuName: "game", gameActive: true });
                },
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
                  let alerts = this.state.alerts;
                  alerts.credits.shown = true;
                  this.setState({
                    alerts,
                    activeMenuName: "credits",
                  });
                },
              },
            ],
            hasFocus: this.state.activeMenuName === "mainMenu",
          }}
          shown={this.state.alerts.mainMenu.shown}
        ></Alert>

        {/* "Instructions" Announcement */}
        <Alert
          playSound={this.playSound}
          content={this.state.alerts.instructions.content}
          menu={{
            name: "instructions",
            options: [
              {
                title: "Continue",
                action: () => {
                  let alerts = this.state.alerts;
                  alerts.instructions.shown = false;
                  this.setState({
                    alerts,
                    activeMenuName: "mainMenu",
                  });
                },
                selected: true,
              },
            ],
            hasFocus: this.state.activeMenuName === "instructions",
          }}
          shown={this.state.alerts.instructions.shown}
          dismissAlert={this.dismissAlert}
        ></Alert>

        {/* "Credits" Announcement */}
        <Alert
          playSound={this.playSound}
          content={this.state.alerts.credits.content}
          menu={{
            name: "credits",
            options: [{
                title: "Continue",
                action: () => {
                  let alerts = this.state.alerts;
                  alerts.credits.shown = false;
                  this.setState({
                    alerts,
                    activeMenuName: "mainMenu",
                  });
                },
                selected: true,
              },
            ],
            hasFocus: this.state.activeMenuName === "credits",
          }}
          shown={this.state.alerts.credits.shown}
          dismissAlert={this.dismissAlert}
        ></Alert>

        {/* Utility Announcement */}
        <Alert
          playSound={this.playSound}
          content={this.state.alert.content}
          shown={this.state.alert.shown}
          autodismiss={this.state.alert.autodismiss}
          dismissAlert={this.dismissAlert}
        ></Alert>

        <Board
          playSound={this.playSound}
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
        />
      </div>
    );
  }
}

export default App;
