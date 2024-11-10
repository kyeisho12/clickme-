// Get DOM elements
const character = document.getElementById('character');
const progressBar = document.getElementById('progress');
const background = document.getElementById('background');
const gameContainer = document.getElementById('game-container');
const pictureContainers = document.querySelectorAll('.picture-container');
const coins = document.querySelectorAll('.coin');
const obstacles = document.querySelectorAll('.obstacle');
const scoreDisplay = document.getElementById('score-value');

// Game variables
let position = 0;
const speed = 5;
const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;
let score = 0;

// Function to move the character and background
function moveCharacter(direction) {
    if (direction === 'left') {
        position = Math.max(0, position - speed);
        character.style.transform = 'scaleX(-1)';
    } else if (direction === 'right') {
        position = Math.min(gameWidth - 40, position + speed);
        character.style.transform = 'scaleX(1)';
    }
    
    // Move character horizontally
    character.style.left = `${position}px`;
    
    // Move background
    const backgroundPosition = -(position / (gameWidth - 40)) * (background.offsetWidth - gameWidth);
    background.style.left = `${backgroundPosition}px`;
    
    updateProgress();
    checkCollisions();
}

// Function to update the progress bar
function updateProgress() {
    const progress = (position / (gameWidth - 40)) * 100;
    progressBar.style.width = `${progress}%`;
}

// Function to toggle message box visibility
function toggleMessageBox(container) {
    const messageBox = container.querySelector('.message-box');
    if (messageBox) {
        messageBox.style.display = messageBox.style.display === 'none' ? 'block' : 'none';
    }
}

// Function to check collisions with coins and obstacles
function checkCollisions() {
    const characterRect = character.getBoundingClientRect();

    coins.forEach(coin => {
        const coinRect = coin.getBoundingClientRect();
        if (characterRect.right > coinRect.left &&
            characterRect.left < coinRect.right &&
            characterRect.bottom > coinRect.top &&
            characterRect.top < coinRect.bottom) {
            collectCoin(coin);
        }
    });

    obstacles.forEach(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();
        if (characterRect.right > obstacleRect.left &&
            characterRect.left < obstacleRect.right &&
            characterRect.bottom > obstacleRect.top &&
            characterRect.top < obstacleRect.bottom) {
            hitObstacle();
        }
    });
}

// Function to collect a coin
function collectCoin(coin) {
    coin.style.display = 'none';
    score += 10;
    updateScore();
}

// Function to handle obstacle collision
function hitObstacle() {
    score = Math.max(0, score - 5);
    updateScore();
}

// Function to update the score display
function updateScore() {
    scoreDisplay.textContent = score;
}

// Add click event listeners to picture containers
pictureContainers.forEach(container => {
    container.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent event from bubbling up
        toggleMessageBox(container);
    });
});

// Event listener for keydown events
document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            moveCharacter('left');
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            moveCharacter('right');
            break;
    }
});

// Event listener to close message boxes when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.closest('.picture-container')) {
        pictureContainers.forEach(container => {
            const messageBox = container.querySelector('.message-box');
            if (messageBox) {
                messageBox.style.display = 'none';
            }
        });
    }
});