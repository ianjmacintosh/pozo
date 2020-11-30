import React from "react";
import "./Scoreboard.css";

class Scoreboard extends React.Component {
  state = {
    highScore: 0
  };

  componentDidUpdate(prevProps) {
  }

  render() {
    return <div className="scoreboard">
      <p className="current-score">
      Score: {this.props.score}
      </p>
      <p className="high-score">
        High Score: <span data-testid="high-score-display">{this.state.highScore}</span>
      </p>
      </div>;
  }
}

export default Scoreboard;
