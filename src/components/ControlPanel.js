import React from "react";
import "./ControlPanel.css";

class ControlPanel extends React.Component {
  handleSfxToggleClick = () => {
    this.props.toggleSfxMute();
    document.activeElement.blur();
  }

  handleMusicToggleClick = () => {
    this.props.toggleMusicMute();
    document.activeElement.blur();
  }

  render() {
    return (
      <div>
        <button onClick={this.handleSfxToggleClick} className="mute-button" data-testid="mute-toggleSfx">
          <span role="img" aria-label="Toggle sound">
            {this.props.muted ? "🔕" : "🔔"}
          </span>
        </button>
        <button onClick={this.handleMusicToggleClick} className="mute-button" data-testid="mute-toggleMusic">
          <span role="img" aria-label="Toggle sound">
            {this.props.muted ? "🔇🎼" : "🔈🎼"}
          </span>
        </button>
      </div>
    );
  }
}

export default ControlPanel;
