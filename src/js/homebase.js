let homebase = {};

homebase.state = {
	"size": [ 4, 4 ], // How wide and tall is home base?
	"1P": {
		"coords": [	0, 0 ], // Where is 1P in the base? -- X, Y coords
		"orientation": "up", // What direction is 1P facing?
		"status": "A" // What color is 1P?
	}
};

function updateHomeBaseView(coords = [ 0, 0 ]) {
  let homeBase = document.getElementById("js-home-base"),
      player1 = document.getElementById("js-player1");
  
  homeBase.querySelectorAll("div.home-base__square")[get1dCoordsFrom2d(coords, homebase.state.size[0])].appendChild(player1);
}

document.addEventListener("keydown", ({key}) => {
  const directionKeys = {
        "W": "up",
        "D": "right",
        "S": "down",
        "A": "left",
        "ARROWUP": "up",
        "ARROWRIGHT": "right",
        "ARROWDOWN": "down",
        "ARROWLEFT": "left",
    };

  if (key.toUpperCase() in directionKeys) {
    const direction = directionKeys[key.toUpperCase()];

    homebase.state["1P"].coords = getNewCoords(direction, homebase.state["1P"].coords, homebase.state.size);
    updateHomeBaseView(homebase.state["1P"].coords);
    
    document.getElementById("js-player1").classList.remove("player--up", "player--right", "player--left", "player--down");
    document.getElementById("js-player1").classList.add(`player--${direction}`);
  }
})

const get1dCoordsFrom2d = (coords, gridWidth) => coords[0] + (coords[1] * gridWidth);

function getNewCoords(direction, oldCoords, gridSize) {
  let directions = {
      "up":  [ 0, -1 ],
      "right":   [ 1, 0 ],
      "down":  [ 0, 1 ],
      "left":   [ -1, 0 ]
    },
    newCoords = [
      oldCoords[0] + directions[direction][0],
      oldCoords[1] + directions[direction][1]
    ];
  
  if (newCoords[0] + 1 > gridSize[0] || newCoords[0] < 0 ||
     newCoords[1] + 1 > gridSize[1] || newCoords[1] < 0) {
    return oldCoords;
  } else {
    return newCoords;
  }
}
