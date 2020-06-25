import React from "react";

import "../css/App.css";
import Scoreboard from "./Scoreboard";
import Field from "./Field";
import Homebase from "./Homebase";
import Counter from "./Counter";

class App extends React.Component {
  setStage = (settings) => {
    // Number of monsters in stage (e.g., 50)
    // Rate of monster creation (interval at which a new monster created; e.g., 3)
    // Wave duration (interval at which rate accelerates; e.g., 10)
    // Rate of acceleration (multiplier to apply to rate; e.g. 0.75)
    // In the example above: 50 monsters need to be eliminated to move to next stage. A new monster is provided every 3 seconds. Every 10 seconds, the duration decreases by 25% -- instead of monsters being created every 3 seconds, new monsters get created every 2.25 seconds. After 10 more seconds, a new monster gets created every 1.6875 seconds
    console.log("Setting stage");
  };

  addMonster = () => {
    // Update state to add monster of randomColor to randomQueue of randomField
    // Create new Monster component within the appropriate queue (this should be handled automatically)
    console.log("Add a monster to a random queue");
  };

  strike = () => {
    // Read hero coords and direction to determine which queue to strike
    // Call Queue.strike() on appropriate queue
    console.log(`Strike at the right queue!`);
  };

  endStreak = () => {
    console.log("Streak is over!");
  };

  endStage = () => {
    // Congratulate user, show score, then call App.setStage with settings for next level
    console.log(`🏁 Congratulations! You completed the stage 🏁`);
  };
  render() {
    return (
      <div className="App">
        <header>
          <Scoreboard />
        </header>
        <main>
          <Field className="north-field" />
          <Field className="west-field" />
          <Field className="east-field" />
          <Field className="south-field" />
          <Homebase />
        </main>
        <footer>
          <Counter />
        </footer>
      </div>
    );
  }
}

export default App;
