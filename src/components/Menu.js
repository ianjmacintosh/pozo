import React from "react";

import MenuOption from "./MenuOption";

import "./Menu.css";
import menuMoveSound from "../sounds/menuMove.wav";
import menuSelectSound from "../sounds/menuSelect.wav";

class Menu extends React.Component {
  state = {
    focusedMenuItem: 0,
  };
  componentDidMount() {
    window.addEventListener("keydown", this.handleKeypress);
  }

  handleKeypress = ({ key }) => {
    if (!this.props.hasFocus) {
      return;
    }
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
      switch (command) {
        default:
          // If movement, update menu position
          this.changeMenuOption(command === "down" || command === "right");
          break;
        case "strike":
          this.chooseMenuOption();

          break;
      }
    }
  };

  changeMenuOption = (advance) => {
    this.props.playSound("menuMove", 0.05);

    // Get index of selected menu option
    let menuOption = this.state.focusedMenuItem;

    // Mark previous or next menu option as selected
    if (advance) {
      menuOption++;
    } else {
      menuOption--;
    }
    if (menuOption > this.props.options.length - 1) {
      menuOption = 0;
    } else if (menuOption < 0) {
      menuOption = this.props.options.length - 1;
    }

    this.setState({ focusedMenuItem: menuOption });
  };

  chooseMenuOption = () => {
    this.props.options.find((option) => option.selected === true).action();
  };

  render() {
    return (
      <div className="menu-wrapper">
        <ul className={`menu ${this.props.name}`}>
          {this.props.options.map((option, index) => (
            <MenuOption
              key={index}
              title={option.title}
              action={option.action}
              selected={
                (option.selected = this.state.focusedMenuItem === index)
              }
            ></MenuOption>
          ))}
        </ul>
        <audio data-sound="menuSelect" src={menuSelectSound}></audio>
        <audio data-sound="menuMove" src={menuMoveSound}></audio>
      </div>
    );
  }
}

export default Menu;
