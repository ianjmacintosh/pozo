import React from "react";

import Monster from "./Monster";
import Ghost from "./Ghost";
import "./Queue.css";

class Queue extends React.Component {
  state = {
    contents: []
  }

  render() {
    return (
      <ul className="queue">
        {this.props.contents.map((item, index) => {
          if (item.type === "monster") {
            return <Monster color={item.color} key={index} />;
          } else {
            return <Ghost content={item.content} key={index} />;
          }
        })}
      </ul>
    );
  }
}

export default Queue;
