import React from "react";

class Menu extends React.Component {
  render() {
    return (
      <div>
        <h1>Pozo</h1>
        <ul class="main-menu">
          <li class="selected">Start Game</li>
          <li>Instructions</li>
          <li>Options</li>
          <li>Credits</li>
        </ul>
      </div>
    );
  }
}

export default Menu;
