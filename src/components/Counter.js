import React from "react";

class Counter extends React.Component {
  update = (monsterCount) => {
    console.log(
      // If counter is 0 or less, call App.endStage()
      `I see you eliminated ${monsterCount} monsters, decrementing the counter...`
    );
  };
  render() {
    return <div>Counter goes here</div>;
  }
}

export default Counter;
