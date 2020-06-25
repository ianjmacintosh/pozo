import React from "react";

class Queue extends React.Component {
  strike = (color) => {
    // Call Monster.strike() on front monster on appropriate queue, handling passing-through
    console.log("Striking the queue with " + color);
  };

  reportElimination = () => {
    // Set streak to on
    // Call Counter.update()
    // Call Monster.strike() on next monster (if exists)
    // If no next monster exists on queue, call Scoreboard.update()
  };

  render() {
    return (
      <ul className="queue">
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
      </ul>
    );
  }
}

export default Queue;
