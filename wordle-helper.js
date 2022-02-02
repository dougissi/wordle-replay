// Global variables
const today = getDateToday();
const earliestDate = "2021-06-19";
let date = today;
let numLetters = 5;
let round = null;
let validWords = null;
let knownLetterMinCounts = null;
let knownLetterMaxCounts = null;
let regex = null;
let indexToCorrectLetter = null;
let indexToWrongLetters = null;
let ownWord = null;
let ownWordIndex = null;
let topWords = null;
let guess = null;
let guessResultsByPosition = null;
let ooo = null;
const defaultNumTries = 6;
const greenRGB = getCSSVariable("green");
const yellowRGB = getCSSVariable("yellow");
const grayRGB = getCSSVariable("gray");
const lightGrayRGB = getCSSVariable("lightgray");
const letterToKeyCode = new Map([
  ["q", 81],
  ["w", 87],
  ["e", 69],
  ["r", 82],
  ["t", 84],
  ["y", 89],
  ["u", 85],
  ["i", 73],
  ["o", 79],
  ["p", 80],
  ["a", 65],
  ["s", 83],
  ["d", 68],
  ["f", 70],
  ["g", 71],
  ["h", 72],
  ["j", 74],
  ["k", 75],
  ["l", 76],
  ["z", 90],
  ["x", 88],
  ["c", 67],
  ["v", 86],
  ["b", 66],
  ["n", 78],
  ["m", 77],
]);


class MapWithDefault extends Map {
  get(key) {
    if (!this.has(key)) this.set(key, this.default());
    return super.get(key);
  }

  constructor(defaultFunction, entries) {
    super(entries);
    this.default = defaultFunction;
  }
}



$("#suggestions").hide();
buildDateSelector();
startGame();



function getDateToday() {
  let today = new Date();
  const offset = today.getTimezoneOffset();
  today = new Date(today.getTime() - (offset * 60 * 1000));
  today = today.toISOString().split("T")[0];
  return today;
}

function getCSSVariable(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`);
}

function getOOO() {
  let xd = "";
  for (const x of date) {
    xd += numberXXX.get(x);
  }
  const xw = xxx.get(xd);
  let o = "";
  for (const x of xw) {
    o += xxxLetter.get(x);
  }
  return o;
}

function buildDateSelector() {
  let dateSelectorHTML = `<label class="date-selector" for="date-selector-button">Wordle date:</label>\n<input type="date" class="date-selector" id="date-selector-button" value="${today}" min="${earliestDate}" max="${today}" onchange="dateChange();">`;
  $("#date-box").append(dateSelectorHTML);
}

function addEmptyGuessRows() {
  for (let row = 0; row < defaultNumTries; row++) {
    addEmptyTilesRow(row);
  }
}

function startGame() {
  round = 1;
  knownLetterMinCounts = new Map();
  knownLetterMaxCounts = new Map();
  regex = "";

  // initialize maps for corret/wrong letters per index
  indexToCorrectLetter = new Map();
  indexToWrongLetters = new Map();
  for (let i = 0; i < numLetters; i++) {
    indexToWrongLetters.set(i, new Set());
  }
  ownWord = "";
  ownWordIndex = 0;
  guess = null;
  guessResultsByPosition = [];
  for (let i = 0; i < numLetters; i++) {
    guessResultsByPosition.push(null);
  }
  ooo = getOOO();

  validWords = wordleAcceptableWords;
  updateValidWordsText();
  topWords = getNextWordOptions();
  buildTopWordsSelector();
  addEmptyGuessRows();
}

function restartGame() {
  $(".letter-tiles-grid").empty();
  for (const [letter, keyCode] of letterToKeyCode) {
    $(`#${keyCode}`).css("background-color", "var(--lightgray)");
    $(`#${keyCode}`).css("color", "initial");
  }
  startGame();
}

// score based on letter frequency in valid words
function getSortedWordScores() {
  // letter frequency from answer words
  let letterFreq = new MapWithDefault(() => 0);
  for (const word of validWords) {
    for (const letter of word) {
      letterFreq.set(letter, letterFreq.get(letter) + 1);
    }
  }

  // scores
  let wordScores = new MapWithDefault(() => []);
  for (const word of validWords) {
    let score = 0;
    for (const letter of word) {
      score += letterFreq.get(letter)
    }
    wordScores.get(score).push(word)
  }

  return new Map([...wordScores.entries()].sort((a, b) => (b[0] - a[0]))) // sort by descending score
}

