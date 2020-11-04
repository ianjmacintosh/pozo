import React from "react";

import Monster from "./Monster";
import Ghost from "./Ghost";
import "./Queue.css";

class Queue extends React.Component {
  state = {
    contents: []
  }

  strike = (color) => {
    console.log(`Struck with ${color}`);

    let contents = this.state.contents,
      monsterQueue = contents.filter((item) => item.type === "monster"),
      monsterColor,
      topMonster;

    if (monsterQueue.length > 0) {
      topMonster = contents.find((item) => item.type === "monster");
      monsterColor = topMonster.color;
    } else {
      monsterColor = null;
    }

    // If monster is same color, eliminate it
    if (color === monsterColor) {
      // Update streak
      const streak = 1 + this.state.streak;
      this.setState({ streak });

      // Convert monster to ghost
      topMonster.content = 100 * streak;
      topMonster.type = "ghost";

      // Remove the ghost
      setTimeout(() => {
        const index = contents.indexOf(topMonster);
        contents.splice(index, 1);
      }, 2000);

      // // Measure queues length to update "red alert" status
      // const hasEnoughRoom = (queue, lengthLimit) => {
      //   const nonGhosts = queue.filter((element) => element.type !== "ghost");

      //   return lengthLimit - nonGhosts.length > 1;
      // };

      // if (
      //   fields.down.queues.every((queue) =>
      //     hasEnoughRoom(queue, fields.down.queueLengthLimit)
      //   ) &&
      //   fields.up.queues.every((queue) =>
      //     hasEnoughRoom(queue, fields.up.queueLengthLimit)
      //   ) &&
      //   fields.left.queues.every((queue) =>
      //     hasEnoughRoom(queue, fields.left.queueLengthLimit)
      //   ) &&
      //   fields.right.queues.every((queue) =>
      //     hasEnoughRoom(queue, fields.right.queueLengthLimit)
      //   )
      // ) {
      //   this.setState({ redAlert: false });
      // }

      this.props.reportElimination(1);
      this.setState({ contents });
      this.strike(color);
      return;
    }
    // If there's a monster in the queue struck, swap colors
    else if (monsterQueue.length > 0) {
      this.props.playSound("swap");
      // Report streak end via App.endStreak()
      if (this.state.streak > 0) {
        this.endStreak();
      }

      //   Update hero color
      this.changeColor(monsterColor);

      //   Update monster color
      monsterQueue[0].color = color;

      this.setState({ contents });
    }
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
