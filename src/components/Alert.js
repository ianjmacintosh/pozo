import React from "react";
import "./Alert.css";
import Menu from "./Menu";
import PropTypes from "prop-types";

class Alert extends React.Component {
  static propTypes = {
    shown: PropTypes.bool,
  };

  componentDidUpdate(prevProps) {
    if (this.props.content !== prevProps.content) {
      if (this.props.autodismiss) {
        window.setTimeout(() => {
          this.props.dismissAlert(this.props.name);
        }, 1500);
      }
    }

    if (this.props.shown !== prevProps.shown) {
      if (this.props.shown === false && prevProps.shown === true) {
        this.handleClose();
      }
      if (this.props.shown === true && prevProps.shown === false) {
        this.setState({ shown: true });
      }
    }
  }

  state = {
    animatingOut: false,
    shown: this.props.shown,
  };

  handleClose = () => {
    this.setState({ animatingOut: true });

    window.setTimeout(() => {
      this.setState({ animatingOut: false });
      this.setState({ shown: false });
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
        <Menu
          options={this.props.menu.options}
          name={this.props.menuName}
          hasFocus={this.props.menu.hasFocus}
          playSound={this.props.playSound}
        />
      );
    }

    if (!this.state.shown) {
      return null;
    } else {
      return (
        <div
          className={`alert
          ${this.state.animatingOut ? "animating-out" : ""}
          ${this.props.name}`}
        >
          <div className="alert-content">
            {content}
            {menu}
          </div>
        </div>
      );
    }
  }
}

export default Alert;
