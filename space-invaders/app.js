
document.addEventListener('DOMContentLoaded', () => {
  const replay = document.querySelector('#start-btn')
  const squares = document.querySelectorAll('.grid div')
  const resultDisplay = document.querySelector('#result')
  const finalResult = document.querySelector('#end')
  const bang = document.querySelector('#bang')
  const explosion = document.querySelector('#expl')
  const tada = document.querySelector('#tada')
  const instruction = document.querySelector('.instructions')

  let width = 15
  let currentShooterIndex = 202
  let currentInvaderIndex = 0
  let shotInvaders = []
  let result = 0
  let direction = 1
  let goingRight = true
  let invaderId
  let laserId
  let interval = 0


    function shootingNoise(url) {
      bang.play()
    }

    function explosionSound(url) {
      explosion.play()
    }

    function victory(url) {
      tada.play()
    }

  // define the invaders
  let alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39
  ]

  function startGame() {
    alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39
  ]
    squares.forEach((square) => {
      square.classList.remove('invader')
    })
    squares.forEach((square) => {
      square.classList.remove('shooter')
    })
    squares.forEach((square) => {
      square.classList.remove('boom')
    })
    clearInterval(invaderId)
    clearInterval(laserId)
    instruction.classList.add('hide')
    resultDisplay.textContent = ''
    finalResult.textContent = ''
    result = 0
    direction = 1
    goingRight = true
    shotInvaders = []
    // draw the shooter
    squares[currentShooterIndex].classList.add('shooter')
    // draw the invaders
    invade()
    invaderId = setInterval(moveInvaders, 500)
    replay.classList.add('hide')
    replay.blur()
    document.addEventListener('keyup',shoot)
  }
    document.addEventListener('keydown', moveShooter)
    document.addEventListener('keyup',shoot)
    replay.addEventListener('click', startGame)

  function invade() {
    for (let i = 0; i < alienInvaders.length; i++) {
      if(!shotInvaders.includes(i)) {
        squares[alienInvaders[i]].classList.add('invader')
      }
    }
  }

  function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
      squares[alienInvaders[i]].classList.remove('invader')
    }
  }

  // move the shooter along a line
  function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter')
    switch(e.keyCode) {
      case 37:
      // is divisible by width (15) and leaves a remainder -> can move left
        if(currentShooterIndex % width !== 0) currentShooterIndex -= 1
        break
      case 39:
      // is divisible by width and less than 14 -> can move right
        if(currentShooterIndex % width < width -1) currentShooterIndex += 1
          break
    }
    squares[currentShooterIndex].classList.add('shooter')
  }

  // move the invaders
  function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length -1] % width === width - 1
    remove()


    if (rightEdge && goingRight) {
      for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += width + 1
        direction = -1
        goingRight = false
      }
    }

    if (leftEdge && !goingRight) {
      for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += width - 1
        direction = 1
        goingRight = true
      }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += direction
    }

    invade()


    // game over
    if(squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
      finalResult.textContent = "Game over 👽"
      replay.classList.remove('hide')
      squares[currentShooterIndex].classList.add('boom')
      clearInterval(invaderId)
      document.removeEventListener('keyup', shoot)
    }

    for (let i = 0; i <= alienInvaders.length -1; i++) {
      if (alienInvaders[i] > (squares.length - (width-1))) {
        finalResult.textContent="Game over 👽"
        replay.classList.remove('hide')
        clearInterval(invaderId)
        document.removeEventListener('keyup', shoot)
      }
    }

    // decide a win
    if (shotInvaders.length === alienInvaders.length) {
      finalResult.textContent = 'You win! 🌟'
      victory()
      replay.classList.remove('hide')
      clearInterval(invaderId)
    }

  }



  // shoot at invaders
  function shoot(e) {
    let laserId
    let currentLaserIndex = currentShooterIndex
    if (event.keyCode === 32) {
      // move laser from shooter upwards
      function moveLaser() {
        squares[currentLaserIndex].classList.remove('laser')
        currentLaserIndex -= width // one row up
        squares[currentLaserIndex].classList.add('laser')
        if(squares[currentLaserIndex].classList.contains('invader')) {
          explosionSound()
          squares[currentLaserIndex].classList.remove('laser')
          squares[currentLaserIndex].classList.remove('invader')
          squares[currentLaserIndex].classList.add('boom')

          setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 400)
          clearInterval(laserId)

          const shotAlien = alienInvaders.indexOf(currentLaserIndex)
          shotInvaders.push(shotAlien)
          result ++
          resultDisplay.textContent = result
        }
        if(currentLaserIndex < width) {
          clearInterval(laserId)
          setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100)
        }
      }
      laserId = setInterval(moveLaser, 100)
      shootingNoise()
    }
  }
})
