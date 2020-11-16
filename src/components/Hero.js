import React from "react";
import "./Hero.css";

import strikeSound from "../sounds/strike.wav";
import walkSound from "../sounds/walk.wav";

// GreenSock Animation Platform provides animation methods
import { gsap } from "gsap";

class Hero extends React.Component {
  state = {
    x: 1,
    y: 1,
    orientation: "up",
    untouched: true
  }
  componentDidMount() {
    setTimeout(() => {
      if (this.state.untouched) {
        this.showInGameInstructions();
      }
    }, 8000);
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

      if (this.props.canMove) {
        this.setState({ untouched: false })

        if (command === "strike") {
          let direction = this.state.orientation,
            queue = this.state.y - 1,
            color = this.props.color;

          // If the hero is pointed north or south, use X coord for queue
          if (direction === "up" || direction === "down") {
            queue = this.state.x - 1;
          }

          this.strike(direction, queue, color);
        } else {
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

  // Homebase needs this
  // This method changes the hero's color
  changeColor = (newColor) => {
    const hero = { ...this.state.hero };
    hero.color = newColor;

    // Update app state for hero color
    this.setState({ hero });
  };

  showInGameInstructions = () => {
    this.props.showAlert("inGameInstructions", true, false);
  }

  animateStrike = (field) => {
    // Play sound
    this.props.playSound("strike", 0, 0.5);

    // Find out direction to strike (up, left, down, right)
    let x = 0,
      y = 0,
      squareSize = this.props.squareSize,
      sizeOfQueue = (field === "up" || field === "down" ? this.props.shortQueueSize : this.props.longQueueSize) * squareSize,
      heroToEdge = 0,
      distanceToTravel = 0;

    // Calculate distance from current location to end of target queue
    // Calculate distance from hero to edge of base
    switch (field) {
      case "up":
        // 1 should go just the distance of the queue
        heroToEdge = (this.state.y - 1) * squareSize;
        break;

      case "down":
        heroToEdge = (4 - this.state.y) * squareSize;
        break;

      case "left":
        heroToEdge = (this.state.x - 1) * squareSize;
        break;

      case "right":
        heroToEdge = (4 - this.state.x) * squareSize;
        break;

      default:
        heroToEdge = 0;
    }

    distanceToTravel = heroToEdge + sizeOfQueue;

    if (field === "up" || field === "left") {
      distanceToTravel *= -1;
    }
    if (field === "up" || field === "down") {
      y = distanceToTravel;
    } else {
      x = distanceToTravel;
    }
    // Animate that transition
    let tl = gsap.timeline();
    tl.to(".hero", {
      duration: 0.1,
      x,
      y,
    });
    tl.to(".hero", {
      duration: 0.1,
      x: 0,
      y: 0,
    });

    // Flip orientation
    let newOrientation;
    let orientation = this.state.orientation;

    switch (orientation) {
      case "up":
        newOrientation = "down";
        break;
      case "down":
        newOrientation = "up";
        break;
      case "left":
        newOrientation = "right";
        break;
      default:
        newOrientation = "left";
        break;
    }

    this.setState({ orientation: newOrientation });
  }

  // Homebase needs this
  // This method does too much
  // 1. Animate the hero
  // 2. Flip the hero direction
  // 3. Update the target queue
  // 4. Change color based on what the queue sends back
  strike = (field, queue, strikeColor) => {
    this.animateStrike(field, queue);

    this.props.handleStrikeCall(field, queue, strikeColor);
  };

  render() {
    return (
      <div
        className={`hero hero--${this.state.orientation} hero--${this.props.color}`}
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
