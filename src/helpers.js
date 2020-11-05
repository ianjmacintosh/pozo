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
