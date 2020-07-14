import React from "react";

class StartButton extends React.Component {
  handleStart = async () => {
    console.log("Click");
    this.props.start(this.props.currentStage);
  };
  render() {
    return <button onClick={this.handleStart}>Start</button>;
  }
}

export default StartButton;
