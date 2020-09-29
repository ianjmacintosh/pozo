import React from "react";
import "./ControlPanel.css";

class ControlPanel extends React.Component {
  render() {
    return (
      <div>
        <button onClick={this.props.toggleMute} className="mute-button">
          <span role="img" aria-label="Toggle sound">
            {this.props.muted ? "🔇" : "🔈"}
          </span>
        </button>
      </div>
    );
  }
}

export default ControlPanel;
