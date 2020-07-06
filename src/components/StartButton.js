import React from "react";

class StartButton extends React.Component {
  handleStart = async () => {
    console.log("Click");
    await this.props.setStage(this.props.currentStage);
    this.props.start();
  };
  render() {
    return (
      <button onClick={this.handleStart}>
        Start Stage {this.props.currentStage}
      </button>
    );
  }
}

export default StartButton;
