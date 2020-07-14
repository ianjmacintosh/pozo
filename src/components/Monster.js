import React from "react";

class Monster extends React.Component {
  render() {
    return (
      <li className={`monster color-${this.props.color}`}>
        <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
          <g>
            <title>background</title>
            <rect
              fill="none"
              id="canvas_background"
              height="42"
              width="42"
              y="-1"
              x="-1"
            />
          </g>
          <g>
            <title>Layer 1</title>
            <path
              id="svg_1"
              d="m15.854001,20.518823c3.583026,0.859926 5.446199,7.452693 11.752324,9.029224c6.306125,1.576531 12.468929,-10.175793 6.306125,-14.762065c-6.162804,-4.586273 -9.172545,6.892844 -14.403763,3.23144c-5.231217,-3.661404 -5.231217,-12.103909 -11.895645,-8.742582c-6.664428,3.361327 -6.503191,10.403651 -1.316762,12.113706c5.186429,1.710055 5.974695,-1.72965 9.557721,-0.869724l0,0.000001z"
              fill="#f00"
              stroke="null"
            />
          </g>
        </svg>
      </li>
    );
  }
}

export default Monster;
