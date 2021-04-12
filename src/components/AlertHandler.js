import React from "react";

import Alert from "./Alert";

class AlertHandler extends React.Component {
  state = {
    content: "",
    persistent: "",
    shown: false,
    autodismiss: false,
  };

  showAlert = (alert, autodismiss = true, persistent = false) => {
    this.setState({ shown: true });
  };

  render() {
    return <Alert></Alert>;
  }
}

export default AlertHandler;
