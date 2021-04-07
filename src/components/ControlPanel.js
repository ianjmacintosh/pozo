import React from "react";
import "./ControlPanel.css";

class ControlPanel extends React.Component {
  handleSfxToggleClick = () => {
    this.props.toggleSfxMute();
    document.activeElement.blur();
  };

  handleMusicToggleClick = () => {
    this.props.toggleMusicMute();
    document.activeElement.blur();
  };

  render() {
    return (
      <div className="control-panel">
        <div className="audio-control audio-sfx">
          <button
            onClick={this.handleSfxToggleClick}
            className={`mute-button ${this.props.sfxMuted ? "muted" : ""}`}
            data-testid="mute-toggleSfx"
          >
            <span role="img" aria-label="Toggle sound">
              🔔
            </span>
          </button>
        </div>
        <div className="audio-control audio-music">
          <button
            onClick={this.handleMusicToggleClick}
            className={`mute-button ${this.props.musicMuted ? "muted" : ""}`}
            data-testid="mute-toggleMusic"
          >
            <span role="img" aria-label="Toggle sound">
              🎷
            </span>
          </button>
        </div>
      </div>
    );
  }
}

export default ControlPanel;
