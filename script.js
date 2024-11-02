// Variables for game state
let currentQuestion = 0;
let correctAnswersInRow = 0;
let totalQuestionsAsked = 0;
let difficulty = 1;
let victorySound = null; // To control the music

// Authorized user
const authorizedUser = "Ellen";
const pictureFolder = "Pictures";
const rewardImages = [
    `${pictureFolder}/auto.jpeg`,
    `${pictureFolder}/Dog .jpeg`,
    `${pictureFolder}/flamingo.jpeg`,
    `${pictureFolder}/hai.jpeg`,
    `${pictureFolder}/Horse.jpeg`,
    `${pictureFolder}/kilppari.jpeg`,
    `${pictureFolder}/kissa.jpeg`,
    `${pictureFolder}/Lammas.jpeg`,
    `${pictureFolder}/pingiini.jpeg`,
    `${pictureFolder}/toddler.jpeg`
];
const kingImage = `${pictureFolder}/kuningaskuva.jpeg`;
const lawImage = `${pictureFolder}/law.jpeg`; // Image for incorrect answer to first question

// Start the game after authorization
function startGame() {
    currentQuestion = 0;
    correctAnswersInRow = 0;
    totalQuestionsAsked = 0;
    console.log("Starting game: resetting state and showing difficulty selection.");

    // Hide first question, show difficulty selection
    document.getElementById("firstQuestion").style.display = "none";
    document.getElementById("difficultySelection").style.display = "block";
}

// Check if the user is authorized
function checkAuthorization() {
    const name = document.getElementById("name").value.trim();
    console.log("Name entered:", name);

    if (name === authorizedUser) {
        console.log("Authorized name entered, proceeding to start the game.");
        startGame();
    } else {
        showLawImage();
    }
}

// Show law image for incorrect first question answer
function showLawImage() {
    const overlay = document.getElementById("overlay");
    const overlayImage = document.getElementById("overlayImage");

    overlayImage.src = lawImage;
    overlay.classList.remove("small", "large"); // Remove any other size class
    overlay.classList.add("law"); // Add a specific class for the law image
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)"; // Darken background for unauthorized
    overlay.style.display = "flex";
    console.log("Displaying law image for unauthorized user.");

    // Allow click-to-dismiss only for the law image
    overlay.onclick = () => {
        overlay.style.display = "none";
        overlay.classList.remove("law"); // Remove law class after hiding
    };
}


// Set difficulty and start multiplication questions
function setDifficulty(level) {
    console.log("Difficulty level selected:", level);

    if (level === "Helppo") {
        difficulty = 4;
    } else if (level === "Haastava") {
        difficulty = 7;
    } else if (level === "Vaikea") {
        difficulty = 10;
    }
    document.getElementById("difficultySelection").style.display = "none";
    console.log("Difficulty set to:", difficulty);
    askMultiplicationQuestion();
}

// Generate and display multiplication question
function askMultiplicationQuestion() {
    if (totalQuestionsAsked >= 10 || correctAnswersInRow >= 5) {
        console.log("End game condition met.");
        endGame();
        return;
    }

    const num1 = Math.floor(Math.random() * difficulty) + 1;
    const num2 = Math.floor(Math.random() * difficulty) + 1;
    const correctAnswer = num1 * num2;
    console.log("Generated question:", num1, "x", num2, "=", correctAnswer);

    // Display the multiplication question
    document.getElementById("questionText").innerText = `Mikä on ${num1} x ${num2}?`;
    document.getElementById("multiplicationQuestion").style.display = "block";

    // Attach an event listener to the answer button
    const answerButton = document.getElementById("answerButton");
    answerButton.onclick = () => {
        console.log("Answer button clicked.");
        checkAnswer(correctAnswer);
    };
}

// Check if the player's answer is correct
function checkAnswer(correctAnswer) {
    const playerAnswer = parseInt(document.getElementById("answer").value);
    console.log("Player Answer:", playerAnswer);
    console.log("Correct Answer:", correctAnswer);

    if (isNaN(playerAnswer)) {
        alert("Please enter a valid number.");
        return;
    }

    if (playerAnswer === correctAnswer) {
        console.log("Correct answer!");
        correctAnswersInRow++;
        displayRewardImage();

        // Check if the player has reached 5 correct answers in a row
        if (correctAnswersInRow >= 5) {
            console.log("5 correct answers in a row! Displaying king reward.");
            displayKingReward();
            endGame();
            return;
        }
    } else {
        console.log("Incorrect answer. Resetting correct answer streak.");
        correctAnswersInRow = 0; // Reset streak on wrong answer
    }

    totalQuestionsAsked++;
    console.log("Total Questions Asked:", totalQuestionsAsked);

    // Check if we should continue or end the game
    if (totalQuestionsAsked < 10) {
        console.log("Proceeding to the next question.");
        document.getElementById("answer").value = ""; // Clear answer field
        setTimeout(askMultiplicationQuestion, 1000); // Add slight delay before showing next question
    } else {
        console.log("10 questions asked, ending game.");
        endGame();
    }
}

// Display a random 1x reward image and automatically hide it after a short delay
function displayRewardImage() {
    const overlay = document.getElementById("overlay");
    const overlayImage = document.getElementById("overlayImage");

    // Select a random image from the rewardImages array
    const randomImage = rewardImages[Math.floor(Math.random() * rewardImages.length)];
    overlayImage.src = randomImage;
    overlay.classList.remove("large"); // Remove large class if applied
    overlay.classList.add("small");    // Add small class for 1x rewards
    overlay.style.backgroundColor = "transparent"; // Maintain same visibility without darkening
    overlay.style.display = "flex";
    console.log("Displaying smaller 1x reward image:", randomImage);

    // Auto-hide the overlay after 1.5 seconds to allow continuation of the game
    setTimeout(() => {
        overlay.style.display = "none";
    }, 3300);
}


  

// Function to display the larger 5x king reward image with music
function displayKingReward() {
    const overlay = document.getElementById("overlay");
    const overlayImage = document.getElementById("overlayImage");

    overlayImage.src = kingImage;
    overlay.classList.remove("small"); // Remove small class if applied
    overlay.classList.add("large");    // Add large class for 5x rewards
    overlay.style.backgroundColor = "transparent"; // Maintain visibility
    overlay.style.display = "flex";

    victorySound = new Audio("Pictures/Winner_song.mp3");
    victorySound.play();
    console.log("Displaying larger 5x king reward image with music.");

    // Remove click-to-dismiss functionality for the 5x king reward
    overlay.onclick = null;
}

// End the game
function endGame() {
    document.getElementById("multiplicationQuestion").style.display = "none";
    document.getElementById("playAgain").style.display = "block";
}

// Restart the game and stop any playing music
function playAgain() {
    if (victorySound) {
        victorySound.pause();
        victorySound.currentTime = 0;
    }
    document.getElementById("playAgain").style.display = "none";
    document.getElementById("overlay").style.display = "none"; // Hide overlay when restarting
    startGame();
}

