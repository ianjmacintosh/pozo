import React from "react";

class Hero extends React.Component {
  render() {
    return (
      <div
        className={`hero hero--${this.props.direction} hero--${this.props.color}`}
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
