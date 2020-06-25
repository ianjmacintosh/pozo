import React from "react";

class Hero extends React.Component {
  // Walk accepts a direction, and calls move
  walk = (direction) => {
    // Each movement updates app state for hero x & y
    // CSS variables get updated to move Hero within grid (grid-row & grid-column to reflect x and y)
    console.log("Go " + direction);
  };

  changeColor = (newColor) => {
    // Update app state for hero color
    console.log(`Now I'm ${newColor}`);
  };

  render() {
    return <div>Hero goes here</div>;
  }
}

export default Hero;
