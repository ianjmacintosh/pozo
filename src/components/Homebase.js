import React from "react";

import "./Homebase.css";

class Homebase extends React.Component {
  render() {
    return (
      <div
        className="homebase"
        onClick={() => this.props.handleKeypress({ key: "Enter" })}
      >
        {this.props.children}
      </div>
    );
  }
}

export default Homebase;
