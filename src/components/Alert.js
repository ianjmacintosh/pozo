import React from "react";
import "./Alert.css";

class Alert extends React.Component {
  state = {
    shown: false,
  };
  componentDidUpdate(prevProps) {
    if (this.props.text !== prevProps.text) {
      this.setState({ shown: true });

      if (this.props.autodismiss) {
        window.setTimeout(() => {
          console.log("Go away!");
          this.setState({ shown: false });
        }, 1500);
      }
    }
  }
  render() {
    if (this.props.text) {
      return (
        <div className={`alert ${this.state.shown ? "shown" : "hidden"}`}>
          <p>{this.props.text}</p>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Alert;
