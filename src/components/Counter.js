import React from "react";
import "./Counter.css";

import { getRandomInt } from "../helpers";

class Counter extends React.Component {
  state = {
    animationName: ""
  }
  componentDidUpdate(prevProps) {
    if (prevProps.count !== this.props.count) {
      if (!this.state.animating) {
        this.setState({
          animationName: "shake" + getRandomInt(1, 5)
        })
        setTimeout(() => {
          this.setState({
            animationName: ""
          })
        }, 500);
      }
    }
  }

  render() {
    let monstersRemaining = this.props.count;

    return <div className={`counter ${ this.state.animationName }`}>
      {monstersRemaining}
      </div>;
  }
}

export default Counter;
