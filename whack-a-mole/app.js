

const holes = document.querySelectorAll('.hole'); // creates an array of holes
const moles = document.querySelectorAll('.mole');
const timeLeft = document.querySelector('#time-left');
const start = document.querySelector('#start');
let score = document.querySelector('#score');
let sound = document.querySelector('#audio');
let tada = document.querySelector('#fanfare');
let finalScore = document.querySelector('#finalScore')

let result = 0;
let currentTime = timeLeft.textContent;
let timeUp = false;
let lastHole;



function randomTime(min, max) {
  return Math.round(Math.random() * (max-min) + min);
}

function randomHole(holes) {
  const index = Math.floor(Math.random() * holes.length);
  const hole = holes[index];
  if (hole === lastHole) {
    return randomHole(holes);
  }
  lastHole = hole;
  return hole;
}

  function moveMole() {
    const time = randomTime(700, 1700);
    const hole = randomHole(holes);
    moles.forEach(mole => mole.classList.remove('clicked'));
    hole.classList.add('up');
    hole.classList.remove('clicked');
    setTimeout(() => {
      hole.classList.remove('up');
      if(!timeUp) moveMole();
    }, time)
  }

  function startGame() {
    finalScore.innerHTML = ''
    if (currentTime > 0 && currentTime < 30) return;
    score.textContent = 0;
    timeUp = false;
    result = 0;
    currentTime = 30;
    moveMole();
    countDown();
    setTimeout(() => timeUp = true, 30000);
    timerId = setInterval(countDown, 1000);
    start.classList.add('hidden')
  }

  function hitMole(e) {
    if(!e.isTrusted) return; // avoid cheating with faking a click
    if(!this.classList.contains('clicked')) {
      result++;
      this.classList.add('clicked');
      this.classList.remove('up');
      score.textContent = result;
      squeak();
    }
  }

  moles.forEach(mole => mole.addEventListener('click', hitMole));

  function countDown() {
    currentTime--;
    timeLeft.textContent = currentTime;
    if (currentTime === 0) {
      clearInterval(timerId);
      setTimeout(() => {
        fanfare();
        finalScore.innerHTML = 'GAME OVER! Your final score: ' + result;
        start.classList.remove('hidden')
      }, 1000)
    }
  }

  function squeak(url) {
    sound.play();
  }

  function fanfare(url) {
    tada.play();
  }





start.addEventListener('click', startGame);







