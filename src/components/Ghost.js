import React from "react";

import "./Ghost.css";

class Ghost extends React.Component {
  render() {
    return <div className="ghost">{this.props.content}</div>;
  }
}

export default Ghost;
