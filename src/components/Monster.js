import React from "react";

class Monster extends React.Component {
  render() {
    return (
      <li className={`monster color-${this.props.color}`}>
        <span>{this.props.color}</span>
      </li>
    );
  }
}

export default Monster;
