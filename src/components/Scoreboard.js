import React from "react";

class Scoreboard extends React.Component {
  render() {
    return <div className="scoreboard">Score: {this.props.score}</div>;
  }
}

export default Scoreboard;
