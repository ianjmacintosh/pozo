import React from "react";

class MenuOption extends React.Component {
  render() {
    return (
      <li className={this.props.selected ? "selected" : ""}>
        {this.props.title}
      </li>
    );
  }
}

export default MenuOption;