// // score based on letter frequency in valid words (anywhere + by position)
// function getSortedWordScores() {
//   let wordScores = new MapWithDefault(() => []);
//
//   // get letter frequencies
//   let letterFreqWholeWord = new MapWithDefault(() => 0);
//   let letterFreqByPosition = new Map();
//   for (let i = 0; i < numLetters; i++) {
//     letterFreqByPosition.set(i, new MapWithDefault(() => 0));
//   }
//   for (const word of validWords) {
//     for (let i = 0; i < numLetters; i++) {
//       const letter = word[i];
//
//       // whole word
//       letterFreqWholeWord.set(letter, letterFreqWholeWord.get(letter) + 1);
//
//       // by position
//       let positionLetterFreq = letterFreqByPosition.get(i)
//       positionLetterFreq.set(letter, positionLetterFreq.get(letter) + 1);
//     }
//   }
//
//   // get score
//   for (const word of validWords) {
//     let score = 0;
//     for (let i = 0; i < numLetters; i++) {
//       const letter = word[i];
//       score += letterFreqWholeWord.get(letter)
//       score += letterFreqByPosition.get(i).get(letter);
//     }
//     wordScores.get(score).push(word)
//   }
//
//   return new Map([...wordScores.entries()].sort((a, b) => (b[0] - a[0])))  // sort by descending score
// }

function getLetterCounts(word) {
  let letterCounts = new MapWithDefault(() => 0)

  for (const letter of word) {
    letterCounts.set(letter, letterCounts.get(letter) + 1);
  }

  return letterCounts
}

function newDuplicatesMinimized(word, maxNewDuplicates) {
  let newDuplicates = 0;
  let letterCounts = getLetterCounts(word);
  for (const [letter, count] of letterCounts) {
    if (count == 1) {
      continue;
    }

    // if (knownLetterMinCounts.has(letter)) {
    //   newDuplicates += count - 1 - knownLetterMinCounts.get(letter);
    // } else {
    //   newDuplicates += count - 1;
    // }

    newDuplicates += count - 1;
  }

  if (newDuplicates <= maxNewDuplicates) {
    return true;
  }
  return false;
}

function getNextWordOptions() {
  let maxScore = 0;
  let matchedWords = new Set();
  let sortedWordScores = getSortedWordScores();
  let dupIdtoTopWords = new MapWithDefault(() => []);
  let topWords = new Map();

  for (let maxNewDuplicates = 0; maxNewDuplicates < numLetters; maxNewDuplicates++) {
    for (const [score, words] of sortedWordScores) {
      if (score < maxScore) {
        break;
      }
      for (const word of words) {
        if (matchedWords.has(word)) {
          continue;
        }
        if (newDuplicatesMinimized(word, maxNewDuplicates)) {
          matchedWords.add(word);
          const dupId = `${maxNewDuplicates}|${score}`;
          dupIdtoTopWords.get(dupId).push(word);
          topWords.set(word, `duplicate letters: ${maxNewDuplicates}`)
          maxScore = score
        }
      }
    }
  }

  return topWords;
}

function union(setA, setB) {
  let _union = new Set(setA)
  for (let elem of setB) {
    _union.add(elem)
  }
  return _union
}

function arrayFirstMatchingValueRemoved(arr, value) {
  let updatedArr = [];
  valRemoved = false;
  for (const item of arr) {
    if (!valRemoved & item === value) {
      valRemoved = true;
    } else {
      updatedArr.push(item);
    }
  }
  return updatedArr;
}

/*
correct: "+"
incorrect, in word but wrong spot: "o"
incorrect, not in word: "-"
*/
function getGuessResult(guess) {
  let remaining = [];
  let guessMap = new Map();
  let results = [];

  // first look for correct letters
  for (let i = 0; i < numLetters; i++) {
    const g = guess[i];
    const o = ooo[i];
    if (g == o) {
      results.push("+");
    } else {
      results.push(null);
      remaining.push(o);
      guessMap.set(i, g);
    }
  }

  // evaluate incorrect letters
  for (const [i, letter] of guessMap) {
    if (remaining.includes(letter)) {
      results[i] = "o";
      remaining = arrayFirstMatchingValueRemoved(remaining, letter);
    } else {
      results[i] = "-"
    }
  }

  return results.join("")
}

