//Change variable is accordance to HTML
/*
Theme: The Displayed Theme
Man: How Much of Hangman Is Added
Guessed: Characters Already Guessed
Correct: Displayed How Much is Correct
Input: Input from the HTML Input (Uses correctProgress)
 */

/*import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function main() {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Explain how AI works in a few words",
    });
    console.log(response.text);
}

await main();
*/

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

const theme = document.getElementById("theme");
//const man = document.getElementById("man");
const guessed = document.getElementById("guessed");
const guessedDisplay = document.getElementById("guessed-display");
const correct = document.getElementById("correct");
const input = document.getElementById("input");
const status = document.getElementById("status");
const alreadyUsed = document.getElementById("alreadyUsed");

//const testing = document.getElementById("testing");

const themeWords = {
    "Food" : ["PIZZA", "CARBONARA", "SALMON", "SPAGHETTI", "RIBEYE", "BIRYANI", "RAMEN", "SUSHI", "KEBAB"],
    "City" : ["BUDAPEST", "WARSAW", "MIAMI", "MELBOURNE", "JAKARTA", "MOSCOW", "LONDON", "PARIS", "LISBON"],
    "School Subject" : ["PSYCHOLOGY", "STATISTICS", "LITERATURE", "ALGEBRA", "CALCULUS", "PHYSICS", "CHEMISTRY", "BIOLOGY", "GEOGRAPHY"],
    "Multi-Word Items" : ["MOUSE AND KEYBOARD", "WIFI ROUTER", "CUTTING BOARD", "LED LIGHTS", "COMPACT DISC", "FANTASY BOOK", "RASPBERRY PI", "GAME CONSOLE", "HARD DRIVE"]
}
const themeChosen = Object.keys(themeWords)[Math.floor(Math.random() * 4)];
const wordChosen = themeWords[themeChosen][Math.floor(Math.random() * 9)];

theme.innerText = themeChosen;

let correctProgress = "";

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
let correctArray = wordChosen.split("");
correctArray = correctArray.map(item => item === " " ? null : item);

let attemptsRemaining = 8;

//man.innerText = attemptsRemaining;
renderWord();

//testing.innerText = wordChosen;

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
            //Check if ran out of tries
            attemptsRemaining--;
            //man.innerText = attemptsRemaining;
            if(attemptsRemaining === 0){
                status.innerText = "You Lose :( | The Correct Word is: " + wordChosen;
                document.getElementById("input").disabled = true;
            }
        }
    }
})
