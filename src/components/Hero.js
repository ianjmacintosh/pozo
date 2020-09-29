import React from "react";
import "./Hero.css";

class Hero extends React.Component {
  render() {
    return (
      <div
        className={`hero hero--${this.props.orientation} hero--${this.props.color}`}
        style={{
          "--hero-x": this.props.x,
          "--hero-y": this.props.y,
        }}
      >
        <svg viewBox="0 0 40 40">
          <path
            id="svg_4"
            d="m3,40
            l17,-40
            l17,40z"
            stroke="null"
          />
        </svg>
      </div>
    );
  }
}

export default Hero;
