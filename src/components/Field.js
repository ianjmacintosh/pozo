import React from "react";

import Queue from "./Queue";

class Field extends React.Component {
  render() {
    return (
      <div className={`field ${this.props.className}`}>
        <Queue />
        <Queue />
        <Queue />
        <Queue />
      </div>
    );
  }
}

export default Field;
