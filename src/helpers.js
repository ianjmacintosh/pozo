export function getRandomInt(min = 0, max = 1) {
  min = Math.ceil(min);
  max = Math.floor(max + 1);
  return Math.floor(Math.random() * (max - min)) + min;
}

export function playSound(soundKey, startPoint = 0, volume = 1) {
  const audio = document.querySelector(`[data-sound=${soundKey}]`);
  audio.currentTime = startPoint;
  audio.volume = volume;
  audio.play();
}

export function isMonster(item) {
  return item.type === "monster";
}

export function isGhost(item) {
  return item.type === "ghost";
}

export const stages = [
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

export const directionMap = {
  0: "up",
  1: "left",
  2: "right",
  3: "down",
};

export function showAlert(content, autodismiss = true, persistent = false) {
  let alerts = this.state.alerts;
  let alert = this.state.alert;

  if (this.state.alerts[content]) {
    if (content === "gameOver") {
      this.setState({ activeMenuName: "gameOver" });
    }
    if (content === "victory") {
      this.setState({ activeMenuName: "victory" });
    }
    if (content === "inGameInstructions") {
      this.setState({ activeMenuName: "inGameInstructions" });
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
}
