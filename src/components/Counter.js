import React from "react";
import "./Counter.css";

class Counter extends React.Component {
  render() {
    return <div className="counter">{this.props.count}</div>;
  }
}

export default Counter;
