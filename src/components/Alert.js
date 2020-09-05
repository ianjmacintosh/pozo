import React from "react";
import "./Alert.css";

class Alert extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.text !== prevProps.text) {
      if (this.props.autodismiss) {
        window.setTimeout(() => {
          console.log("Go away!");
          this.props.dismissAlert();
        }, 1500);
      }
    }

    console.log("Setting shown to " + this.props.shown);
  }
  render() {
    if (this.props.text) {
      return (
        <div className={`alert ${this.props.shown ? "shown" : "hidden"}`}>
          <div className="alert-content">{this.props.text}</div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Alert;
