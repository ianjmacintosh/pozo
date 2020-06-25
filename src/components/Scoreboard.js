import React from "react";

class Scoreboard extends React.Component {
  update = (monsterCount) => {
    // Scoreboard.update() manages streak tally? Need to figure out how to manage this
    console.log(`Eliminated ${monsterCount} monsters! Updating score...`);
  };
  render() {
    return <div>Scoreboard goes here</div>;
  }
}

export default Scoreboard;
