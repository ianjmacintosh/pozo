let homebase = {};

homebase.state = {
	"size": [ 4, 4 ], // How wide and tall is home base?
	"1P": {
		"coords": [	0, 0 ], // Where is 1P in the base? -- X, Y coords
	}
};

function updateHomeBaseView(coords = [ 0, 0 ]) {
  let homeBase = document.getElementById("js-home-base"),
      player1 = document.getElementById("js-player1");
  
  homeBase.querySelectorAll("div.home-base__square")[
    get1dCoordsFrom2d(coords, homebase.state.size[0])
  ].appendChild(player1);
}

document.addEventListener("keydown", ({key}) => {
  const keyMappings = {
        "w": "up",
        "d": "right",
        "s": "down",
        "a": "left",

        "W": "up",
        "D": "right",
        "S": "down",
        "A": "left",

        "ArrowUp": "up",
        "ArrowRight": "right",
        "ArrowDown": "down",
        "ArrowLeft": "left",
    };

  if (key in keyMappings) {
    const direction = keyMappings[key];

    homebase.state["1P"].coords = getNewCoords(direction, homebase.state["1P"].coords, homebase.state.size);

    updatePlayerOrientation(document.getElementById("js-player1"), direction);
    updatePlayerPosition(homebase.state["1P"].coords);
  }
})

const get1dCoordsFrom2d = (coords, gridWidth) => coords[0] + (coords[1] * gridWidth);

function updatePlayerOrientation(playerElement, direction) {
  playerElement.classList.remove(
    "player--up",
    "player--right",
    "player--left",
    "player--down"
  );
  playerElement.classList.add(`player--${direction}`);
}

function getNewCoords(direction, oldCoords, gridSize) {
  // Instructions for how to modify coords for each direction
  const directionChanges = {
      "up": [ 0, -1 ],
      "right": [ 1, 0 ],
      "down": [ 0, 1 ],
      "left": [ -1, 0 ]
    };
  
  // Apply the direction changes to the current coord
  // I'm a little surprised there isn't a better `Array()` method to support this
  return oldCoords.map(
    function getCoordsWithinBounds(coord, i) {
      // I'm surprised there isn't a `Math()` method that combines `Math.max()` and `Math.min()`
      return Math.min( // Use whatever's smaller: the maximum coord or the new coord
        gridSize[i] - 1,
        Math.max( // Use whatever's bigger: 0 or the new coord
          0,
          coord + directionChanges[direction][i]
        )
      )
    }
  );
}
