import React from "react";

class Hero extends React.Component {
  changeColor = (newColor) => {
    // Update app state for hero color
    console.log(`Now I'm ${newColor}`);
  };

  render() {
    return (
      <div
        className={`hero hero--${this.props.direction}`}
        style={{
          "--hero-x": this.props.x,
          "--hero-y": this.props.y,
        }}
      >
        <svg>
          <path
            xmlns="http://www.w3.org/2000/svg"
            d="m5,35l14,-30l14,30l-27,0z"
          />
        </svg>
      </div>
    );
  }
}

export default Hero;
