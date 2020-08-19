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
          <g class="squiggle shape">
            <title>Layer 1</title>
            <path
              transform="rotate(38 19,19)"
              d="m29.92704,25.14157c-2.85768,0 -4.42064,-2.81353 -5.93171,-5.53435c-1.20202,-2.16341 -2.44487,-4.39966 -4.0023,-4.39966c-1.55854,0 -2.80029,2.23626 -4.0023,4.39966c-1.51218,2.72082 -3.07513,5.53435 -5.93171,5.53435c-2.92501,0 -4.25286,-2.98683 -5.42397,-5.62265c-1.15676,-2.60492 -2.01992,-4.31136 -3.40626,-4.31136c-0.60929,0 -1.10378,-0.49449 -1.10378,-1.10378s0.49449,-1.10378 1.10378,-1.10378c2.92502,0 4.25286,2.98683 5.42397,5.62265c1.15676,2.60382 2.01992,4.31136 3.40626,4.31136c1.55854,0 2.80029,-2.23626 4.0023,-4.39966c1.51218,-2.72081 3.07513,-5.53435 5.93171,-5.53435c2.85768,0 4.42064,2.81353 5.93171,5.53435c1.20202,2.16341 2.44487,4.39966 4.0023,4.39966c1.38635,0 2.2484,-1.70755 3.40626,-4.31136c1.17111,-2.63582 2.50006,-5.62265 5.42397,-5.62265c0.61039,0 1.10378,0.49449 1.10378,1.10378s-0.49339,1.10378 -1.10378,1.10378c-1.38635,0 -2.2484,1.70644 -3.40626,4.31136c-1.17111,2.63582 -2.50006,5.62265 -5.42397,5.62265z"
              fill="#f00"
              stroke="null"
            />
          </g>
          <g class="half-circle shape">
            <title>Layer 1</title>
            <rect
              id="svg_6"
              height="0.125"
              width="0"
              y="-6.87445"
              x="-25.93655"
              fill-opacity="null"
              stroke-opacity="null"
              stroke-width="null"
              stroke="null"
              fill="#ff5400"
            />
            <path
              id="svg_9"
              d="m0.31291,20.0625c0,-10.87685 8.81024,-19.6871 19.68709,-19.6871c10.87685,0 19.68709,8.81025 19.68709,19.6871c0,10.87685 -8.81024,19.68709 -19.68709,19.68709l-19.68709,-19.68709z"
              stroke-opacity="null"
              stroke-linecap="null"
              stroke-linejoin="null"
              stroke-width="null"
              stroke="null"
              fill-opacity="null"
              fill="#ff5400"
            />
          </g>
          <g class="triangle shape">
            <path
              transform="rotate(40 24.790212631225597,15.353872299194334) "
              id="svg_16"
              d="m8.66554,29.46296l16.12467,-28.21817l16.12467,28.21817l-32.24934,0z"
              fill-opacity="null"
              stroke-opacity="null"
              stroke-width="null"
              stroke="null"
              fill="#ff5400"
            />
          </g>
        </svg>
      </li>
    );
  }
}

export default Monster;
