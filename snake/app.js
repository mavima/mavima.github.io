document.addEventListener('DOMContentLoaded', () => {
  const squares = document.querySelectorAll('.grid div')
  const scoreDisplay = document.querySelector('span')
  const startBtn = document.querySelector('.start')
  const gameover = document.querySelector('.gameover')
  const sound = document.querySelector('#sound')
  const endSound = document.querySelector('#end')

  const width = 10
  let currentIndex = 0 // first div of the grid
  let appleIndex = 0 // first div of the grid
  let currentSnake = [2,1,0] //div 2 in the grid is the head, div 0 the tail, all the 1s is the body
  let direction = 1
  let score = 0
  let speed = 0.9
  let intervalTime = 0
  let interval = 0

  // function to start and restart
  function startGame() {
    currentSnake.forEach(index => squares[index].classList.remove('snake'))
    squares[appleIndex].classList.remove('apple')
    clearInterval(interval)
    score = 0
    randomApple()
    direction = 1
    scoreDisplay.innerText = score
    gameover.innerText = ''
    intervalTime = 1000
    currentSnake = [2,1,0]
    currentIndex = 0
    currentSnake.forEach(index => squares[index].classList.add('snake'))
    interval = setInterval(moveOutcomes, intervalTime)
  }

  // function to deal with all the move outcomes of the snake
  function moveOutcomes() {
    console.log(currentSnake[0])

    // snake hitting border or self
    if (
      // snake hits bottom
      (currentSnake[0] + width >= (width * width) && direction === width) ||
      // snake hits right wall
      (currentSnake[0] % width === width -1 && direction === 1) ||
      // snake hits left wall
      (currentSnake[0] % width === 0 && direction === -1) ||
      // snake hits the top
      (currentSnake[0] - width < 0 && direction === -width) ||
      //snake hits itself
      squares[currentSnake[0] + direction].classList.contains('snake')
      ) {
      gameover.innerText="Game over 👻"
      gameover.classList.add('visible')
      playEnd()
      return clearInterval(interval)
    }

    const tail = currentSnake.pop() //picks and removes the last item of the array
    squares[tail].classList.remove('snake')
    currentSnake.unshift(currentSnake[0] + direction) // gives direction to the head

    // snake getting apple

    if(squares[currentSnake[0]].classList.contains('apple')) {
      squares[currentSnake[0]].classList.remove('apple')
      squares[tail].classList.add('snake')
      currentSnake.push(tail)
      playSound()
      randomApple()
      score++
      scoreDisplay.textContent = score
      clearInterval(interval)
      intervalTime = intervalTime * speed
      interval = setInterval(moveOutcomes, intervalTime)
    }
    squares[currentSnake[0]].classList.add('snake')
  }

  // generate new apple once the previous has been eaten

  function randomApple() {
    do{
      appleIndex = Math.floor(Math.random() * squares.length)
    } while(squares[appleIndex].classList.contains('snake'))
    squares[appleIndex].classList.add('apple')
  }


  // functions for keycodes
  function control(e) {
    squares[currentIndex].classList.remove('snake')
    if (e.keyCode === 39) { // right
      direction = 1
    } else if (e.keyCode === 38) { // up
      direction = -width // snake will go back ten divs appearing to go up
    } else if (e.keyCode === 37 ) { // left
        direction = -1
    } else if (e.keyCode === 40) { // ten divs forward looking like down
        direction = +width
    }
  }

  function playSound(url) {
    sound.play()
  }

  function playEnd(url) {
    endSound.play()
  }

  document.addEventListener('keyup', control)
  startBtn.addEventListener('click', startGame)

})
