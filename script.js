const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
let outcome = 0;
const cellSize = 60;
const gridSize = 7;
const padding = 20;
const sheepImg = new Image();
sheepImg.src = 'images/sheep.png';
let roundsLeft = 11;
const instructionText = document.getElementById('instruction-text');


const GameState = {
  rollDice: "rollDice",
  chooseFenceOrientation: "chooseFenceOrientation",
  placeFence: "placeFence",
  gameOver: "gameOver",
};
let gameState = GameState.rollDice;

const grid = Array.from({ length: gridSize }, () =>
  Array.from({ length: gridSize }, () => ({
    topVisible: false,
    rightVisible: false,
    bottomVisible: false,
    leftVisible: false
  }))
);


function captureCanvas() {
  const canvas = document.getElementById('game-canvas');
  const dataURL = canvas.toDataURL('image/png');
  return dataURL;
}

const shareModal = document.getElementById('shareModal');
const shareModalCloseButton = shareModal.getElementsByClassName('close')[0];

shareModalCloseButton.onclick = function() {
  shareModal.style.display = 'none';
};

window.onclick = function(event) {
  if (event.target == shareModal) {
    shareModal.style.display = 'none';
  }
};



document.getElementById('shareGameLink').addEventListener('click', function(e) {
  e.preventDefault();

  // Capture the canvas and set the image source
  const imageDataUrl = captureCanvas();
  const capturedCanvas = document.getElementById('capturedCanvas');
  capturedCanvas.src = imageDataUrl;

  // Show the share modal
  const shareModal = document.getElementById('shareModal');
  shareModal.style.display = 'block';
});




window.onload = function() {
  // let numberOfRounds;
  // do {
  //   numberOfRounds = parseInt(prompt("How many rounds do you want to play? Enter a number between 9 and 15. The standard game lasts roughly 11 rounds."));
  // } while (isNaN(numberOfRounds) || numberOfRounds < 9 || numberOfRounds > 15);
  // roundsLeft = numberOfRounds;
  // instructionText.textContent = `Roll a dice now, ${roundsLeft} rounds left`;

  // let numSheep;
  // do {
  //   numSheep = parseInt(prompt("How many sheep on the board?  Enter a number between 5 and 18. The standard game has 13."));
  // } while (isNaN(numSheep) || numSheep < 5 || numSheep > 18);
  // totalSheep = numSheep;

  // let numBushes;
  // do {
  //   numBushes = parseInt(prompt("How many bushes on the board?  Enter a number between 3 and 10. The standard game has 10."));
  // } while (isNaN(numBushes) || numBushes < 3 || numBushes > 10);
  // totalBushes = numBushes;

  let totalSheep = 13;
  let totalBushes = 7;
  const roundsModal = document.getElementById("roundsModal");
  const submitRounds = document.getElementById("submitRounds");
  const roundsInput = document.getElementById("roundsInput");

  roundsModal.style.display = "block";

  submitRounds.onclick = function() {
    const numberOfRounds = parseInt(roundsInput.value);

    if (isNaN(numberOfRounds) || numberOfRounds < 5 || numberOfRounds > 20) {
      alert("Please enter a valid number of rounds: between 10 and 20.");
      return;
    }

    roundsLeft = numberOfRounds;
    instructionText.textContent = `Roll a dice now, ${roundsLeft} rounds left`;

    const numberOfSheep = parseInt(sheepInput.value);

    if (isNaN(numberOfSheep) || numberOfSheep < 7 || numberOfSheep > 21) {
      alert("Please enter a valid number of sheep: between 7 and 21.");
      return;
    }

    totalSheep = numberOfSheep;


    const numberOfBushes = parseInt(bushesInput.value);

    if (isNaN(numberOfBushes) || numberOfBushes < 5 || numberOfBushes > 15) {
      alert("Please enter a valid number of bushes: between 5 and 15.");
      return;
    }

    totalBushes = numberOfBushes;

    placeSheep(totalSheep);
    colorCellBoundaries(totalBushes); // Call the function after the grid and sheep are drawn

    // Close the modal
    roundsModal.style.display = "none";
  };

  document.getElementById('shareGameLink').addEventListener('click', function(e) {
    e.preventDefault();

    // Capture the canvas and set the image source
    const imageDataUrl = captureCanvas();
    const capturedCanvas = document.getElementById('capturedCanvas');
    capturedCanvas.src = imageDataUrl;

    // Create sharing URLs
    createSharingUrls(imageDataUrl);

    // Show the share modal
    const shareModal = document.getElementById('shareModal');
    shareModal.style.display = 'block';
  });

};

