import React from "react";
import "./Counter.css";

class Counter extends React.Component {
  render() {
    let monstersRemaining = this.props.count;

    return <div className="counter">{monstersRemaining}</div>;
  }
}

export default Counter;
