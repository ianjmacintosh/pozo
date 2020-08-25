import React from "react";

import "./Ghost.css";

class Ghost extends React.Component {
  render() {
    return <div>{this.props.content}</div>;
  }
}

export default Ghost;