function showOutcome(outcome) {
  for (let i = 1; i <= 6; i++) {
    const rollDiv = document.getElementById(`roll-${i}`);
    if (outcome === i) {
      rollDiv.style.display = 'block';
    } else {
      rollDiv.style.display = 'none';
    }
  }
}

function hideOutcome() {
  for (let i = 1; i <= 6; i++) {
    const rollDiv = document.getElementById(`roll-${i}`);
    rollDiv.style.display = 'none';
  }
}

function drawGrid() {
  ctx.lineWidth = 2;

  for (let i = 0; i <= gridSize; i++) {
    for (let j = 0; j <= gridSize; j++) {
      drawCross(padding + i * cellSize, padding + j * cellSize);
    }
  }
}

function drawCross(x, y) {
  const crossSize = 5;

  ctx.beginPath();
  ctx.moveTo(x - crossSize, y);
  ctx.lineTo(x + crossSize, y);
  ctx.moveTo(x, y - crossSize);
  ctx.lineTo(x, y + crossSize);
  ctx.stroke();
}

function drawBorder(borderType, row, col) {
  ctx.strokeStyle = 'olivedrab';
  ctx.lineWidth = 4;

  switch (borderType) {
    case 'top':
      ctx.beginPath();
      ctx.moveTo(col * cellSize + padding, row * cellSize + padding);
      ctx.lineTo((col + 1) * cellSize + padding, row * cellSize + padding);
      ctx.stroke();
      break;
    case 'right':
      ctx.beginPath();
      ctx.moveTo((col + 1) * cellSize + padding, row * cellSize + padding);
      ctx.lineTo((col + 1) * cellSize + padding, (row + 1) * cellSize + padding);
      ctx.stroke();
      break;
    case 'bottom':
      ctx.beginPath();
      ctx.moveTo(col * cellSize + padding, (row + 1) * cellSize + padding);
      ctx.lineTo((col + 1) * cellSize + padding, (row + 1) * cellSize + padding);
      ctx.stroke();
      break;
    case 'left':
      ctx.beginPath();
      ctx.moveTo(col * cellSize + padding, row * cellSize + padding);
      ctx.lineTo(col * cellSize + padding, (row + 1) * cellSize + padding);
      ctx.stroke();
      break;
  }
}

function placeSheep(totalSheep) {
  const positions = new Set();

  while (positions.size < totalSheep) {
    const row = Math.floor(Math.random() * gridSize);
    const col = Math.floor(Math.random() * gridSize);
    positions.add(`${row}-${col}`);
  }

  positions.forEach(position => {
    const [row, col] = position.split('-').map(Number);
    drawSheep(padding + row * cellSize, padding + col * cellSize);
  });
}

