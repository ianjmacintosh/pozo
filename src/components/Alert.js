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

    if (this.props.shown !== prevProps.shown) {
      if (this.props.shown === false && prevProps.shown === true) {
        this.handleClose();
      }
    }
  }

  state = {
    animatingOut: false,
  };

  handleClose = () => {
    let menuName;

    if (this.props.menu) {
      menuName = this.props.menu.name;
    } else {
      menuName = this.props.menuName;
    }
    console.log(`Animating ${menuName} out`);
    this.setState({ animatingOut: true });

    window.setTimeout(() => {
      this.setState({ animatingOut: false });
    }, 250);
  };

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
      <div
        className={`alert
        ${this.props.shown ? "shown" : "hidden"}
        ${this.state.animatingOut ? "animating-out" : ""}`}
      >
        <div className="alert-content">
          {content}
          {menu}
        </div>
      </div>
    );
  }
}

export default Alert;
