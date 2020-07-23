import React from "react";

class Alert extends React.Component {
  state = {
    animated: false,
  };
  componentDidUpdate(prevProps) {
    if (this.props.text !== prevProps.text) {
      this.setState({ animated: true });
      window.setTimeout(() => {
        this.setState({ animated: false });
      }, 2000);
    }
  }
  render() {
    if (this.props.text) {
      return (
        <div className={`alert ${this.state.animated ? "animated" : ""}`}>
          <p>{this.props.text}</p>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Alert;
