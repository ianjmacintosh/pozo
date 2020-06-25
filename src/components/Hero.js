import React from "react";

class Hero extends React.Component {
  changeColor = (newColor) => {
    // Update app state for hero color
    console.log(`Now I'm ${newColor}`);
  };

  render() {
    return <div>Hero goes here</div>;
  }
}

export default Hero;
