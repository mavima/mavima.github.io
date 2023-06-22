document.addEventListener('DOMContentLoaded', () => {

const cardArray = [
  {
    name: 'puppy',
    image: 'images/puppy.jpg'
  },
  {
    name: 'puppy',
    image: 'images/puppy.jpg'
  },
  {
    name: 'kitten',
    image: 'images/kitten.jpg'
  },
  {
    name: 'kitten',
    image: 'images/kitten.jpg'
  },
  {
    name: 'donkey',
    image: 'images/donkey.jpg'
  },
  {
    name: 'donkey',
    image: 'images/donkey.jpg'
  },
    {
    name: 'panda',
    image: 'images/panda.jpg'
  },
  {
    name: 'panda',
    image: 'images/panda.jpg'
  },
    {
    name: 'raccoon',
    image: 'images/raccoon.jpg'
  },
  {
    name: 'raccoon',
    image: 'images/raccoon.jpg'
  },
    {
    name: 'deer',
    image: 'images/deer.jpg'
  },
  {
    name: 'deer',
    image: 'images/deer.jpg'
  },
  {
    name: 'squirrel',
    image: 'images/squirrel.jpg'
  },
  {
    name: 'squirrel',
    image: 'images/squirrel.jpg'
  },
  {
    name: 'lamb',
    image: 'images/lamb.jpg'
  },
  {
    name: 'lamb',
    image: 'images/lamb.jpg'
  },
]

const start = document.querySelector('#start')

cardArray.sort(() => 0.5 - Math.random());

// board
const grid = document.querySelector('.grid')
const resultDisplay = document.querySelector('#result');
let cardsChosen = [];
let cardsChosenId = [];
let cardsWon = [];

function createBoard() {
  for (let i = 0; i < cardArray.length; i++) {
    var card = document.createElement('img');
    card.setAttribute('src', 'images/question.png');
    card.setAttribute('data-id', i); // sets an index according to the looping
      card.addEventListener('click', flipCard);
    grid.appendChild(card); // adds an element to end of a list of children of the grid parent
  }
}

function checkForMatch() {
  let cards = document.querySelectorAll('img');
  const optionOneId = cardsChosenId[0];
  const optionTwoId = cardsChosenId[1];
  const optionOne = cardsChosen[0];
  const optionTwo = cardsChosen[1];
  cards.forEach((card) => card.classList.add('clicked'))
  if (cardsChosen[0] === cardsChosen[1]) {
    cardsWon.push(cardsChosen)
    setTimeout(() => {
      cards[optionOneId].setAttribute('src', 'images/star.png');
      cards[optionTwoId].setAttribute('src', 'images/star.png');
      cards.forEach((card) => card.classList.remove('clicked'))
    }, 1000)
  } else {
    setTimeout(() => {
      cards[optionOneId].setAttribute('src', 'images/question.png');
      cards[optionOneId].classList.remove('clicked'); // reactivating the card
      cards[optionTwoId].setAttribute('src', 'images/question.png');
      cards[optionTwoId].classList.remove('clicked');
      cards.forEach((card) => card.classList.remove('clicked'))
    }, 1000)
  }
  cardsChosen = [];
  cardsChosenId = [];
  resultDisplay.textContent = cardsWon.length;
  if (cardsWon.length === cardArray.length/2) {
    resultDisplay.textContent = cardsWon.length + ' 🌟 Congratulations! 🥇'
    start.classList.remove('hidden')
  }

}

function flipCard() {
  var cardId = this.getAttribute('data-id');
  cardsChosen.push(cardArray[cardId].name);
  let cardImage = 'images/' + cardArray[cardId].name + '.jpg';
  cardsChosenId.push(cardId);
  this.setAttribute('src', cardImage);
  this.classList.add('clicked'); // prevent clicking the same card twice for a "match"
  if (cardsChosen.length === 2) {
    setTimeout(checkForMatch, 500); // timeout to make sure user has time to see what happens
  }
}


function startGame() {
cardArray.sort(() => 0.5 - Math.random());
grid.innerHTML = ''
start.classList.add('hidden')
cardsChosen = [];
cardsChosenId = [];
cardsWon = [];
resultDisplay.textContent = ''
createBoard()
}

start.addEventListener('click', startGame)

createBoard();

})