function drawSheep(x, y) {
  const sheepPadding = 10;
  ctx.drawImage(sheepImg, x + sheepPadding, y + sheepPadding, cellSize - sheepPadding * 2, cellSize - sheepPadding * 2);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function colorCellBoundaries(totalBushes) {
  const cellBoundaryCount = totalBushes;
  ctx.strokeStyle = 'indianred';
  ctx.lineWidth = 4;
  ctx.setLineDash([5, 5]); // Add this line to set the line dash pattern


  for (let i = 0; i < cellBoundaryCount; i++) {
    const row = getRandomInt(0, gridSize - 1);
    const col = getRandomInt(0, gridSize - 1);
    const side = getRandomInt(0, 3);

    ctx.beginPath();
    switch (side) {
      case 0: // Top
        ctx.moveTo(padding + col * cellSize, padding + row * cellSize);
        ctx.lineTo(padding + (col + 1) * cellSize, padding + row * cellSize);
        grid[row][col].topVisible = true;
        if (row > 0) grid[row - 1][col].bottomVisible = true;
        break;
      case 1: // Right
        ctx.moveTo(padding + (col + 1) * cellSize, padding + row * cellSize);
        ctx.lineTo(padding + (col + 1) * cellSize, padding + (row + 1) * cellSize);
        grid[row][col].rightVisible = true;
        if (col < gridSize - 1) grid[row][col + 1].leftVisible = true;
        break;
      case 2: // Bottom
        ctx.moveTo(padding + col * cellSize, padding + (row + 1) * cellSize);
        ctx.lineTo(padding + (col + 1) * cellSize, padding + (row + 1) * cellSize);
        grid[row][col].bottomVisible = true;
        if (row < gridSize - 1) grid[row + 1][col].topVisible = true;
        break;
      case 3: // Left
        ctx.moveTo(padding + col * cellSize, padding + row * cellSize);
        ctx.lineTo(padding + col * cellSize, padding + (row + 1) * cellSize);
        grid[row][col].leftVisible = true;
        if (col > 0) grid[row][col - 1].rightVisible = true;
        break;
    }
    ctx.stroke();
  }

  ctx.setLineDash([]); // Add this line to set the line dash pattern

}

function finishgame() {
  instructionText.textContent = 'To play again, just refresh the page :)';
  showWolfImage();
  document.getElementById('rollDiceButton').style.display = 'none';
}

sheepImg.onload = () => {
  drawGrid();
};

function rollDice() {
  if (roundsLeft <= 0) {
    finishgame();
    return;
  }

  outcome = getRandomInt(1, 6);

  // Highlight the corresponding circle
  const highlightedCircle = document.querySelector(`.number-circle:nth-child(${outcome})`);
  highlightedCircle.style.backgroundColor = 'lavender';

  // Change canvas background and disable the Roll Dice button
  canvas.style.backgroundColor = 'rgba(30, 144, 255, 0.42)';
  rollDiceBtn.disabled = true;
  showOutcome(outcome);
  gameState = GameState.chooseFenceOrientation;
  rollDiceBtn.style.backgroundColor = 'grey';

  // Update the instruction text
  instructionText.textContent = `The dice roll gives you a ${outcome}.`;

  const orientationSelect = document.getElementById('orientation-select');
  orientationSelect.style.display = 'block';

}

function resetOrientationAndEnableRollDice() {
  // Enable the Roll Dice button
  rollDiceBtn.disabled = false;
  rollDiceBtn.style.backgroundColor = 'indianred';

  // Reset highlights
  const numberCircles = document.querySelectorAll('.number-circle');
  numberCircles.forEach(circle => {
    circle.style.backgroundColor = 'lightgrey';
  });

  // Hide orientation-select div
  const orientationSelect = document.getElementById('orientation-select');
  orientationSelect.style.display = 'none';

  // Clear selected orientation highlight
  const orientationDivs = document.querySelectorAll('.orientation-option');
  orientationDivs.forEach((opt) => {
    opt.style.backgroundColor = 'lightgray';
  });

  gameState = GameState.rollDice;
  hideOutcome();
  canvas.style.backgroundColor = 'rgba(60, 179, 113, 0.3)';
  rollDiceBtn.disabled = false;
  rollDiceBtn.style.backgroundColor = 'rgba(205, 92, 92, 0.75)';

  // Update the instruction text and decrease the number of rounds left
  roundsLeft--;
  if (roundsLeft > 0) {
    instructionText.textContent = `Roll a dice now, ${roundsLeft} rounds left`;
  } else {
    finishgame();
  }
}

const rollDiceBtn = document.querySelector('.roll-dice-btn');
rollDiceBtn.addEventListener('click', rollDice);

canvas.addEventListener('click', (event) => {
  if (outcome) {
    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;

    const row = Math.floor((y - padding) / cellSize);
    const col = Math.floor((x - padding) / cellSize);

    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
      return;
    }

    handleGridClick(row, col);
  }
});

