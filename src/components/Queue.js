import React from "react";

import Monster from "./Monster";
import Ghost from "./Ghost";
import "./Queue.css";

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
        {this.props.contents.map((item, index) => {
          if (item.type === "monster") {
            return <Monster color={item.color} key={index} />;
          } else {
            return <Ghost score={item.score} key={index} />;
          }
        })}
      </ul>
    );
  }
}

export default Queue;
