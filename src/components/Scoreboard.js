import React from "react";

class Scoreboard extends React.Component {
  render() {
    return (
      <div>
        <strong>Score</strong>: {this.props.score}
      </div>
    );
  }
}

export default Scoreboard;
