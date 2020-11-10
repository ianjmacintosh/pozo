import React from "react";
import "./ControlPanel.css";

class ControlPanel extends React.Component {
  handleToggleClick = () => {
    this.props.toggleMute();
    document.activeElement.blur();
  }
  render() {
    return (
      <div>
        <button onClick={this.handleToggleClick} className="mute-button" data-testid="mute-toggleSfx">
          <span role="img" aria-label="Toggle sound">
            {this.props.muted ? "🔇" : "🔈"}
          </span>
        </button>
      </div>
    );
  }
}

export default ControlPanel;