function handleGridClick(row, col) {
  if (gameState !== GameState.placeFence) {
    if (gameState === GameState.chooseFenceOrientation) {
      alert("Please pick an orientation first.");
    }
    return;
  }

  let valid = false;
  switch (outcome) {
    case 1:
      switch (fenceOrientation) {
        case 0:

          valid = !grid[row][col].topVisible && !grid[row][col].leftVisible && !grid[row][col].bottomVisible;
          if (valid) {
            drawBorder('top', row, col);
            drawBorder('left', row, col);
            drawBorder('bottom', row, col);

            grid[row][col].topVisible = true;
            grid[row][col].leftVisible = true;
            grid[row][col].bottomVisible = true;

            if (row > 0) {
              grid[row - 1][col].bottomVisible = true;
            }
            if (col > 0) {
              grid[row][col - 1].rightVisible = true;
            }
            if (row < gridSize - 1) {
              grid[row + 1][col].topVisible = true;
            }

          }
          break;

        case 90:
          valid = !grid[row][col].rightVisible && !grid[row][col].leftVisible && !grid[row][col].bottomVisible;
          if (valid) {
            drawBorder('right', row, col);
            drawBorder('left', row, col);
            drawBorder('bottom', row, col);

            grid[row][col].rightVisible = true;
            grid[row][col].leftVisible = true;
            grid[row][col].bottomVisible = true;

            if (col < gridSize - 1) {
              grid[row][col + 1].leftVisible = true;
            }
            if (col > 0) {
              grid[row][col - 1].rightVisible = true;
            }
            if (row < gridSize - 1) {
              grid[row + 1][col].topVisible = true;
            }
          }
          break;

        case 180:
          valid = !grid[row][col].rightVisible && !grid[row][col].topVisible && !grid[row][col].bottomVisible;
          if (valid) {
            drawBorder('right', row, col);
            drawBorder('top', row, col);
            drawBorder('bottom', row, col);

            grid[row][col].rightVisible = true;
            grid[row][col].topVisible = true;
            grid[row][col].bottomVisible = true;

            if (row > 0) {
              grid[row - 1][col].bottomVisible = true;
            }
            if (row < gridSize - 1) {
              grid[row + 1][col].topVisible = true;
            }
            if (col < gridSize - 1) {
              grid[row][col + 1].leftVisible = true;
            }
          }
          break;

        case 270:
          valid = !grid[row][col].rightVisible && !grid[row][col].leftVisible && !grid[row][col].topVisible;
          if (valid) {
            drawBorder('right', row, col);
            drawBorder('left', row, col);
            drawBorder('top', row, col);

            grid[row][col].rightVisible = true;
            grid[row][col].leftVisible = true;
            grid[row][col].topVisible = true;


            if (col < gridSize - 1) {
              grid[row][col + 1].leftVisible = true;
            }
            if (col > 0) {
              grid[row][col - 1].rightVisible = true;
            }
            if (row > 0) {
              grid[row - 1][col].bottomVisible = true;
            }
          }
          break;
      }
      break;

    case 2:
      switch (fenceOrientation) {
        case 0:
          valid = col < gridSize - 1 && !grid[row][col].bottomVisible && !grid[row][col + 1].bottomVisible;
          if (valid) {
            drawBorder('bottom', row, col);
            drawBorder('bottom', row, col + 1);

            grid[row][col].bottomVisible = true;
            grid[row][col + 1].bottomVisible = true;

            if (row < gridSize - 1) {
              grid[row + 1][col].topVisible = true;
              grid[row + 1][col + 1].topVisible = true;
            }
          }
          break;

        case 180:
          valid = col < gridSize - 1 && !grid[row][col].topVisible && !grid[row][col + 1].topVisible;
          if (valid) {
            drawBorder('top', row, col);
            drawBorder('top', row, col + 1);

            grid[row][col].topVisible = true;
            grid[row][col + 1].topVisible = true;

            if (row > 0) {
              grid[row - 1][col].bottomVisible = true;
              grid[row - 1][col + 1].bottomVisible = true;
            }
          }
          break;

        case 90:
          valid = row > 0 && !grid[row][col].leftVisible && !grid[row - 1][col].leftVisible;
          if (valid) {
            drawBorder('left', row, col);
            drawBorder('left', row - 1, col);

            grid[row][col].leftVisible = true;
            grid[row - 1][col].leftVisible = true;

            if (col > 0) {
              grid[row][col - 1].rightVisible = true;
              grid[row - 1][col - 1].rightVisible = true;
            }
          }
          break;


        case 270:
          valid = row > 0 && !grid[row][col].rightVisible && !grid[row - 1][col].rightVisible;
          if (valid) {
            drawBorder('right', row, col);
            drawBorder('right', row - 1, col);

            grid[row][col].rightVisible = true;
            grid[row - 1][col].rightVisible = true;

            if (col < gridSize - 1) {
              grid[row][col + 1].leftVisible = true;
              grid[row - 1][col + 1].leftVisible = true;
            }
          }
          break;

      }
      break;

    case 3:
      switch (fenceOrientation) {
        case 0:
          valid = col < gridSize - 1 && !grid[row][col].bottomVisible && !grid[row][col + 1].bottomVisible && !grid[row][col + 1].rightVisible;
          if (valid) {
            drawBorder('bottom', row, col);
            drawBorder('bottom', row, col + 1);
            drawBorder('right', row, col + 1);

            grid[row][col].bottomVisible = true;
            grid[row][col + 1].bottomVisible = true;
            grid[row][col + 1].rightVisible = true;

            if (row < gridSize - 1) {
              grid[row + 1][col].topVisible = true;
              grid[row + 1][col + 1].topVisible = true;
            }
            if (col < gridSize - 2) {
              grid[row][col + 2].leftVisible = true;
            }
          }
          break;

        case 180:
          valid = col < gridSize - 1 && !grid[row][col].topVisible && !grid[row][col].leftVisible && !grid[row][col + 1].topVisible;
          if (valid) {
            drawBorder('top', row, col);
            drawBorder('left', row, col);
            drawBorder('top', row, col + 1);

            grid[row][col].topVisible = true;
            grid[row][col].leftVisible = true;
            grid[row][col + 1].topVisible = true;

            if (row > 0) {
              grid[row - 1][col].bottomVisible = true;
              grid[row - 1][col + 1].bottomVisible = true;
            }
            if (col > 0) {
              grid[row][col - 1].rightVisible = true;
            }
          }
          break;

        case 90:
          valid = row > 0 && !grid[row][col].bottomVisible && !grid[row][col].leftVisible && !grid[row - 1][col].leftVisible;
          if (valid) {
            drawBorder('bottom', row, col);
            drawBorder('left', row, col);
            drawBorder('left', row - 1, col);

            grid[row][col].bottomVisible = true;
            grid[row][col].leftVisible = true;
            grid[row - 1][col].leftVisible = true;

            if (row < gridSize - 1) {
              grid[row + 1][col].topVisible = true;
            }
            if (col > 0) {
              grid[row][col - 1].rightVisible = true;
              grid[row - 1][col - 1].rightVisible = true;
            }
          }
          break;

        case 270:
          valid = row < gridSize - 1 && !grid[row][col].topVisible && !grid[row][col].rightVisible && !grid[row + 1][col].rightVisible;
          if (valid) {
            drawBorder('top', row, col);
            drawBorder('right', row, col);
            drawBorder('right', row + 1, col);

            grid[row][col].topVisible = true;
            grid[row][col].rightVisible = true;
            grid[row + 1][col].rightVisible = true;

            if (row > 0) {
              grid[row - 1][col].bottomVisible = true;
            }
            if (col < gridSize - 1) {
              grid[row][col + 1].leftVisible = true;
              grid[row + 1][col + 1].leftVisible = true;
            }
          }
          break;
      }
      break;

    case 4:
      switch (fenceOrientation) {
        case 0:
          valid = col < gridSize - 1 && !grid[row][col].bottomVisible && !grid[row][col].leftVisible && !grid[row][col + 1].bottomVisible;
          if (valid) {
            drawBorder('bottom', row, col);
            drawBorder('left', row, col);
            drawBorder('bottom', row, col + 1);

            grid[row][col].bottomVisible = true;
            grid[row][col].leftVisible = true;
            grid[row][col + 1].bottomVisible = true;

            if (row < gridSize - 1) {
              grid[row + 1][col].topVisible = true;
              grid[row + 1][col + 1].topVisible = true;
            }
            if (col > 0) {
              grid[row][col - 1].rightVisible = true;
            }
          }
          break;

        case 180:
          valid = col < gridSize - 1 && !grid[row][col].topVisible && !grid[row][col + 1].topVisible && !grid[row][col + 1].rightVisible;
          if (valid) {
            drawBorder('top', row, col);
            drawBorder('top', row, col + 1);
            drawBorder('right', row, col + 1);

            grid[row][col].topVisible = true;
            grid[row][col + 1].topVisible = true;
            grid[row][col + 1].rightVisible = true;

            if (row > 0) {
              grid[row - 1][col].bottomVisible = true;
              grid[row - 1][col + 1].bottomVisible = true;
            }
            if (col < gridSize - 1) {
              grid[row][col + 1].leftVisible = true;
            }
          }
          break;

        case 90:
          valid = row < gridSize - 1 && !grid[row][col].topVisible && !grid[row][col].leftVisible && !grid[row + 1][col].leftVisible;
          if (valid) {
            drawBorder('top', row, col);
            drawBorder('left', row, col);
            drawBorder('left', row + 1, col);

            grid[row][col].topVisible = true;
            grid[row][col].leftVisible = true;
            grid[row + 1][col].leftVisible = true;

            if (col > 0) {
              grid[row][col - 1].rightVisible = true;
              grid[row + 1][col - 1].rightVisible = true;
            }
            if (row > 0) {
              grid[row - 1][col].bottomVisible = true;
            }
          }
          break;

        case 270:
          valid = row > 0 && !grid[row][col].bottomVisible && !grid[row][col].rightVisible && !grid[row - 1][col].rightVisible;
          if (valid) {
            drawBorder('right', row, col);
            drawBorder('right', row - 1, col);
            drawBorder('bottom', row, col);

            grid[row][col].bottomVisible = true;
            grid[row][col].rightVisible = true;
            grid[row - 1][col].rightVisible = true;

            if (col < gridSize - 1) {
              grid[row][col + 1].leftVisible = true;
              grid[row - 1][col + 1].leftVisible = true;
            }
            if (row < gridSize - 1) {
              grid[row + 1][col].topVisible = true;
            }
          }
          break;
      }
      break;

    case 5:
      switch (fenceOrientation) {
        case 0:
        case 180:
          valid = col < gridSize - 1 && !grid[row][col].bottomVisible && !grid[row][col].rightVisible && !grid[row][col + 1].topVisible;
          if (valid) {
            drawBorder('bottom', row, col);
            drawBorder('right', row, col);
            drawBorder('top', row, col + 1);

            grid[row][col].bottomVisible = true;
            grid[row][col].rightVisible = true;
            grid[row][col + 1].topVisible = true;

            if (row < gridSize - 1) {
              grid[row + 1][col].topVisible = true;
            }
            if (col < gridSize - 1) {
              grid[row][col + 1].leftVisible = true;
            }
            if (row > 0) {
              grid[row - 1][col + 1].bottomVisible = true;
            }

          }
          break;

        case 90:
        case 270:
          valid = row < gridSize - 1 && !grid[row][col].leftVisible && !grid[row][col].bottomVisible && !grid[row + 1][col].rightVisible;
          if (valid) {
            drawBorder('left', row, col);
            drawBorder('bottom', row, col);
            drawBorder('right', row + 1, col);

            grid[row][col].leftVisible = true;
            grid[row][col].bottomVisible = true;
            grid[row + 1][col].rightVisible = true;

            if (row < gridSize - 1) {
              grid[row + 1][col].topVisible = true;
            }

            if (col > 0) {
              grid[row][col - 1].rightVisible = true;
            }

            if (col < gridSize - 1) {
              grid[row + 1][col + 1].leftVisible = true;
            }

          }
          break;
      }
      break;

    case 6:
      switch (fenceOrientation) {
        case 0:
        case 180:
          valid = col < gridSize - 1 && !grid[row][col].topVisible && !grid[row][col].rightVisible && !grid[row][col + 1].bottomVisible;
          if (valid) {
            drawBorder('top', row, col);
            drawBorder('right', row, col);
            drawBorder('bottom', row, col + 1);

            grid[row][col].topVisible = true;
            grid[row][col].rightVisible = true;
            grid[row][col + 1].bottomVisible = true;

            if (row > 0) {
              grid[row - 1][col].bottomVisible = true;
            }

            if (col < gridSize - 1) {
              grid[row][col + 1].leftVisible = true;
            }

            if (row < gridSize - 1) {
              grid[row + 1][col + 1].topVisible = true;
            }
          }
          break;

        case 90:
        case 270:
          valid = row < gridSize - 1 && !grid[row][col].rightVisible && !grid[row][col].bottomVisible && !grid[row + 1][col].leftVisible;
          if (valid) {
            drawBorder('right', row, col);
            drawBorder('bottom', row, col);
            drawBorder('left', row + 1, col);

            grid[row][col].rightVisible = true;
            grid[row][col].bottomVisible = true;
            grid[row + 1][col].leftVisible = true;

            if (row < gridSize - 1) {
              grid[row + 1][col].topVisible = true;
            }

            if (col > 0) {
              grid[row + 1][col - 1].rightVisible = true;
            }

            if (col < gridSize - 1) {
              grid[row][col + 1].leftVisible = true;
            }

          }
          break;
      }
      break;

  }


  // Move to next state and update instruction text
  if (valid) {
    gameState = GameState.rollDice;
    resetOrientationAndEnableRollDice();
  }
}

