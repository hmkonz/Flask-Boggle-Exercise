const currentScore = document.getElementById("score");
const wordList = document.getElementById("word-list");
const button = document.getElementById("submit");
const ul = document.querySelector("ul");
const timerContainer = document.getElementById("timer");
// set countdown timer until endgame function runs
let remainingTime = 60;
let timer;
// create an empty array where correct words from the board are stored
let foundWords = [];
let score = 0;

$(document).ready(function () {
  // Adds an event listener on our form that will call a function 'handleSubmit' that prevents the page from reloading, then takes the value from our form ('word') and uses it as a parameter to send a request for data from our server. The return data is one of three strings: "ok", "not-on-board", "not-word".

  $("form").on("submit", handleSubmit);

  async function handleSubmit(event) {
    // prevents page from reloading
    event.preventDefault();
    // 'word' is set equal to the value of the word submitted through the form
    let word = $("#word").val();
    // if there's nothing entered into the form, do nothing (prevents an error from occuring)
    if (!word) return;
    // send this word to the 'server' to have it checked to see if it's a valid word
    const res = await axios.get("/check-word", {
      params: { word: word },
    });
    // The info that we want is in the “data” of the above GET response. The “data” will be the jsonified dictionary that we sent in the '/check-word' route, so we use the key we set (“result”) to get its value (our string) and set it to the variable 'response'
    let response = res.data.result;
    //Display response in the DOM if the server determines this is an appropriate response:
    if (response === "ok") {
      // check first to see if 'foundWords' array already includes the guessed word. If so, return message telling user to try again.
      if (foundWords.includes(word.toUpperCase())) {
        $("#result").text(`Already found ${word.toUpperCase()}! Try again!`);
      } else {
        //if guessed word hasn't been guessed before, update the score value and update the score in the DOM ('currentScore.innerHTML = score).
        $("#result").text(`Success! ${word.toUpperCase()} is a valid word!`);
        // Add to score for every valid word and set the innerHTML of currentScore to score
        score += word.length;
        currentScore.innerHTML = score;
        // Add word to array containing valid words
        foundWords.push(word.toUpperCase());
        // create an <li> dynamically for every valid word and append it to the <ul> so it will show up in the DOM
        const newWord = document.createElement("li");
        newWord.append(word.toUpperCase());
        ul.append(newWord);
      }
    } else if (response === "not-on-board") {
      // if guessed word is not on the board, show the following message in the DOM by adding it to the text of the <p> with an id of 'result'
      $("#result").text(
        `Try Again! ${word.toUpperCase()} is not a valid word on this board!`
      );
    } else {
      // if guessed word is not a valid word (not in list 'words'), show the following message in the DOM by adding it to the text of the <p> with an id of 'result'
      $("#result").text(
        `Try Again! ${word.toUpperCase()} is not a valid word!`
      );
    }
    document.getElementById("form").reset();
  }

  let countDown = setInterval(function () {
    // decrease the timer by one and update the time displayed in the DOM
    remainingTime -= 1;
    timerContainer.innerHTML = remainingTime;
    // run 'stopTimer()' only when time is up
    stopTimer();
  }, 1000);

  function stopTimer() {
    //if time has run out, stop the countdown and replace the form with the words "GAME OVER! START A NEW GAME!"
    if (remainingTime === 0) {
      clearInterval(countDown);
      $("form").hide();
      $("#result").text(`GAME OVER!! START NEW GAME!`);
      endGame();
    }
  }

  async function endGame() {
    // post score to server to see if the high score needs to be updated
    await axios.post("/end_game", { score: score });
  }
});

// class BoggleGame {
//     constructor()
// }
// const currentScore = document.getElementById("score");
// const wordList = document.getElementById("word-list");
// const button = document.getElementById("submit");
// const ul = document.querySelector("ul");
// const timerContainer = document.getElementById("timer");
// // set countdown timer until endgame function runs
// let remainingTime = 60;
// let timer;
// // create an empty array where correct words from the board are stored
// let foundWords = [];
// let score = 0;

// $(document).ready(function () {
//   // Adds an event listener on our form that will call a function 'handleSubmit' that prevents the page from reloading, then takes the value from our form ('word') and uses it as a parameter to send a request for data from our server. The return data is one of three strings: "ok", "not-on-board", "not-word".

//   $("form").on("submit", handleSubmit);

//   async function handleSubmit(event) {
//     // prevents page from reloading
//     event.preventDefault();
//     // 'word' is set equal to the value of the word submitted through the form
//     let word = $("#word").val();
//     // if there's nothing entered into the form, do nothing (prevents an error from occuring)
//     if (!word) return;
//     // send this word to the 'server' to have it checked to see if it's a valid word
//     const res = await axios.get("/check-word", {
//       params: { word: word },
//     });
//     // The info that we want is in the “data” of the above GET response. The “data” will be the jsonified dictionary that we sent in the '/check-word' route, so we use the key we set (“result”) to get its value (our string) and set it to the variable 'response'
//     let response = res.data.result;
//     //Display response in the DOM if the server determines this is an appropriate response:
//     if (response === "ok") {
//       // check first to see if 'foundWords' array already includes the guessed word. If so, return message telling user to try again.
//       if (foundWords.includes(word.toUpperCase())) {
//         $("#result").text(`Already found ${word.toUpperCase()}! Try again!`);
//       } else {
//         //if guessed word hasn't been guessed before, update the score value and update the score in the DOM ('currentScore.innerHTML = score).
//         $("#result").text(`Success! ${word.toUpperCase()} is a valid word!`);
//         // Add to score for every valid word and set the innerHTML of currentScore to score
//         score += word.length;
//         currentScore.innerHTML = score;
//         // Add word to array containing valid words
//         foundWords.push(word.toUpperCase());
//         // create an <li> dynamically for every valid word and append it to the <ul> so it will show up in the DOM
//         const newWord = document.createElement("li");
//         newWord.append(word.toUpperCase());
//         ul.append(newWord);
//       }
//     } else if (response === "not-on-board") {
//       // if guessed word is not on the board, show the following message in the DOM by adding it to the text of the <p> with an id of 'result'
//       $("#result").text(
//         `Try Again! ${word.toUpperCase()} is not a valid word on this board!`
//       );
//     } else {
//       // if guessed word is not a valid word (not in list 'words'), show the following message in the DOM by adding it to the text of the <p> with an id of 'result'
//       $("#result").text(
//         `Try Again! ${word.toUpperCase()} is not a valid word!`
//       );
//     }
//     document.getElementById("form").reset();
//   }

//   let countDown = setInterval(function () {
//     // decrease the timer by one and update the time displayed in the DOM
//     remainingTime -= 1;
//     timerContainer.innerHTML = remainingTime;
//     // run 'stopTimer()' only when time is up
//     stopTimer();
//   }, 1000);

//   function stopTimer() {
//     //if time has run out, stop the countdown and replace the form with the words "GAME OVER! START A NEW GAME!"
//     if (remainingTime === 0) {
//       clearInterval(countDown);
//       $("form").hide();
//       $("#result").text(`GAME OVER!! START NEW GAME!`);
//       endGame();
//     }
//   }

//   async function endGame() {
//     // post score to server to see if the high score needs to be updated
//     await axios.post("/end_game", { score: score });
//   }
// });
