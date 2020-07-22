import React from "react";

import MenuOption from "./MenuOption";

class Menu extends React.Component {
  componentDidUpdate() {
    this.props.options[this.props.selectedOption] = true;
  }
  render() {
    return (
      <div>
        <h1>Pozo</h1>
        <ul className="main-menu">
          {this.props.options.map((option, index) => (
            <MenuOption
              title={option.title}
              key={index}
              selected={option.selected}
            ></MenuOption>
          ))}
        </ul>
      </div>
    );
  }
}

export default Menu;