let fenceOrientation;
const orientationOptions = document.querySelectorAll('.orientation-option');
orientationOptions.forEach((option) => {
  option.addEventListener('click', function() {
    if (gameState === GameState.chooseFenceOrientation) {
      orientationOptions.forEach((opt) => {
        opt.style.backgroundColor = 'lightgrey';
      });
      option.style.backgroundColor = 'burlywood';
      fenceOrientation = parseInt(option.getAttribute('data-value'));
      gameState = GameState.placeFence;
    }
  });
});
document.querySelector("#passround").addEventListener("click", function() {
  gameState = GameState.rollDice;
  resetOrientationAndEnableRollDice();
});


const instructionsLink = document.getElementById('instructions-link');
const instructionsModal = document.getElementById('instructions-modal');
const closeinstructionsModal = document.getElementById('closeinstructions');

instructionsLink.addEventListener('click', () => {
  instructionsModal.style.display = 'block';
});

closeinstructionsModal.addEventListener('click', () => {
  instructionsModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === instructionsModal) {
    instructionsModal.style.display = 'none';
  }
});


const fenceLink = document.getElementById('fence-link');
const fenceModal = document.getElementById('fence-modal');
const closefenceModal = document.getElementById('closefence');

fenceLink.addEventListener('click', () => {
  fenceModal.style.display = 'block';
});

closefenceModal.addEventListener('click', () => {
  fenceModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === fenceModal) {
    fenceModal.style.display = 'none';
  }
});


const creditsLink = document.getElementById('credits-link');
const creditsModal = document.getElementById('credits-modal');
const closecreditsModal = document.getElementById('closecredits');

creditsLink.addEventListener('click', () => {
  creditsModal.style.display = 'block';
});

closecreditsModal.addEventListener('click', () => {
  creditsModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === creditsModal) {
    creditsModal.style.display = 'none';
  }
});

function showWolfImage() {
  const wolfImage = document.getElementById('gameover');
  wolfImage.style.display = 'block';
}

function showShareButton() {

  const shareModal = document.getElementById("share-modal");
  shareModal.style.display = "block";

  // Capture the screenshot
  html2canvas(document.querySelector("#game-canvas")).then(canvas => {
    // Convert the canvas to a data URL
    const imgData = canvas.toDataURL('image/png');

    // Create a PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);

    // Display the PDF in the modal
    const pdfContainer = document.getElementById("pdf-container");
    pdfContainer.innerHTML = `<embed src="${pdf.output('dataurl')}" width="100%" height="800px"/>`;
  });
}
