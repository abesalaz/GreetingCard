//Variables
let hexRadius = 40;
let hexWidth = hexRadius * Math.sqrt(3);
let hexHeight = hexRadius * 2;
let yOffset = hexRadius * 1.5;
let fadeAmount = 5; 
let alphaValues = []; // Array to store alpha values for each hexagon
let numRows = 15;
let numCols = 15;

let smallHexAlpha1 = 1; // Alpha value for the first smaller hexagon
let smallHexAlpha2 = 1; // Alpha value for the second smaller hexagon

let minAlphaThreshold = 10;

let bees = []; // Array to store bee objects
let numBees = 0; // Number of bees currently on the canvas

function setup() {
  createCanvas(800,800);
  initializeAlphaValues(numRows, numCols);
  drawHoneyComb(numRows, numCols);
  
  // Generate a random number of bees initially
  generateRandomBees();
}

function draw() {
  background('#ab9307'); // Clear the canvas
  
  updateAlphaValues();
  
  // Redraw the honeycomb with updated alpha values for the randomly chosen hexagon and smaller hexagons
  drawHoneyComb(numRows, numCols);
  
  // Move and display bees
  for (let i = bees.length - 1; i >= 0; i--) {
    bees[i].move();
    bees[i].display();
    if (bees[i].reachedEdge()) {
      bees.splice(i, 1); // Remove bee if it reaches the edge
      numBees--; 
    }
  }
  
  if (numBees === 0) {
    generateRandomBees();
  }
  
  drawText();
  
}

function drawText(){
  // Add background box
  textFont('Arial');
  let textContent = "I'll BEE seeing you soon!";
  let textSizeValue = 48; // Adjust the size of the text
  let textWidthValue = textWidth(textContent);
  let textHeightValue = textAscent() + textDescent(); // Calculate text height
  let boxPadding = 10; 
  let boxWidth = textWidthValue + 1 * boxPadding;
  let boxHeight = textHeightValue + 1 * boxPadding;
  let boxX = (width - boxWidth) / 2; //Center box
  let boxY = height - boxHeight - 20; 
  fill('#947f0f'); 
  rect(boxX, boxY, boxWidth, boxHeight); // Rounded rectangle

  let textX = (width - textWidthValue) / 2; // Center the text horizontally
  let textY = boxY + (boxHeight + textHeightValue) / 2; // Center vertically

  // Add text inside the background box
  fill(255); // Set text color to white
  textSize(textSizeValue);
  text(textContent, textX, textY);
}

function updateAlphaValues() {
  // Update alpha values for the randomly chosen hexagon
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (alphaValues[i][j] <= 0 || alphaValues[i][j] >= 255) {
        fadeAmount *= -1; // Reverse the fade direction if the alpha value reaches its limit
      }
      alphaValues[i][j] += fadeAmount; // Increment the alpha value
    }
  }
}

function initializeAlphaValues(rows, cols) {
  // Initialize alpha values for each hexagon
  for (let i = 0; i < rows; i++) {
    alphaValues[i] = [];
    for (let j = 0; j < cols; j++) {
      alphaValues[i][j] = 0;
    }
  }
}

function drawHoneyComb(rows, cols){
  for (let i = 1; i < rows - 2; i++) {
    for (let j = 1; j < cols - 1; j++) {
      let x = j * hexWidth * 0.75;
      let y = i * yOffset;
      if (j % 2 === 1) {
        y += yOffset / 2;
      }

      drawHexagonAtPosition(i, j, alphaValues[i][j]);
    }
  }
}

function drawHexagonAtPosition(row, col, alpha) {
  let x = col * hexWidth * 0.75;
  let y = row * yOffset;
  if (col % 2 === 1) {
    y += yOffset / 2;
  }

  // If alpha is above minimum threshold, draw the hexagon
  if (alpha > minAlphaThreshold) {
    let fillColor = color(255, 215, 0, alpha); // Include alpha value
    fill(fillColor);
    drawHexagon(x, y);
    
    // Draw smaller hexagons inside with the same alpha
    let smallerHexRadius = hexRadius * 0.8;
    let smallerFillColor = color(255, 255, 0, alpha); // Include alpha value
    fill(smallerFillColor);
    drawHexagon(x, y, smallerHexRadius);
    
    smallerHexRadius = hexRadius * 0.7;
    smallerFillColor = color(255, 215, 0, alpha); // Include alpha value
    fill(smallerFillColor);
    drawHexagon(x, y, smallerHexRadius);
    
    smallerHexRadius = hexRadius * 0.6;
    smallerFillColor = color(255, 255, 0, alpha); // Include alpha value
    fill(smallerFillColor);
    drawHexagon(x, y, smallerHexRadius);
    
    smallerHexRadius = hexRadius * 0.2;
    smallerFillColor = color(255, 215, 0, alpha); // Include alpha value
    fill(smallerFillColor);
    drawHexagon(x, y, smallerHexRadius);
  }
}

// Function to gradually decrease alpha value until it reaches minimum threshold
function decreaseAlpha(row, col) {
  if (alphaValues[row][col] > minAlphaThreshold) {
    alphaValues[row][col] -= fadeAmount;
  }
}
function drawHexagon(x, y, radius) {
  if (!radius) {
    radius = hexRadius;
  }
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let xOffset = cos(angle) * radius;
    let yOffset = sin(angle) * radius;
    vertex(x + xOffset, y + yOffset);
  }
  endShape(CLOSE);
}

function generateRandomBees() {
  // Generate a random number of bees (between 1 and 3)
  numBees = floor(random(8, 15));
  
  // Spawn bees on the center hex of random hexagons
  for (let i = 0; i < numBees; i++) {
    let randomRow = floor(random(1, numRows - 5));
    let randomCol = floor(random(1, numCols - 1));
    let x = randomCol * hexWidth * 0.75 + hexWidth / 2;
    let y = randomRow * yOffset + hexHeight / 2;
    bees.push(new Bee(x, y));
  }
}

class Bee {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = random(1, 2);
    this.amplitude = random(4, 5);
    this.angle = 0;
    this.direction = random() < 0.5 ? 1 : -1; // 1 for left to right, -1 for right to left
  }

  moveLeftToRight() {
    // Move bee from left to right horizontally
    this.x += this.speed;

    // Move bee vertically in a wider sinewave pattern
    this.y = this.y + sin(this.angle) * this.amplitude;
    this.angle += 0.05; // Increase the angle increment for a wider wave
  }

  moveRightToLeft() {
    // Move bee from right to left horizontally
    this.x -= this.speed;

    // Move bee vertically in a wider sinewave pattern
    this.y = this.y + sin(this.angle) * this.amplitude;
    this.angle += 0.05; // Increase the angle increment for a wider wave
  }

  move() {
    // Randomly choose whether to move left to right or right to left
    if (this.direction === 1) {
      this.moveLeftToRight();
    } else {
      this.moveRightToLeft();
    }
  }

  display() {
    // Draw bee body
    fill(255, 255, 0); // Yellow color
    stroke(0); // Black outline
    strokeWeight(2);
    ellipse(this.x, this.y, 20, 20); // Bee body
    fill(139, 69, 19); // Brown color
    noStroke();
    ellipse(this.x, this.y, 10, 10); // Brown stripe

    // Draw bee wings
    fill(255, 255, 255, 150); // Semi-transparent white for wings
    noStroke();
    ellipse(this.x - 10, this.y - 5, 10, 15); // Left wing
    ellipse(this.x + 10, this.y - 5, 10, 15); // Right wing
  }

  reachedEdge() {
    // Check if bee reached the edge of the canvas
    return this.x < 0 || this.x > width;
  }
}