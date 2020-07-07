import React from "react";

class Counter extends React.Component {
  render() {
    return <div>{this.props.count}</div>;
  }
}

export default Counter;
