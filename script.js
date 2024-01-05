// Select necessary elements
const colorDisplay = document.querySelector('#color');
const guessDisplay = document.querySelector('#guess');
const scoreDisplay = document.querySelector('#score');
const resetButton = document.querySelector('#reset');
const showAnswerButton = document.querySelector('#show-answer');
const answerDisplay = document.querySelector('#answer');
const timeDisplay = document.querySelector('.time');
const guessCount = document.querySelector('.guesses');
const guessInputs = document.querySelectorAll('input[type=number]');

let lastScore = null;
let timerId = null;
let startTime = null;
let guesses = 0;

// Function to generate a random color
function getRandomColor() {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return [red, green, blue];
}

function updateTimer(timestamp) {
    if (!startTime) startTime = timestamp;
    const seconds = ((timestamp - startTime) / 1000).toFixed(3); // Keep 3 decimal digits
    timeDisplay.textContent = `Time: ${seconds}s`;
    timerId = requestAnimationFrame(updateTimer);
}

// Set initial random color
let randomColor = getRandomColor();
colorDisplay.style.backgroundColor = `rgb(${randomColor[0]}, ${randomColor[1]}, ${randomColor[2]})`;

// Event listener for form submission
document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    const guessValues = [...guessInputs].map((input) => parseInt(input.value));
    if (guessValues.some((value) => isNaN(value))) {
        alert('Please enter a value');
        return;
    }
    guessDisplay.style.backgroundColor = `rgb(${guessValues[0]}, ${guessValues[1]}, ${guessValues[2]})`;
    guessDisplay.classList.remove('rainbow');

    const score = Math.sqrt((randomColor[0] - guessValues[0]) ** 2 + (randomColor[1] - guessValues[1]) ** 2 + (randomColor[2] - guessValues[2]) ** 2);
    scoreDisplay.textContent = `Score: ${Math.round(score*1000)/1000}`;

    scoreDisplay.classList.remove('red', 'green', 'yellow');
    if (lastScore !== null) {
        if (score < lastScore) {
            scoreDisplay.classList.add('green');
        } else if (score > lastScore) {
            scoreDisplay.classList.add('red');
        } else {
            scoreDisplay.classList.add('yellow');
        }
    }
    lastScore = score;

    // Start the timer and increment the number of guesses when the first guess is made
    if (timerId === null) {
        timerId = requestAnimationFrame(updateTimer);
    }
    guesses++; // Increment the number of guesses
    guessCount.textContent = `Guesses: ${guesses}`; // Update the guesses display

    // Stop the timer when the answer is correct
    if (score === 0) {
        guessDisplay.classList.add('wiggle');
        guessInputs.forEach((input) => input.setAttribute('disabled', ''));
        cancelAnimationFrame(timerId);
    }
});

// Event listener for reset button
resetButton.addEventListener('click', function () {
    randomColor = getRandomColor();
    colorDisplay.style.backgroundColor = `rgb(${randomColor[0]}, ${randomColor[1]}, ${randomColor[2]})`;
    guessDisplay.style.backgroundColor = 'white';
    guessDisplay.classList.add('rainbow');
    guessDisplay.classList.remove('wiggle');
    scoreDisplay.textContent = 'Score: ???';
    answerDisplay.textContent = '';
    guessInputs.forEach((input) => input.removeAttribute('disabled'));
    lastScore = null;
    scoreDisplay.classList.remove('red', 'green', 'yellow');
 
    // Reset the timer and the number of guesses
    cancelAnimationFrame(timerId);
    timerId = null;
    startTime = null;
    timeDisplay.textContent = 'Time: 0.000s';
    
    guesses = 0; // Reset the number of guesses
    guessCount.textContent = 'Guesses: 0'; // Reset the guesses display
});

// Event listener for show answer button
showAnswerButton.addEventListener('click', function () {
    answerDisplay.textContent = `Answer: ${randomColor[0]}, ${randomColor[1]}, ${randomColor[2]}`;
});