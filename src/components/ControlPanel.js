import React from "react";
import "./ControlPanel.css";

class ControlPanel extends React.Component {
  state = {
    muted: true,
  };

  toggleSound = () => {
    let muted = !this.state.muted;
    this.setState({
      muted,
    });
  };

  render() {
    return (
      <div>
        <button onClick={this.toggleSound} className="mute-button">
          <span role="img" aria-label="Toggle sound">
            {this.state.muted ? "🔈" : "🔇"}
          </span>
        </button>
      </div>
    );
  }
}

export default ControlPanel;
