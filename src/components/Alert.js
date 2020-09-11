import React from "react";
import "./Alert.css";

class Alert extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.content !== prevProps.content) {
      if (this.props.autodismiss) {
        window.setTimeout(() => {
          this.props.dismissAlert();
        }, 1500);
      }
    }
  }
  render() {
    if (this.props.content) {
      return (
        <div className={`alert ${this.props.shown ? "shown" : "hidden"}`}>
          <div className="alert-content">{this.props.content}</div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Alert;
