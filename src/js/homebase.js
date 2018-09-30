let homebase = {};

homebase.state = {
	"size": [ 4, 4 ], // How wide, how tall?
	"1P": {
		"coords": [	0, 0 ], // Where is 1P in the base? -- X, Y coords
		"orientation": "N", // What direction is 1P facing?
		"status": "A" // What color is 1P?
	}
};

function updateHomeBaseView(coords = [ 0, 0 ]) {
  let homeBase = document.getElementById("js-home-base"),
      player1 = document.getElementById("js-player1");
  
  homeBase.querySelectorAll("div.home-base__square")[get1dCoordsFrom2d(coords)].appendChild(player1);
}

document.addEventListener("keydown", (event) => {
  const directionKeys = {
        "W": "north",
        "D": "east",
        "S": "south",
        "A": "west",
        "ARROWUP": "north",
        "ARROWRIGHT": "east",
        "ARROWDOWN": "south",
        "ARROWLEFT": "west",
    },
        direction = directionKeys[event.key.toUpperCase()];

  if (typeof direction !== "undefined") {
    homebase.state["1P"].coords = getNewCoords(direction);
    updateHomeBaseView(homebase.state["1P"].coords);
    
    document.getElementById("js-player1").classList.remove("player--north", "player--east", "player--west", "player--south");
    
    document.getElementById("js-player1").classList.add(`player--${direction}`);
  }
})

function get1dCoordsFrom2d(coordinates) {
  let gridSize = [ 4, 4 ];
  return coordinates[0] + (coordinates[1] * gridSize[0]);
}

function getNewCoords(direction) {
  let directions = {
      "north":  [ 0, -1 ],
      "east":   [ 1, 0 ],
      "south":  [ 0, 1 ],
      "west":   [ -1, 0 ]
    },
    currentCoords = homebase.state["1P"].coords,
    newCoords = [
      currentCoords[0] + directions[direction][0], 
      currentCoords[1] + directions[direction][1]
    ];
  
  if (newCoords[0] + 1 > homebase.state.size[0] || newCoords[0] < 0 ||
     newCoords[1] + 1 > homebase.state.size[1] || newCoords[1] < 0) {
    return currentCoords;
  } else {
    return newCoords;
  }
}
