import React from "react";
import "./Scoreboard.css";

class Scoreboard extends React.Component {
  state = {
    highScore: 0
  };

  componentDidMount() {
    if (localStorage.getItem("highScore") > 0) {
      this.setState({ highScore: localStorage.getItem("highScore") });
    }
  }

  componentDidUpdate() {
    if (this.props.score > this.state.highScore) {
      localStorage.setItem("highScore", this.props.score);
      this.setState({ highScore: this.props.score });
    }
  }

  render() {
    return (
      <div className="scoreboard">
        <p className="current-score">
          Score:{" "}
          <span data-testid="current-score-display">{this.props.score}</span>
        </p>
        <p className="high-score">
          High Score:{" "}
          <span data-testid="high-score-display">{this.state.highScore}</span>
        </p>
      </div>
    );
  }
}

export default Scoreboard;
