const cardsContainer = document.getElementById('cards');
const timeElement = document.getElementById('time');
const difficultySelect = document.getElementById('difficulty');
const restartButton = document.getElementById('restart');
const scoreElement = document.getElementById('score'); // Assuming you have a score element in your HTML

let attempts = 0;
let matchedPairs = 0;
let totalPairs;
let firstCard, secondCard;
let isFlipping = false;
let timerInterval, gameStartTime;
let score = 0; // Initialize score variable

const cardImages = [
    'sUntitled.jpeg', 
    'bennn.jpeg', 
    'batman.jpeg', 
    'jerry.jpeg', 
    'mUntitled.jpeg', 
    'tUntitled.jpeg',
    'Untitled.png',
    'avengers.png',
    'Ountitled.jpeg',
    'MUntitled.jpeg',
    'DUntitled.jpeg',
    'PUntitled.jpeg'
];

difficultySelect.addEventListener('change', startGame);
restartButton.addEventListener('click', startGame);

function startGame() {
    resetGame();
    const difficulty = difficultySelect.value;
    
    // Adjust totalPairs based on difficulty
    totalPairs = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 16 : 36;

    let cardsPerRow, rows;
    
    // Define grid settings based on difficulty
    if (difficulty === 'easy') {
        cardsPerRow = 4;
        rows = 2;
    } else if (difficulty === 'medium') {
        cardsPerRow = 4;
        rows = 4;
    } else {
        cardsPerRow = 6;
        rows = 6;
    }

    cardsContainer.style.gridTemplateColumns = `repeat(${cardsPerRow}, 1fr)`;
    cardsContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    const selectedImages = cardImages.slice(0, totalPairs / 2);//The ending index (exclusive), which is half the total number of pairs needed (since each image appears twice).
    const cardsArray = [...selectedImages, ...selectedImages];
    shuffle(cardsArray);

    cardsContainer.innerHTML = '';
    cardsArray.forEach(image => {
        const card = document.createElement('li');
        card.classList.add('card');
        card.innerHTML = `
            <div class="view front-view">?</div>
            <div class="view back-view"><img src="${image}" alt="card-img" class="card-image"></div>
        `;
        card.addEventListener('click', flipCard);
        cardsContainer.appendChild(card);
    });

    startTimer();
}

function flipCard() {
    if (isFlipping || this.classList.contains('flipped')) return;
    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        attempts++;
        
        checkMatch();
    }
}

function checkMatch() {
    isFlipping = true;
    const firstImage = firstCard.querySelector('.back-view img').src;
    const secondImage = secondCard.querySelector('.back-view img').src;

    if (firstImage === secondImage) {
        matchedPairs++;
        score += 10; // Increase score by 10 for a match
        scoreElement.textContent = `Score: ${score}`; // Update score display

        resetFlip();
        if (matchedPairs === totalPairs / 2) {
            clearInterval(timerInterval);
            alert(`Congratulations! You've completed the game in ${attempts} attempts and ${timeElement.textContent}. Your score is ${score}.`);
        }
    } else {
        attempts++;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetFlip();
        }, 1000);
    }
}

function resetFlip() {
    firstCard = null;
    secondCard = null;
    isFlipping = false;
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function startTimer() {
    gameStartTime = Date.now();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - gameStartTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        timeElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

function resetGame() {
    attempts = 0;
    matchedPairs = 0;
    score = 0; // Reset score

    timeElement.textContent = '00:00';
    scoreElement.textContent = 'Score: 0'; // Reset score display
    clearInterval(timerInterval);
    firstCard = null;
    secondCard = null;
    isFlipping = false;
}

startGame();

