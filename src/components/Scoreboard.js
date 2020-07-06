import React from "react";

class Scoreboard extends React.Component {
  render() {
    return <div>{this.props.score}</div>;
  }
}

export default Scoreboard;
