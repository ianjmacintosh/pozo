import React from "react";

class Monster extends React.Component {
  strike = (color) => {
    // If color matches monster color, report elimination via Queue.reportElimination()
    // If color does not match monster color, report streak end via App.endStreak() and update hero color via Hero.changeColor()
    console.log("I've been struck with " + color);
  };

  render() {
    return <div style={{ border: "solid 1px blue" }}>Monster goes here</div>;
  }
}

export default Monster;
