import React from "react";

import Hero from "./Hero";

class Homebase extends React.Component {
  render() {
    return (
      <div style={{ border: "solid 1px red" }}>
        Homebase goes here
        <Hero />
      </div>
    );
  }
}

export default Homebase;
