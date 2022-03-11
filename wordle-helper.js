// Global variables
const today = getDateToday();
const earliestDate = "2021-06-19";
const maxPuzzleNumber = convertDateToPuzzleNumber(today);
let date = today;
let currentPuzzleNumber = maxPuzzleNumber;
const urlParams = getURLParams();
const urlDate = urlParams.get("date");
if (isValidDate(urlDate)) {
  date = urlDate;
}
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
let guessIconsByRound = [];
let guessResultsByPosition = null;
let ooo = null;
let customOOO = null;
let customShareLink = null;

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
const guessResultCharacterToIcon = new Map([
  ["+", "🟩"],  // "&#129001;"
  ["o", "🟨"],  // "&#129000;"
  ["-", "⬜"],  // "&#11036;"
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
seeIfCustomWordle();



function getDateToday() {
  let today = new Date();
  const offset = today.getTimezoneOffset();
  today = new Date(today.getTime() - (offset * 60 * 1000));
  return convertDateToString(today)
}

function convertDateToString(dateObj) {
  dateStr = dateObj.toISOString().split("T")[0];
  return dateStr;
}

function convertDateToPuzzleNumber(datestr) {
  return (new Date(datestr) - new Date(earliestDate)) / (1000 * 60 * 60 * 24);
}

function convertPuzzleNumberToDate(puzzleNumber) {
  puzzleDate = new Date(earliestDate);  // initialize
  const offset = puzzleDate.getTimezoneOffset();
  puzzleDate.setTime(puzzleDate.getTime() + (offset * 60 * 1000))
  puzzleDate.setDate(puzzleDate.getDate() + puzzleNumber);
  return convertDateToString(puzzleDate)
}

function getURLParams() {
  const queryString = window.location.search;
  if (queryString) {
    return new URLSearchParams(queryString);
  }
  return new Map();
}

function seeIfCustomWordle() {
  const encryptedCustom = urlParams.get("custom");
  if (encryptedCustom) {
    let customLetters = [];
    for (let i = 0; i < numLetters; i++) {
      let letter = encryptedCustom[i];
      customLetters.push(xxxCustom.get(i).get(letter));
    }
    customOOO = customLetters.join("");
    $("#custom-wordle").val(customOOO);
    $("#custom-wordle-submit-button").click();
  }
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
  let dateSelectorHTML = `<label class="date-selector" for="date-selector-button">Wordle date:</label>\n<input type="date" class="date-selector" id="date-selector-button" value="${date}" min="${earliestDate}" max="${today}" onchange="dateChange();">`;
  let puzzleNumberLinksHTML = "";
  for (let i = maxPuzzleNumber; i >= 0; i--) {
    puzzleNumberLinksHTML += `<a href="#" onclick="puzzleNumberChange(${i});">${i}</a>`
  }
  let puzzleNumberDropdownHTML = `<div class="dropdown">
    <button class="btn btn-primary btn-lg dropbtn" id="puzzle-selector-button">#${maxPuzzleNumber}</button>
    <div class="dropdown-content">${puzzleNumberLinksHTML}</div>
  </div>`

  $("#date-box").append(dateSelectorHTML);
  $("#date-box").append(puzzleNumberDropdownHTML);
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
  guessIconsByRound = [];
  guessResultsByPosition = [];
  for (let i = 0; i < numLetters; i++) {
    guessResultsByPosition.push(null);
  }
  if (customOOO) {
    ooo = customOOO;
  } else {
    ooo = getOOO();
  }

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

  let dateVal = date;
  if (customOOO) {
    dateVal = "custom";
  }

  $("#guess-form-game-date").val(dateVal);
  $("#guess-form-client-ip").val(clientIP);
  $("#guess-form-round").val(round);
  $("#guess-form-guess-word").val(guess);
  $("#guess-form-result").val(guessResult);
  $("#guess-form-suggested").val(suggested);
  $("#guess-form-suggestions-visible").val(suggestionsVisible);
  $("#guess-form-custom-word").val(customOOO);
  $("#guess-form-submit-button").click();
}

function keyActions(key, keyCode) {
  if ($(".overlay").length) {  // overlay exists
    if (keyCode == 13 | keyCode == 8) {  // key is enter or delete
      $(".overlay-button").click();
    }
  } else {  // no overlay
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
      if ($("#custom").is(":visible")) {
        $("#custom-wordle-submit-button").click();
      } else if (ownWord.length == numLetters) {
        if (wordleAcceptableWords.has(ownWord)) {
          guess = ownWord;
          processGuess();
        } else {
          let invalidWordOverlay = `<div class="overlay invalid-word"><h2>"${ownWord}" not in Wordle word list</h2><p>Please enter a different word.</p><button class="btn btn-primary overlay-button continue">Continue</button></div>`
          $("#main-content").prepend(invalidWordOverlay);
          $("#date-selector-button").prop("disabled", true);
        }
      }
    }
  }
}

// when key is pressed
$(document).on("keydown", function(event) {
  const key = event.key.toLowerCase();
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

  // guess icons
  let guessIcons = "";
  for (const letterResult of guessResult) {
    guessIcons += guessResultCharacterToIcon.get(letterResult);
  }
  guessIconsByRound.push(guessIcons);

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
  $("#about-button").blur();
  $("#custom").hide();
}

function toggleCustom() {
  $("#custom").toggle();
  $("#custom-button").blur();
  $("#custom-wordle").select();
  $("#about").hide();
}

$("#restart-button").click( function() {
  $(this).blur();
  restartGame(ooo);
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
  let endgameOverlay = `<div class="overlay"><h2>${header}</h2><p id="guessIcons">${guessIconsByRound.join("<br>")}<br><button class="btn btn-secondary" id="copy-to-clipboard-button">Copy to Clipboard</button></p><p>Want to play again?</p><p>Remember: you can also play Wordle from any date in the past.</p><button class="btn btn-primary overlay-button play-again">Play again</button></div>`;
  $("#date-box").append(endgameOverlay);
  $("#date-selector-button").prop("disabled", true);
}

function getShareLink() {
  let shareLink = "wordlereplay.com/?";
  if (customOOO) {
    let encryptedLetters = [];
    for (let i = 0; i < numLetters; i++) {
      let letter = customOOO[i];
      encryptedLetters.push(customXXX.get(i).get(letter));
    }
    const encryptedCustom = encryptedLetters.join("");
    shareLink += `custom=${encryptedCustom}`;
  } else {
    shareLink += `date=${date}`;
  }
  return shareLink;
}

function animateCopy(element) {
  let origBackgroundColor = element.css("background-color");
  element.css("background-color", "green");
  element.text("Copied! ✔");
  setTimeout(function () {
    element.css("background-color", origBackgroundColor);
    element.text("Copy to Clipboard");
  }, 2000);
  element.blur();
}

// when copy to clipboard button clicked
$(document).on("click", "#copy-to-clipboard-button", function() {
  let shareLink = getShareLink();
  let dateText = date;
  if (customOOO) {
    dateText = "custom"
  }
  let shareText = `Wordle #${currentPuzzleNumber} ${dateText}\nGuesses: ${round}\n\n${guessIconsByRound.join("\n")}\n\n${shareLink}`;
  navigator.clipboard.writeText(shareText);
  animateCopy($("#copy-to-clipboard-button"));
})

// when play again? button is clicked
$(document).on("click", ".play-again", function() {
  $(".overlay").remove();
  $("#date-selector-button").prop("disabled", false);
  restartGame(ooo);
})

// when continue button is clicked
$(document).on("click", ".continue", function() {
  $(".overlay").remove();
  $("#date-selector-button").prop("disabled", false);
})

function isValidDate(newDate) {
  if (!newDate | newDate < earliestDate | newDate > today) {
    return false;
  }
  return true;
}

function dateChange() {
  const newDate = $("#date-selector-button").val();
  $("#bad-date-message").remove();  // if present
  $("#date-selector-button").blur();  // remove focus from date selector; prevent keyboard event interference
  if (isValidDate(newDate)) {
    date = newDate;
    currentPuzzleNumber = convertDateToPuzzleNumber(date);
    $("#puzzle-selector-button").text(`#${currentPuzzleNumber}`)
    restartGame();
  } else {
    $("#date-box").append(`<p id="bad-date-message" class="bad-message">Invalid date; still using ${date}<p>`);
  }
}

// when puzzle number selector clicked
$(document).on("click", "#puzzle-selector-button", function () {
  $(".dropdown-content").toggle();
})

function puzzleNumberChange(puzzleNumber) {
  if (puzzleNumber > maxPuzzleNumber) {
    return
  }
  const newDate = convertPuzzleNumberToDate(puzzleNumber);
  $("#date-selector-button").val(newDate);
  $("#puzzle-selector-button").text(`#${puzzleNumber}`)
  $("#puzzle-selector-button").click();
  dateChange();
}

function clickSubmit() {
  let newOoo = $("#custom-wordle").val().toLowerCase();
  if (wordleAcceptableWords.has(newOoo)) {
    customOOO = newOoo;
    restartGame();
    $("#custom-wordle").val("");
    $("#custom-wordle-submit-button").hide();

    customShareLink = getShareLink();
    const shareLinkHTMLText = `Custom word set; now you can play your own Wordle!<br>Share the following link with family and friends to see if they can guess your word:<br><br><a href="${"https://" + customShareLink}" target="_blank" rel="noopener noreferrer">${customShareLink}</a>`
    $("#custom-wordle-share-text").html(shareLinkHTMLText);
    $("#custom-wordle-copy-clipboard").show();

    // clear and hide date/number selector
    $(".date-selector").hide()
    $(".dropdown").hide()
    $("#wordle-by-date-button").show();

    $("#custom-wordle").blur();
  } else {
    // display invalid word message
    $("#custom-wordle-text").append(`<span id="bad-custom-word" class="bad-message">Word not in Wordle word list; try another<span>`);
    // remove any previous custom word link
    $("#custom-wordle-share-text").html("");
    $("#custom-wordle-copy-clipboard").hide();
    setTimeout(function () {
      $("#bad-custom-word").remove();
    }, 2000);
  }
}

$("#wordle-by-date-button").click( function() {
  $("#wordle-by-date-button").hide();
  $(".date-selector").show();
  $(".dropdown").show();
  customOOO = null;
  restartGame();
})

$("#custom-wordle-copy-clipboard").click( function() {
  navigator.clipboard.writeText(customShareLink);
  animateCopy($("#custom-wordle-copy-clipboard"));
})
