import React from "react";

// All these sounds are used by audio elements
import salgre from "../sounds/salgre.mp3";
import silentPartner from "../sounds/silentPartner.mp3";
import gypsyDance from "../sounds/gypsyDance.mp3";
import eliminateSound from "../sounds/eliminate.wav";
import swapSound from "../sounds/swap.wav";
import gameOverSound from "../sounds/gameOver.wav";
import stageClearSound from "../sounds/stageClear.wav";
import menuSelectSound from "../sounds/menuSelect.wav";
import splashSound from "../sounds/splash.wav";

const changeMusic = (songKey, stopMusic = false) => {
  const audio = document.querySelector(`[data-sound=${songKey}]`);

  if (!audio) {
    return;
  }

  if (stopMusic) {
    audio.pause();
    return;
  }

  audio.currentTime = 0;
  audio.volume = 0.6;
  audio.play();
};

const playSound = (soundKey, startPoint = 0, volume = 1, delay = 0) => {
  const audio = document.querySelector(`[data-sound=${soundKey}]`);
  if (!audio) {
    return;
  }
  audio.currentTime = startPoint;
  audio.volume = volume;
  setTimeout(() => {
    audio.play();
  }, delay);
};

const AudioPlayer = (props) => {
  return (
    <div className="audio-player">
      <audio
        data-sound="song-salgre"
        src={salgre}
        onEnded={() => {
          changeMusic("song-silentPartner");
        }}
      />
      <audio
        data-sound="song-silentPartner"
        src={silentPartner}
        onEnded={() => {
          changeMusic("song-gypsyDance");
        }}
      />
      <audio
        data-sound="song-gypsyDance"
        src={gypsyDance}
        onEnded={() => {
          changeMusic("song-salgre");
        }}
      />

      <audio data-sound="eliminate" src={eliminateSound} />
      <audio data-sound="menuSelect" src={menuSelectSound} />
      <audio data-sound="swap" src={swapSound} />
      <audio data-sound="gameOver" src={gameOverSound} />
      <audio data-sound="victory" src={splashSound} />
      <audio data-sound="stageClear" src={stageClearSound} />
    </div>
  );
};

export { changeMusic, playSound };

export default AudioPlayer;
