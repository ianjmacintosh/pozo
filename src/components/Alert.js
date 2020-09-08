import React from "react";
import "./Alert.css";

class Alert extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.text !== prevProps.text) {
      if (this.props.autodismiss) {
        window.setTimeout(() => {
          this.props.dismissAlert();
        }, 1500);
      }
    }
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
