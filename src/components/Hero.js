import React from "react";
import "./Hero.css";

import strikeSound from "../sounds/strike.wav";
import walkSound from "../sounds/walk.wav";

// GreenSock Animation Platform provides animation methods
import { gsap } from "gsap";

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

  // Homebase needs this
  // This method changes the hero's color
  changeColor = (newColor) => {
    const hero = { ...this.state.hero };
    hero.color = newColor;

    // Update app state for hero color
    this.setState({ hero });
  };

  animateStrike = (field) => {
    // Play sound
    this.props.playSound("strike", 0, 0.5);

    // Find out direction to strike (up, left, down, right)
    let x = 0,
      y = 0,
      squareSize = parseInt(getComputedStyle(document.querySelector(".board")).getPropertyValue("--square-size"), 10),
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
  }

  strikeQueue = (field, queue, strikeColor) => {
    // Handler reads hero coords and direction to determine which queue to strike
    /*
    let fields = { ...this.state.fields },
      targetQueue = fields[field].queues[queue],
      monsterQueue = targetQueue.filter((item) => item.type === "monster"),
      monsterColor,
      topMonster;

    if (monsterQueue.length > 0) {
      topMonster = targetQueue.find((item) => item.type === "monster");
      monsterColor = topMonster.color;
    } else {
      monsterColor = null;
    }

    // If monster is same color, eliminate it
    if (strikeColor === monsterColor) {
      // Update streak
      const streak = 1 + this.state.streak;
      this.setState({ streak });

      // Convert monster to ghost
      topMonster.content = 100 * streak;
      topMonster.type = "ghost";

      // Remove the ghost
      setTimeout(() => {
        const index = targetQueue.indexOf(topMonster);
        targetQueue.splice(index, 1);
      }, 2000);

      // Are all queues under control?
      const hasEnoughRoom = (queue, lengthLimit) => {
        const nonGhosts = queue.filter((element) => element.type !== "ghost");

        return lengthLimit - nonGhosts.length > 1;
      };

      if (
        fields.down.queues.every((queue) =>
          hasEnoughRoom(queue, fields.down.queueLengthLimit)
        ) &&
        fields.up.queues.every((queue) =>
          hasEnoughRoom(queue, fields.up.queueLengthLimit)
        ) &&
        fields.left.queues.every((queue) =>
          hasEnoughRoom(queue, fields.left.queueLengthLimit)
        ) &&
        fields.right.queues.every((queue) =>
          hasEnoughRoom(queue, fields.right.queueLengthLimit)
        )
      ) {
        this.setState({ redAlert: false });
      }
      this.reportElimination(1);
      this.setState({ fields });
      this.strike(field, queue, strikeColor);
      return;
    }
    // If there's a monster in the queue struck
    else if (monsterQueue.length > 0) {
      this.props.playSound("swap");
      // Report streak end via App.endStreak()
      if (this.state.streak > 0) {
        this.endStreak();
      }

      //   Update hero color
      this.changeColor(monsterColor);

      //   Update monster color
      monsterQueue[0].color = strikeColor;

      this.setState({ fields });
    }

    // Flip orientation
    let hero = this.state.hero;
    let newDirection;

    switch (hero.orientation) {
      case "up":
        newDirection = "down";
        break;
      case "down":
        newDirection = "up";
        break;
      case "left":
        newDirection = "right";
        break;
      default:
        newDirection = "left";
        break;
    }

    hero.orientation = newDirection;
    this.setState({ hero });
    */
  }

  // Homebase needs this
  // This method does too much
  // 1. Animate the hero
  // 2. Update the target queue
  // 3. Change color
  // 4. Flip orientation
  strike = (field, queue, strikeColor) => {
    this.animateStrike(field, queue);
    this.strikeQueue(field, queue, strikeColor);
  };

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
