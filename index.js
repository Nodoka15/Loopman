//HTML Variables
/*
theme: Theme of the word displayed to the player
hint: Hint of the word displayed to the player
guessed: Arbitrary holder for letters the player has guessed to render the guessed box
guessedDisplay: Using the guessed holder, it displays boxes of either red (incorrect) or green (correct) letters
correct: Similar to guessedDisplay, displays characters of the word the user has correctly guessed
input: The input box where player enters a letter or the whole word
rulesOverlay: The overlay that displays the rules of the game
infobtn: The button to click to open the rulesOverlay
closerulesbtn: The button to close the rulesOverlay
finishedOverlay: An overlay that opens up when the user finishes the game (either via won or lost)
restartbtn: Button the finishedOverlay that allows the user to start up a new game
closebtn: Button to close the finishedOverlay and complete the game
status: Status for if the user won or lost the game
alreadyUsed: Display whether the user has already guessed a letter
 */
const theme = document.getElementById("theme");
const hint = document.getElementById("hint");
const guessed = document.getElementById("guessed");
const guessedDisplay = document.getElementById("guessed-display");
const correct = document.getElementById("correct");
const input = document.getElementById("input");
const rulesOverlay = document.getElementById("rules-overlay");
const infobtn = document.getElementById("infobtn");
const closerulesbtn = document.getElementById("close-rules-btn");
const finishedOverlay = document.getElementById("game-finished");
const restartbtn = document.getElementById("restartbtn");
const closebtn = document.getElementById("closebtn");
const status = document.getElementById("status");
const alreadyUsed = document.getElementById("alreadyUsed");

//Other Essential Variables to Understand
/*
response: The response from the Word Game DB API call
data: Data from the response variable
wordChosen: The chosen word the player has to guess
themeChosen: The theme of the word
hintChosen: The hint of the word
correctProgress: A string that mimics wordChosen but has '_' for letters not guessed yet by the player
correctArray: wordChosen split up into an array to check individual letters and negate any spaces (null)
 */


//List of body parts to show as the player guesses incorrectly
const bodyParts = [
    document.getElementById("mouth"),
    document.getElementById("eyes"),
    document.getElementById("right-leg"),
    document.getElementById("left-leg"),
    document.getElementById("right-arm"),
    document.getElementById("left-arm"),
    document.getElementById("man-body"),
    document.getElementById("head"),
]

//Function to get a new word via an API call to Word Game DB
async function getNewWord(){

    document.getElementById("game-container").style.display = "none";
    document.getElementById("loader-page").style.display = "flex";

    const response = await fetch("https://www.wordgamedb.com/api/v2/words/random");
    const data = await response.json();

    document.getElementById("game-container").style.display = "flex";
    document.getElementById("loader-page").style.display = "none";

    wordChosen = data.word.toUpperCase();
    themeChosen = data.category[0].toUpperCase() + data.category.substring(1);
    hintChosen = data.hint;

    //Ignores Spaces if the Word has Spaces
    if(wordChosen.indexOf(" ") !== -1) {
        let tempArray = wordChosen.split(" ");
        let i = 0;
        while(i < tempArray.length - 1){
            correctProgress += "_".repeat(tempArray[i].length) + " ";
            i++;
        }
        correctProgress += "_".repeat(tempArray[i].length);
    }
    else{
        correctProgress = "_".repeat(wordChosen.length);
    }
    correctArray = wordChosen.split("");
    correctArray = correctArray.map(item => item === " " ? null : item);

    theme.innerText = themeChosen;
    renderWord();
}

//Function to reset the game by clearing all data
function resetGame(){
    attemptsRemaining = 8;
    correctProgress = "";
    alreadyUsed.innerText = "";
    guessed.innerText = "";
    guessedDisplay.innerHTML = "";
    status.innerText = "";
    input.value = "";
    hint.innerText = "";
    document.getElementById("input").disabled = false;
    for(let i = 0; i < 8; i++){
        bodyParts[i].classList.add("hidden");
    }
    finishedOverlay.style.display = "none";
    getNewWord();
}

//Function to count how many times char appears in str
function count(str, char){
    return str.split(char).length - 1;
}

//Function to render letters of the word for letters that the player correctly guesses
function renderWord(){
    correct.innerHTML = "";
    const words = correctProgress.split(" ");
    for(let word of words){
        const wordGroup = document.createElement("div");
        wordGroup.className = "word-group";

        for(let char of word){
            const box = document.createElement("div");
            box.className = char === "_" ? "char-box-empty" : "char-box";
            if (char !== "_"){
                box.innerText = char;
            }
            wordGroup.appendChild(box);
        }
        correct.appendChild(wordGroup);
    }
}

