document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.grid div')
    const timeLeft = document.querySelector('#time-left')
    const result = document.querySelector('#result')
    const startBtn = document.querySelector('#button')
    const carsLeft = document.querySelectorAll('.car-left')
    const carsRight = document.querySelectorAll('.car-right')
    const logsLeft = document.querySelectorAll('.log-left')
    const logsRight = document.querySelectorAll('.log-right')
    const width = 9
    const buttonLeft = document.querySelector('.left')
    const buttonRight = document.querySelector('.right')
    const buttonUp = document.querySelector('.up')
    const buttonDown = document.querySelector('.down')
    const jumpSound = document.querySelector('#jumping')
    const winSound = document.querySelector('#winning')
    const loseSound = document.querySelector('#losing')
    let currentIndex = 6
    let currentTime = 20
    let timerId
    let steps = 0
  
    // render frog on starting block
    squares[currentIndex].classList.add('frog')
    // move frog
    function moveFrog(e) {
      squares[currentIndex].classList.remove('frog', 'frog-left')
      switch(e.keyCode) {
        case 37: // left if not in the first column
          if (currentIndex % width != 0) currentIndex -= 1
          break
        case 38: // up if not on the first line
          if (currentIndex - width >= 0) currentIndex -= width
          break
        case 39: // right if not in the last column
          if (currentIndex % width < width -1) currentIndex += 1
          break
        case 40: // down if not on the last line
          if (currentIndex + width < width * width) currentIndex += width
          break
      }
      squares[currentIndex].classList.add('frog')
      if (steps % 2 !== 0) {
        squares[currentIndex].classList.add('frog-left')
      } else {
        squares[currentIndex].classList.remove('frog-left')
      }
      lose()
      win()
      jumpingSound()
      steps += 1
    }
  
  
    function moveFrogMobileLeft(e) {
      squares[currentIndex].classList.remove('frog')
      if (currentIndex % width != 0) currentIndex -= 1
        squares[currentIndex].classList.add('frog')
      lose()
      win()
      jumpingSound()
    }
  
    function moveFrogMobileUp(e) {
      squares[currentIndex].classList.remove('frog')
      if (currentIndex - width >= 0) currentIndex -= width
        squares[currentIndex].classList.add('frog')
      lose()
      win()
      jumpingSound()
    }
  
    function moveFrogMobileRight(e) {
      squares[currentIndex].classList.remove('frog')
      if (currentIndex % width < width -1) currentIndex += 1
        squares[currentIndex].classList.add('frog')
      lose()
      win()
      jumpingSound()
    }
  
    function moveFrogMobileDown(e) {
      squares[currentIndex].classList.remove('frog')
      if (currentIndex + width < width * width) currentIndex += width
        squares[currentIndex].classList.add('frog')
      lose()
      win()
      jumpingSound()
    }
    
  
  
  
    // set cars in movement
    function autoMoveCars() {
      carsLeft.forEach(carLeft => moveCarLeft(carLeft))
      carsRight.forEach(carRight => moveCarRight(carRight))
    }
  
    // move a car left and right
    function moveCarLeft(carLeft) {
      switch (true) {
        case carLeft.classList.contains('c1-left'):
          carLeft.classList.remove('c1-left')
          carLeft.classList.add('c2')
          break
        case carLeft.classList.contains('c2'):
          carLeft.classList.remove('c2')
          carLeft.classList.add('c3')
          break
        case carLeft.classList.contains('c3'):
          carLeft.classList.remove('c3')
          carLeft.classList.add('c1-left')
          break
      }
      if (carLeft.classList.contains('c1-left') && carLeft.classList.contains('frog')
        ) { losingActions() }
    }
  
    function moveCarRight(carRight) {
      switch (true) {
        case carRight.classList.contains('c1-right'):
          carRight.classList.remove('c1-right')
          carRight.classList.add('c3')
          break
        case carRight.classList.contains('c2'):
          carRight.classList.remove('c2')
          carRight.classList.add('c1-right')
          break
        case carRight.classList.contains('c3'):
          carRight.classList.remove('c3')
          carRight.classList.add('c2')
          break
      }
      // frog is waiting when car arrives
      if (carRight.classList.contains('c1-right') && carRight.classList.contains('frog')
        ) {
        losingActions() }
    }
  
      // set logs in movement
    function autoMoveLogs() {
      logsLeft.forEach(logLeft => moveLogLeft(logLeft))
      logsRight.forEach(logRight => moveLogRight(logRight))
    }
  
  
      // move a log left and right
    function moveLogLeft(logLeft) {
      switch (true) {
        case logLeft.classList.contains('l1'):
          logLeft.classList.remove('l1')
          logLeft.classList.add('l2')
          break
        case logLeft.classList.contains('l2'):
          logLeft.classList.remove('l2')
          logLeft.classList.add('l3')
          break
        case logLeft.classList.contains('l3'):
          logLeft.classList.remove('l3')
          logLeft.classList.add('l4')
          break
        case logLeft.classList.contains('l4'):
          logLeft.classList.remove('l4')
          logLeft.classList.add('l5')
          break
        case logLeft.classList.contains('l5'):
          logLeft.classList.remove('l5')
          logLeft.classList.add('l1')
          break
      }
      // frog stays on the log when it crosses the border
      if ((logLeft.classList.contains('l4') && logLeft.classList.contains('frog'))
          || ((logLeft.classList.contains('l5') && logLeft.classList.contains('frog')))
        )
       { losingActions() }
    }
  
  
    function moveLogRight(logRight) {
      switch (true) {
        case logRight.classList.contains('l1'):
          logRight.classList.remove('l1')
          logRight.classList.add('l5')
          break
        case logRight.classList.contains('l2'):
          logRight.classList.remove('l2')
          logRight.classList.add('l1')
          break
        case logRight.classList.contains('l3'):
          logRight.classList.remove('l3')
          logRight.classList.add('l2')
          break
        case logRight.classList.contains('l4'):
          logRight.classList.remove('l4')
          logRight.classList.add('l3')
          break
        case logRight.classList.contains('l5'):
          logRight.classList.remove('l5')
          logRight.classList.add('l4')
          break
      }
      if ((logRight.classList.contains('l4') && logRight.classList.contains('frog'))
        || ((logRight.classList.contains('l5') && logRight.classList.contains('frog')))
      ) { losingActions() }
    }
  
    // move the frog with the log
    function moveWithLogLeft() {
      if (currentIndex > 53 && currentIndex < 62) {
        squares[currentIndex].classList.remove('frog', 'frog-left')
        currentIndex += 1
        squares[currentIndex].classList.add('frog')
      }
    }
  
      function moveWithLogRight() {
      if (currentIndex > 45 && currentIndex < 54) {
        squares[currentIndex].classList.remove('frog', 'frog-left')
        currentIndex -= 1
        squares[currentIndex].classList.add('frog')
      }
    }
  
  
  
    // rules to win
  function win() {
    if (squares[76].classList.contains('frog')) {
      winningSound()
      result.innerHTML = 'Yippee!'
      squares[currentIndex].classList.remove('frog', 'frog-left')
      squares[currentIndex].classList.add('victory')
      clearInterval(timerId)
      document.removeEventListener('keyup', moveFrog)
      buttonLeft.removeEventListener('click', moveFrogMobileLeft);
      buttonUp.removeEventListener('click', moveFrogMobileUp);
      buttonRight.removeEventListener('click', moveFrogMobileRight);
      buttonDown.removeEventListener('click', moveFrogMobileDown);
    }
  }
  
  function losingActions() {
      document.removeEventListener('keyup', moveFrog)
      buttonLeft.removeEventListener('click', moveFrogMobileLeft);
      buttonUp.removeEventListener('click', moveFrogMobileUp);
      buttonRight.removeEventListener('click', moveFrogMobileRight);
      buttonDown.removeEventListener('click', moveFrogMobileDown);
      losingSound()
      result.innerHTML = 'Game Over!'
      squares[currentIndex].classList.remove('frog', 'frog-left')
      squares[currentIndex].classList.add('dead')
  
      setTimeout(() => {
        squares.forEach((square) => {
          square.classList.remove('frog', 'frog-left')
        })
      }
      , 100)
      clearInterval(timerId)
  }
  
  // rules to lose
  function lose() {
      if ((squares[currentIndex].classList.contains('c1-left')) // car
      || (squares[currentIndex].classList.contains('c1-right')) // car
      || (squares[currentIndex].classList.contains('l5')) // river
      || (squares[currentIndex].classList.contains('l4')) // river
      ) {
      losingActions()
    }
  }
  
  // function to move all pieces
  function movePieces() {
    if (currentTime > 0) {
      currentTime--
      timeLeft.textContent = currentTime
      autoMoveLogs()
      autoMoveCars()
      moveWithLogRight()
      moveWithLogLeft()
    } else {
      losingActions()
    }
  }
  
  // start and pause the game
  startBtn.addEventListener('click', () => {
      squares.forEach((square) => {
        square.classList.remove('dead')
        square.classList.remove('frog')
        square.classList.remove('victory')
        squares[76].classList.add('ending-block')
      })
      buttonLeft.addEventListener('click', moveFrogMobileLeft);
      buttonUp.addEventListener('click', moveFrogMobileUp);
      buttonRight.addEventListener('click', moveFrogMobileRight);
      buttonDown.addEventListener('click', moveFrogMobileDown);
      currentTime = 20
      timeLeft.textContent = currentTime
      currentIndex = 6
      squares[currentIndex].classList.add('frog')
  
      result.innerHTML = ''
      clearInterval(timerId)
      timerId = setInterval(movePieces, 1000)
      document.addEventListener('keyup', moveFrog)
  })

  
    function winningSound(url) {
      winSound.play()
    }
  
    function losingSound(url) {
      loseSound.play()
    }
  
    function jumpingSound(url) {
      jumpSound.play()
    }
  
  
  })
  