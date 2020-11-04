import React from "react";
import "./Hero.css";

import strikeSound from "../sounds/strike.wav";
import walkSound from "../sounds/walk.wav";

class Hero extends React.Component {
  state = {
    color: 0,
    x: 1,
    y: 1,
    orientation: "up",
  }
  componentDidMount() {
    window.addEventListener("keydown", this.handleKeypress);
  }
  // This method handles input from the user to make the hero move
  handleKeypress = ({ key }) => {
    // Each movement updates app state for hero x & y
    const keyMappings = {
      w: "up",
      d: "right",
      s: "down",
      a: "left",
      " ": "strike",
      z: "strike",

      W: "up",
      D: "right",
      S: "down",
      A: "left",
      Z: "strike",

      ArrowUp: "up",
      ArrowRight: "right",
      ArrowDown: "down",
      ArrowLeft: "left",
      Enter: "strike",
    };

    if (key in keyMappings) {
      const command = keyMappings[key];

      console.log(command);
      if (this.props.canMove) {
        if (command === "strike") {
          let direction = this.state.orientation,
            queue = this.state.y - 1,
            color = this.state.color;

          // If the hero is pointed north or south, use X coord for queue
          if (direction === "up" || direction === "down") {
            queue = this.state.x - 1;
          }

          this.strike(direction, queue, color);
        } else {
          console.log("Time to walk")
          this.walk(command);
        }
      }
    }
  };

  // Hero needs this
  // This method updates the hero's coordinates and orientation
  // Walk accepts a direction, and calls move
  walk = (direction) => {
    this.props.playSound("walk", 0, 0.15);

    // Each movement updates app state for hero x & y
    const directionChanges = {
        up: [0, -1],
        right: [1, 0],
        down: [0, 1],
        left: [-1, 0],
      },
      baseSize = 4;

    // Update hero coordinates based on direction movement
    let x = this.state.x,
      y = this.state.y,
      orientation = this.state.orientation;

    orientation = direction;

    // Each coordinate must be between 1 and 4 (inclusive)
    x += directionChanges[direction][0];
    x = Math.max(1, x);
    x = Math.min(baseSize, x);

    y += directionChanges[direction][1];
    y = Math.max(1, y);
    y = Math.min(baseSize, y);

    this.setState({ x, y, orientation });
  };

  strike = () => {
    console.log("Strike!!");
  }

  render() {
    return (
      <div
        className={`hero hero--${this.state.orientation} hero--${this.state.color}`}
        style={{
          "--hero-x": this.state.x,
          "--hero-y": this.state.y,
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
        <audio data-sound="strike" src={strikeSound}></audio>
        <audio data-sound="walk" src={walkSound}></audio>
      </div>
    );
  }
}

export default Hero;