//Function to render the full word if the player correctly guesses the whole word
function renderFullWord(){
    correct.innerHTML = "";
    correctProgress = wordChosen;
    const words = correctProgress.split(" ");
    for(let word of words){
        const wordGroup = document.createElement("div");
        wordGroup.className = "word-group";

        for(let char of word){
            const box = document.createElement("div");
            box.className = "char-box";
            box.innerText = char;
            wordGroup.appendChild(box);
        }
        correct.appendChild(wordGroup);
    }
}

//Function to render in the "guessed box" whether a guessed character is correct (green) or wrong (red)
function renderGuessed(condition, guess){
    const guessedChar = document.createElement("div");
    guessedChar.className = condition ? "guessed-correct" : "guessed-wrong";
    guessedChar.innerText = guess;
    guessedDisplay.appendChild(guessedChar);
}


//Function to define what happens when the player attempts to guess the entire word
function fullWordAttempt(guess){
    //If the whole word guess is correct
    if (guess === wordChosen){
        renderFullWord();
        status.innerText = "You Win!";
        document.getElementById("input").disabled = true;
        finishedOverlay.style.display = "flex";
    }
    //If the whole word guess is incorrect
    else{
        attemptsRemaining--;
        bodyParts[attemptsRemaining].classList.remove("hidden");
        if(attemptsRemaining === 2){
            hint.innerText = hintChosen;
        }
        //Check if player ran out of tries
        if(attemptsRemaining === 0){
            status.innerText = "You Lose :( \nThe Correct Word is: " + wordChosen;
            document.getElementById("input").disabled = true;
            finishedOverlay.style.display = "flex";
        }
    }
}

//Function to define what happens when the player attempts to guess one letter of the word
function letterAttempt(guess){
    //Singular letter is wrong
    if (guessed.innerText.indexOf(guess) !== -1){
        alreadyUsed.innerText = "You already guessed this character!";
        return;
    }
    else{
        guessed.innerText += guess;
        alreadyUsed.innerText = "";
    }
    //Find index of the character guessed
    let rightIndex = correctArray.indexOf(guess);
    if(rightIndex !== -1) {
        renderGuessed(true, guess);
        let amountRight = count(wordChosen, guess);
        for(let i = 0; i < amountRight; i++) {
            //Updates the right characters guessed
            rightIndex = correctArray.indexOf(guess);
            correctProgress = correctProgress.split('');
            correctProgress[rightIndex] = guess;
            correctProgress = correctProgress.join('');
            //Deletes right character to look for remaining characters in the next search
            delete correctArray[rightIndex];
        }
        //Updates the visual for the user
        renderWord();
        //Check if the whole word is guessed
        if(correctProgress === wordChosen) {
            status.innerText = "You Win!";
            document.getElementById("input").disabled = true;
            finishedOverlay.style.display = "flex";
        }
    }
    else{
        //Display wrong attempt
        renderGuessed(false, guess);
        attemptsRemaining--;
        bodyParts[attemptsRemaining].classList.remove("hidden");
        if(attemptsRemaining === 2){
            hint.innerText = hintChosen;
        }
        //Check if ran out of tries
        if(attemptsRemaining === 0){
            status.innerText = "You Lose :( \nThe Correct Word is: " + wordChosen;
            document.getElementById("input").disabled = true;
            finishedOverlay.style.display = "flex";
        }
    }
}

//Event for when the user attempts to either guess one letter or the whole word
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const guess = input.value.toUpperCase();
        input.value = "";
        //Check if the guess is a whole word
        if (guess.length > 1){
            fullWordAttempt(guess);
            return;
        }
        //Guess is one letter
        letterAttempt(guess);
    }
})

//Event for exiting the rules overlay if the player clicks anywhere on the darkened area
rulesOverlay.addEventListener("click", (e) => {
    if(e.target.id === "rules-overlay"){
        rulesOverlay.style.display = "none";
    }
})

//Event for opening up the rules overlay when the player clicks on the informational button
infobtn.addEventListener("click", () => {
    rulesOverlay.style.display = "flex";
})

//Event for exiting the rules overlay if the player clicks close
closerulesbtn.addEventListener("click", () => {
    rulesOverlay.style.display = "none";
})

//Event for exiting the finished overlay if the player clicks close
closebtn.addEventListener("click", () => {
    finishedOverlay.style.display = "none";
})

//Event for exiting the finished overlay if the player clicks anywhere on the darkened area
finishedOverlay.addEventListener("click", (e) => {
    if(e.target.id === "game-finished"){
        finishedOverlay.style.display = "none";
    }
})

//Event for exiting the finished overlay if the player clicks restart
restartbtn.addEventListener("click", () => {
    resetGame();
})

//Where the game starts
let themeChosen;
let wordChosen;
let hintChosen;
let correctArray;
let correctProgress = "";
let attemptsRemaining = 8;
getNewWord();
