import React from "react";

import Queue from "./Queue";
import "./Field.css";

class Field extends React.Component {
  render() {
    return (
      <div className={`field ${this.props.direction}-field`}>
        {this.props.queues.map((key, index) => (
          <Queue
            key={index}
            monsters={this.props.queues[index]}
            ghosts={this.props.queues[index]}
          />
        ))}
      </div>
    );
  }
}

export default Field;
