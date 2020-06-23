import React from "react";

import "../css/App.css";
import Scoreboard from "./Scoreboard";
import Field from "./Field";
import Homebase from "./Homebase";
import Counter from "./Counter";

function App() {
  // Components:
  // Scoreboard
  // Field
  //   Queue
  //     Monster
  // Homebase
  //   Hero
  // Counter
  return (
    <div className="App">
      <Scoreboard />
      <Field />
      <Field />
      <Field />
      <Field />
      <Homebase />
      <Counter />
    </div>
  );
}

export default App;
