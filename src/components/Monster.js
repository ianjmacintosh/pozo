import React from "react";
import "./Monster.css";

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
          <g className="square shape">
            <title>Layer 1</title>
            <rect
              transform="rotate(15 19.999999999999986,19.953125000000007) "
              id="svg_1"
              height="29"
              width="29"
              y="5.45313"
              x="5.5"
              fill="#000000"
            />
          </g>
          <g className="half-circle shape">
            <title>Layer 1</title>
            <rect
              id="svg_6"
              height="0.125"
              width="0"
              y="-6.87445"
              x="-25.93655"
              fillOpacity="null"
              strokeOpacity="null"
              strokeWidth="null"
              stroke="null"
              fill="#ff5400"
            />
            <path
              id="svg_9"
              d="m0.31291,20.0625c0,-10.87685 8.81024,-19.6871 19.68709,-19.6871c10.87685,0 19.68709,8.81025 19.68709,19.6871c0,10.87685 -8.81024,19.68709 -19.68709,19.68709l-19.68709,-19.68709z"
              strokeOpacity="null"
              strokeLinecap="null"
              strokeLinejoin="null"
              strokeWidth="null"
              stroke="null"
              fillOpacity="null"
              fill="#ff5400"
            />
          </g>
          <g className="triangle shape">
            <path
              transform="rotate(40 24.790212631225597,15.353872299194334) "
              id="svg_16"
              d="m8.66554,29.46296l16.12467,-28.21817l16.12467,28.21817l-32.24934,0z"
              fillOpacity="null"
              strokeOpacity="null"
              strokeWidth="null"
              stroke="null"
              fill="#ff5400"
            />
          </g>
          <g className="plus shape">
            <g>
              <g
                display="none"
                overflow="visible"
                y="0"
                x="0"
                height="100%"
                width="100%"
                id="canvasGrid"
              >
                <rect
                  fill="url(#gridpattern)"
                  strokeWidth="0"
                  y="0"
                  x="0"
                  height="100%"
                  width="100%"
                />
              </g>
            </g>
            <g>
              <path
                transform="rotate(-98 20.000890731811523,20.000890731811527) "
                stroke="#0f0f00"
                id="svg_3"
                d="m1.00089,10.21395l9.21306,-9.21306l9.78689,9.78681l9.78689,-9.78681l9.21315,9.21306l-9.7869,9.78689l9.7869,9.78689l-9.21315,9.21315l-9.78689,-9.7869l-9.78689,9.7869l-9.21306,-9.21315l9.78681,-9.78689l-9.78681,-9.78689z"
                fillOpacity="null"
                strokeOpacity="null"
                strokeWidth="0"
                fill="#000000"
              />
            </g>
          </g>
        </svg>
      </li>
    );
  }
}

export default Monster;