function evaluateGuess(guessWord, guessResult) {
  if (guessWord.length != numLetters | guessResult.length != numLetters) {
    throw `guessed word and result must both contain ${numLetters} letters`
  }
  let guessKnownLetterMinCounts = new MapWithDefault(() => 0);
  let guessLettersByResult = new Map([
    ["+", new Set()],
    ["o", new Set()],
    ["-", new Set()]
  ])

  for (let i = 0; i < numLetters; i++) {
    const guessLetter = guessWord[i];
    const guessLetterResult = guessResult[i];

    guessLettersByResult.get(guessLetterResult).add(guessLetter)

    if (guessLetterResult == "+") {
      indexToCorrectLetter.set(i, guessLetter);
      indexToWrongLetters.delete(i);
      guessKnownLetterMinCounts.set(guessLetter, guessKnownLetterMinCounts.get(guessLetter) + 1);
    } else if (guessLetterResult == "o") {
      if (indexToWrongLetters.has(i)) {
        indexToWrongLetters.get(i).add(guessLetter);
      }
      guessKnownLetterMinCounts.set(guessLetter, guessKnownLetterMinCounts.get(guessLetter) + 1);
    } else if (guessLetterResult == "-") {
      if (indexToWrongLetters.has(i)) {
        indexToWrongLetters.get(i).add(guessLetter);
      }
    } else {
      throw "guess result can only contain '+', 'o', or '-' characters";
    }
  }

  // identify wrong letters and see if any max counts can be identified
  let guessWrongLetters = new Set();
  for (const wrongLetter of guessLettersByResult.get("-")) {
    if (guessKnownLetterMinCounts.has(wrongLetter)) {
      knownLetterMaxCounts.set(wrongLetter, guessKnownLetterMinCounts.get(wrongLetter));
    }
    if (!guessLettersByResult.get("o").has(wrongLetter)) {
      guessWrongLetters.add(wrongLetter);
    }
  }

  // add all wrong letters to list for each index
  for (let i = 0; i < numLetters; i++) {
    if (!indexToWrongLetters.has(i)) {
      continue;
    }
    indexToWrongLetters.set(i, union(indexToWrongLetters.get(i), guessWrongLetters))
  }

  // update known letter minimum counts
  for (const [guessLetter, guessMinCount] of guessKnownLetterMinCounts) {
    if (knownLetterMinCounts.has(guessLetter)) {
      let priorMinCount = knownLetterMinCounts.get(guessLetter);
      if (guessMinCount > priorMinCount) {
        knownLetterMinCounts.set(guessLetter, guessMinCount);
      }
    } else {
      knownLetterMinCounts.set(guessLetter, guessMinCount);
    }
  }
}

function updateRegEx() {
  regex = "";
  for (let i = 0; i < numLetters; i++) {
    if (indexToWrongLetters.has(i)) {
      regex += `[^${[...indexToWrongLetters.get(i)].join("")}]`;
    } else if (indexToCorrectLetter.has(i)) {
      regex += indexToCorrectLetter.get(i);
    } else {
      throw `position index ${i} has neither wrong letters nor correct letters defined`
    }
  }
}

function updateValidWords() {
  let updatedWordList = new Set();

  for (const word of validWords) {

    if (!word.match(regex)) {
      continue;
    }

    let hasCorrectLetterCounts = true;
    let letterCounts = getLetterCounts(word);
    for (const [letter, minCount] of knownLetterMinCounts) {
      let count = letterCounts.get(letter);
      if (count < minCount) {
        hasCorrectLetterCounts = false;
        break;
      }
      if (knownLetterMaxCounts.has(letter)) {
        const maxCount = knownLetterMaxCounts.get(letter);
        if (count > maxCount) {
          hasCorrectLetterCounts = false;
          break;
        }
      }
    }
    if (hasCorrectLetterCounts) {
      updatedWordList.add(word);
    }
  }

  validWords = updatedWordList;
}

