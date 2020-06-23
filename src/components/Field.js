import React from "react";

import Queue from "./Queue";

class Field extends React.Component {
  render() {
    return (
      <div>
        Field goes here
        <Queue />
        <Queue />
        <Queue />
        <Queue />
      </div>
    );
  }
}

export default Field;
