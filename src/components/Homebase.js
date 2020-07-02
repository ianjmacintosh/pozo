import React from "react";

import Hero from "./Hero";

class Homebase extends React.Component {
  render() {
    return (
      <div className="homebase">
        <Hero
          direction={this.props.heroDirection}
          x={this.props.heroX}
          y={this.props.heroY}
          color={this.props.heroColor}
        />
      </div>
    );
  }
}

export default Homebase;