function updateValidWordsText() {
  $("#num-valid-words").text(`Count: ${validWords.size}`);
  $("#valid-words-box").text(`${[...validWords].join(", ")}`);
}

function evaluateGuessAndGetNextWordOptions(guessWord, guessResult) {
  evaluateGuess(guessWord, guessResult);
  updateRegEx();
  updateValidWords();
  updateValidWordsText();
  topWords = getNextWordOptions();
}



/*
 *
 * Interact with fontend
 *
 *
 */

let clientIP = "";

$.getJSON("https://api.ipify.org?format=json", function(data) {
  clientIP = data.ip;
})

function buildTopWordsSelector() {
  $(".top-word-option").remove()
  for (const [word, description] of topWords) {
    let topWordHTML = `<div class="d-flex flex-row align-items-center top-word-option"><div><button type="button" class="btn btn-primary top-word-button btn-lg" id="${word}-suggested-button">${word}</button></div><div>${description}</div></div>`;
    $(".top-word-suggestions").append(topWordHTML);
  }
}

function addEmptyTilesRow(row) {
  let tilesHTMLs = [];
  for (let i = 0; i < numLetters; i++) {
    tileHTML = `<div class="col"><div class="tile" id="row${row}col${i}"></div></div>`
    tilesHTMLs.push(tileHTML);
  }
  let emptyTilesRow = `<div class="row">${tilesHTMLs.join("")}</div>`
  $(".letter-tiles-grid").append(emptyTilesRow);
}

function getLetterId(i) {
  return `row${round - 1}col${i}`;
}

function addLetterToTile(letter, i) {
  $(`#${getLetterId(i)}`).text(letter);
}

function addGuessLettersToTiles(guess) {
  for (let i = 0; i < numLetters; i++) {
    const letter = guess[i];
    addLetterToTile(letter, i);
  }
}

function colorGuess(guess, guessResult) {
  for (let i = 0; i < numLetters; i++) {
    const letter = guess[i];
    const result = guessResult[i];
    const letterId = getLetterId(i);
    let color = "";
    if (result == "+") {
      color = "green";
    } else if (result == "o") {
      color = "yellow";
    } else if (result == "-") {
      color = "gray";
    } else {
      throw `guess result values can only be '+', 'o', '-', not '${result}'`
    }

    // color tile
    $(`#${letterId}`).css("background-color", `var(--${color})`);
    $(`#${letterId}`).css("color", "white");
    $(`#${letterId}`).css("border", "none");

    // color keyboard key
    let keyCode = letterToKeyCode.get(letter);
    let key = $(`#${keyCode}`);
    let keyColor = key.css("background-color");
    if (keyColor == lightGrayRGB) {
      key.css("background-color", `var(--${color})`);
      key.css("color", "white")
    } else if (keyColor == grayRGB) {
      if (color == "yellow" | color == "green") {
        key.css("background-color", `var(--${color})`);
        key.css("color", "white")
      }
    } else if (keyColor == yellowRGB) {
      if (color == "green") {
        key.css("background-color", `var(--${color})`);
        key.css("color", "white")
      }
    }
  }
}

function submitGuessResult(guessResult) {
  let suggestionsButtonText = $("#suggestions-button").text();
  let suggestionsVisible = "true";
  if (suggestionsButtonText.search("Show") >= 0) {
    suggestionsVisible = "false";
  }

  let suggested = "false";
  if ($(`#${guess}-suggested-button`).length) {  // suggested button for word exists
    suggested = "true";
  }

  $("#guess-form-game-date").val(date);
  $("#guess-form-client-ip").val(clientIP);
  $("#guess-form-round").val(round);
  $("#guess-form-guess-word").val(guess);
  $("#guess-form-result").val(guessResult);
  $("#guess-form-suggested").val(suggested);
  $("#guess-form-suggestions-visible").val(suggestionsVisible);
  $("#guess-form-submit-button").click();
}



