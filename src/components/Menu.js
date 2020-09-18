import React from "react";

import MenuOption from "./MenuOption";
import "./Menu.css";

class Menu extends React.Component {
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
