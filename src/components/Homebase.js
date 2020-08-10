import React from "react";

import Hero from "./Hero";
import "./Homebase.css";

class Homebase extends React.Component {
  render() {
    return (
      <div className="homebase">
        <Hero
          orientation={this.props.heroOrientation}
          x={this.props.heroX}
          y={this.props.heroY}
          color={this.props.heroColor}
        />
      </div>
    );
  }
}

export default Homebase;
