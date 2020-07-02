import React from "react";

import Monster from "./Monster";

class Queue extends React.Component {
  reportElimination = () => {
    // Set streak to on
    // Call Counter.update()
    // Call Monster.strike() on next monster (if exists)
    // If no next monster exists on queue, call Scoreboard.update()
  };

  render() {
    return (
      <ul className="queue">
        {this.props.contents.map((key, index) => {
          return <Monster color={key} key={index} />;
        })}
      </ul>
    );
  }
}

export default Queue;
