//Change variable is accordance to HTML
/*
Theme: The Displayed Theme
Man: How Much of Hangman Is Added
Guessed: Characters Already Guessed
Correct: Displayed How Much is Correct
Input: Input from the HTML Input (Uses correctProgress)
 */

const theme = document.getElementById("theme");
const hint = document.getElementById("hint");
const guessed = document.getElementById("guessed");
const guessedDisplay = document.getElementById("guessed-display");
const correct = document.getElementById("correct");
const input = document.getElementById("input");
const dropbtn = document.getElementById("dropbtn");
const restartbtn = document.getElementById("restartbtn");
const dropdown = document.getElementById("dropdown");
const status = document.getElementById("status");
const alreadyUsed = document.getElementById("alreadyUsed");
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
    getNewWord();
}

function count(str, char){
    return str.split(char).length - 1;
}

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

function renderGuessed(condition, guess){
    const guessedChar = document.createElement("div");
    guessedChar.className = condition ? "guessed-correct" : "guessed-wrong";
    guessedChar.innerText = guess;
    guessedDisplay.appendChild(guessedChar);
}

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const guess = input.value.toUpperCase();
        input.value = "";
        //Check if a character is wrong
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
                status.innerText = "You Lose :( | The Correct Word is: " + wordChosen;
                document.getElementById("input").disabled = true;
            }
        }
    }
})

dropbtn.addEventListener("click", (e) => {
    if(dropdown.style.display === "none" || dropdown.style.display === ""){
        dropdown.style.display = "flex";
    }
    else{
        dropdown.style.display = "none";
    }
})

document.addEventListener("click", (e) => {
    if(e.target.id !== "dropbtn" && dropdown.style.display === "flex"){
        dropdown.style.display = "none";
    }
})

restartbtn.addEventListener("click", (e) => {
    dropdown.style.display = "none";
    resetGame();

})

let themeChosen;
let wordChosen;
let hintChosen;
let correctArray;
let correctProgress = "";
let attemptsRemaining = 8;
getNewWord();
