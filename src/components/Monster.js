import React from "react";

class Monster extends React.Component {
  strike = (color) => {
    // If color matches monster color, report elimination via Queue.reportElimination()
    // If color does not match monster color, report streak end via App.endStreak() and update hero color via Hero.changeColor()
    console.log("I've been struck with " + color);
  };

  render() {
    return (
      <li className={`monster color-${this.props.color}`}>
        <span>{this.props.color}</span>
      </li>
    );
  }
}

export default Monster;