function keyActions(key, keyCode) {
  if ($(".overlay").length) {  // overlay exists
    if (keyCode == 13) {
      $(".overlay-button").click();
    }
  } else {
    if (keyCode >= 65 & keyCode <= 90) { // key is letter A - Z
      if (ownWordIndex < numLetters) {
        addLetterToTile(key.toLowerCase(), ownWordIndex);
        ownWord += key;
        ownWordIndex++;
      }
    } else if (keyCode == 8) { // key is backspace / delete
      if (ownWordIndex > 0) {
        ownWordIndex -= 1;
        ownWord = ownWord.slice(0, ownWordIndex);
        addLetterToTile(" ", ownWordIndex);
        if (guess) {
          guess = null;
        }
      }
    } else if (keyCode == 13) { // key is enter
      if (ownWord.length == numLetters) {
        if (wordleAcceptableWords.has(ownWord)) {
          guess = ownWord;
          processGuess();
        } else {
          let invalidWordOverlay = `<div class="overlay"><h2>"${ownWord}" not in Wordle word list</h2><p>Please enter a different word.</p><button class="overlay-button continue">Continue</button></div>`
          $(invalidWordOverlay).insertBefore($("#main-content"));
          $("#date-selector-button").prop("disabled", true);
        }
      }
    }
  }
}

// when key is pressed
$(document).on("keydown", function(event) {
  const key = event.key;
  const keyCode = event.keyCode;
  keyActions(key, keyCode);
})

// when keyboard button is clicked
$(".button-key").mousedown(function() {
  let key = $(this).text();
  let keyCode = this.id;
  keyActions(key, keyCode);
})

function processGuess() {
  guessResult = getGuessResult(guess);
  colorGuess(guess, guessResult);
  submitGuessResult(guessResult);

  // check if found final word
  let resultsSet = new Set(guessResult);
  if (resultsSet.size == 1 & resultsSet.has("+")) {
    endGame("won");
    return;
  }

  evaluateGuessAndGetNextWordOptions(guess, guessResult);
  buildTopWordsSelector();
  if (validWords.size == 0) {
    endGame("lost");
    return;
  }
  round++;
  guess = null;
  ownWord = "";
  ownWordIndex = 0;
  if (!$(`#row${round - 1}col0`).length) {  // row of tiles for round doesn't exist
    addEmptyTilesRow(round - 1);
  }
}

// when top word button gets clicked
$(document).on("click", '.top-word-button', function() {
  guess = this.innerText;
  addGuessLettersToTiles(guess);
  ownWord = guess;
  ownWordIndex = 5;
  processGuess();
})

// when suggestions button gets clicked
$("#suggestions-button").click( function() {
  let buttonText = this.innerText;
  if (buttonText.search("Show") >= 0) {
    $(this).text("Hide Suggestions");
    $("#suggestions").show();
  } else if (buttonText.search("Hide") >= 0) {
    $(this).text("Show Suggestions");
    $("#suggestions").hide();
  } else {
    throw "suggestions button must contain 'Show' or 'Hide'"
  }
  $(this).blur();
})

function toggleAbout() {
  $("#about").toggle();
}

$("#restart-button").click( function() {
  $(this).blur();
  restartGame();
})

function endGame(verdict) {
  let header = null;
  if (verdict == "won") {
    header = `You found "${ooo}"!`;
  } else if (verdict == "lost") {
    header = "No answers remain :("
  } else {
    throw "verdict can only be 'won' or 'lost'";
  }
  let endgameOverlay = `<div class="overlay"><h2>${header}</h2><p>Want to play again?</p><p>Remember: you can also play Wordle from any date in the past.</p><button class="overlay-button play-again">Let's go</button></div>`
  $(endgameOverlay).insertBefore($("#main-content"));
  $("#date-selector-button").prop("disabled", true);
}

// when play again? button is clicked
$(document).on("click", ".play-again", function() {
  $(".overlay").remove();
  $("#date-selector-button").prop("disabled", false);
  restartGame();
})

// when continue button is clicked
$(document).on("click", ".continue", function() {
  $(".overlay").remove();
  $("#date-selector-button").prop("disabled", false);
})

function dateChange() {
  let newDate = $("#date-selector-button").val();
  $("#bad-date-message").remove();  // if present
  $("#date-selector-button").blur();  // remove focus from date selector; prevent keyboard event interference
  if (!newDate | newDate < earliestDate | newDate > today) {
    $("#date-box").append(`<p id="bad-date-message">Invalid date; still using ${date}<p>`);
  } else {
    date = newDate;

    restartGame();
  }
}
