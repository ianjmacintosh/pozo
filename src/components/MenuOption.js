import React from "react";

class MenuOption extends React.Component {
  render() {
    return (
      <li className={this.props.selected ? "selected" : ""}>
        <span onClick={this.props.action}>{this.props.title}</span>
      </li>
    );
  }
}

export default MenuOption;
