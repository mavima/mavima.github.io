document.addEventListener( 'DOMContentLoaded', () => {


const grid_width = 10
const grid_height = 20
const grid_size = grid_width * grid_height

const grid = createGrid()
let squares = Array.from(grid.querySelectorAll('div'))
const width = 10
const height = 20
const start = document.querySelector('#start-btn')
const scoreDisplay = document.querySelector('.score-display')
const linesDisplay = document.querySelector('.lines-display')
const info = document.querySelector('.info')
const instructions = document.querySelector('.instructions')

let currentIndex = 0
let currentRotation = 0
let currentPosition = 4
let nextRandom = 0
let timerId
let score = 0
let lines = 0

function createGrid() {
  // main grid
  let grid = document.querySelector('.grid')
  for (let i=0; i<grid_size; i++) {
    let gridElement = document.createElement('div')
    gridElement.setAttribute('class', 'block0')
    grid.appendChild(gridElement)
  }

  // set base of grid
  for (let i = 0; i < grid_width; i++) {
    let gridElement = document.createElement('div')
    gridElement.setAttribute('class', 'block3')
    grid.appendChild(gridElement)
  }
  return grid
}

// functions to keycodes
function control(e) {
  if(e.keyCode === 39) {
    moveRight()
  } else if (e.keyCode === 38) {
    rotate()
  } else if (e.keyCode === 37) {
    moveLeft()
  } else if (e.keyCode === 40) {
    moveDown()
  }
}

document.addEventListener('keydown', control)

// the tetrominoes

const lTetromino = [
  [1, grid_width+1, grid_width*2+1, 2],
  [grid_width, grid_width+1, grid_width+2, grid_width*2+2],
  [1, grid_width+1, grid_width*2+1, grid_width*2],
  [grid_width, grid_width*2, grid_width*2+1, grid_width*2+2]
]

const zTetromino = [
  [0, grid_width, grid_width+1, grid_width*2+1],
  [grid_width+1, grid_width+2, grid_width*2, grid_width*2+1],
  [0, grid_width, grid_width+1, grid_width*2+1],
  [grid_width+1, grid_width+2, grid_width*2, grid_width*2+1]
]

const tTetromino = [
  [1, grid_width, grid_width+1, grid_width+2],
  [1, grid_width+1, grid_width+2, grid_width*2+1],
  [grid_width, grid_width+1, grid_width+2, grid_width*2+1],
  [1, grid_width, grid_width+1, grid_width*2+1]
]

const oTetromino = [
  [0, 1, grid_width, grid_width+1],
  [0, 1, grid_width, grid_width+1],
  [0, 1, grid_width, grid_width+1],
  [0, 1, grid_width, grid_width+1]
]

const iTetromino = [
  [1, grid_width+1, grid_width*2+1, grid_width*3+1],
  [grid_width, grid_width+1, grid_width+2, grid_width+3],
  [1, grid_width+1, grid_width*2+1, grid_width*3+1],
  [grid_width, grid_width+1, grid_width+2, grid_width+3]
]

const tetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]


// select tetromino randomly
let random = Math.floor(Math.random()*tetrominoes.length) // the number of tetromino chosen for this round
let current = tetrominoes[random][currentRotation] // array that makes the shape of the tetromino currently
let tetro1 = tetrominoes[random][0]
let tetro2 = tetrominoes[random][1]
let tetro3 = tetrominoes[random][2]
let tetro4 = tetrominoes[random][3]
// let currentPossibilities = []
// currentPossibilities.push(...tetro1, ...tetro2, ...tetro3, ...tetro4)

// draw the shape
function draw() {
  current.forEach( index => (
    squares[currentPosition + index].classList.add('block')
  ))
}

// undraw the shape
function undraw() {
  current.forEach( index => (
    squares[currentPosition + index].classList.remove('block')
  ))
}

// move the shape down
function moveDown() {
  undraw()
  currentPosition = currentPosition += width
  draw()
  freeze()
}

// move right and left and prevent collisions
function moveRight() {
  undraw()
  const atRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
  if(!atRightEdge) currentPosition += 1
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
      currentPosition -=1
    }
  draw()
}

function moveLeft() {
  undraw()
  const atLeftEdge = current.some(index => (currentPosition + index) % width === 0)
  if(!atLeftEdge) currentPosition -= 1
  if(current.some(index => squares[currentPosition + index].classList.contains('block'))) {
    currentPosition += 1
  }
  draw()
}

// rotate Tetromino
function rotate() {
  // check if there is room also after the rotate
  let nextCurrent = []
  if (currentRotation <= 2) {
    nextCurrent = tetrominoes[random][currentRotation + 1]
  } else {
    nextCurrent = tetrominoes[random][0]
  }
  let Edge = nextCurrent.some(index => (currentPosition + index) % width === width - 1) && nextCurrent.some(index => (currentPosition + index) % width === 0)

  if(!Edge) {
    undraw()
    currentRotation ++
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = tetrominoes[random][currentRotation]
    draw()
  }
}

draw()


// freeze the shape if it touches the bottom line or previous fallen shapes
function freeze() {
  if (current.some(index => squares[currentPosition + index + width].classList.contains('block3')
      || squares[currentPosition + index + width].classList.contains('block2'))) {
    current.forEach(index => squares[index + currentPosition].classList.add('block2'))
    // send a new tetromino
    random = nextRandom
    nextRandom = Math.floor(Math.random() * tetrominoes.length)
    current = tetrominoes[random][currentRotation]
    currentPosition = 4
    draw()
    displayShape()
    gameOver()
    addScore()
  }
}
freeze()


// show previous tetromino in displaySquares
const displayWidth = 4
const displaySquares = document.querySelectorAll('.previous-grid div')
let displayIndex = 0

const smallTetrominoes = [
  [1, displayWidth + 1, displayWidth * 2 + 1, 2], /* L-tetro */
  [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], /* Z-tetro */
  [1, displayWidth, displayWidth + 1, displayWidth + 2], /* T-tetro */
  [0, 1, displayWidth, displayWidth + 1], /* O-tetro */
  [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] /* I-tetro */
]

function displayShape() {
  displaySquares.forEach(square => {
    square.classList.remove('block')
  })
  smallTetrominoes[nextRandom].forEach( index => {
    displaySquares[displayIndex + index].classList.add('block')
  })
}

start.addEventListener('click', () => {
  // instructions.classList.add('hide')
  // info.classList.remove('hide')
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  } else {
    undraw()
    draw()
    timerId = setInterval(moveDown, 1000)
    nextRandom = Math.floor(Math.random() * tetrominoes.length)
    displayShape()
  }
})

function gameOver() {
  if(current.some
    (index => squares[currentPosition + index].classList.contains('block2'))) {
    scoreDisplay.innerHTML = 'Game over'
    clearInterval(timerId)
  }
}

function addScore() {
  for (currentIndex = 0; currentIndex < 199; currentIndex += width) {
    const row = [currentIndex, currentIndex + 1, currentIndex + 2, currentIndex + 3, currentIndex + 4, currentIndex + 5, currentIndex + 6, currentIndex + 7, currentIndex + 8, currentIndex + 9]
    if(row.every(index => squares[index].classList.contains('block2'))) {
      score += 10
      lines += 1
      scoreDisplay.innerHTML = score
      linesDisplay.innerHTML = lines
      row.forEach(index => {
        squares[index].classList.remove('block2') || squares[index].classList.remove('block')
      })
      // splice array
      const squaresRemoved = squares.splice(currentIndex, width)
      squares = squaresRemoved.concat(squares)
      squares.forEach(cell => grid.appendChild(cell))
    }

  }
}

})
