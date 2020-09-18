import React from "react";
import "./Alert.css";
import Menu from "./Menu";

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
    let content;
    let menu;
    if (this.props.content) {
      content = this.props.content;
    }
    if (this.props.menu) {
      menu = (
        <Menu options={this.props.menu.options} name={this.props.menuName} />
      );
    }
    return (
      <div className={`alert ${this.props.shown ? "shown" : "hidden"}`}>
        <div className="alert-content">
          {content}
          {menu}
        </div>
      </div>
    );
  }
}

export default Alert;
