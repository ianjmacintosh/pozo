import React from "react";

import "../css/App.css";
import Scoreboard from "./Scoreboard";
import Field from "./Field";
import Homebase from "./Homebase";
import Counter from "./Counter";

function App() {
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

export default App;
