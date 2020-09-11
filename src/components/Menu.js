import React from "react";

import MenuOption from "./MenuOption";
import "./Menu.css";

class Menu extends React.Component {
  componentDidMount() {
    console.log(`${this.props.name} mounted to the DOM`);
  }
  componentDidUpdate() {
    console.log(`${this.props.name} sees a change`);
    this.props.options[this.props.selectedOption] = true;
  }
  render() {
    return (
      <div className="menu-wrapper">
        <ul className="menu">
          {this.props.options.map((option, index) => (
            <MenuOption
              key={index}
              title={option.title}
              action={option.action}
              selected={option.selected}
            ></MenuOption>
          ))}
        </ul>
      </div>
    );
  }
}

export default Menu;
