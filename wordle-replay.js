// Global variables
const todayRaw = new Date();
const today = getDateToday();
const earliestDate = "2021-06-19";
let ooo = null;
let date = today;
let maxPuzzleNumber = null;
getMaxes();

let currentPuzzleNumber = maxPuzzleNumber;
const urlParams = getURLParams();
const urlDate = urlParams.get("date");
const urlNum = Number(urlParams.get("num"));
if (!urlNum && isValidDate(urlDate)) {
  date = urlDate;
  updateCurrentPuzzleNumber();
}
if (!urlDate && isValidNum(urlNum)) {
  date = puzzleNumToDate.get(Number(urlNum));
  updateCurrentPuzzleNumber();
}
const solvedKeyLocalStorage = "wordlereplay-solved";
let solved = getItemLocalStorage(solvedKeyLocalStorage);
if (!solved) {
  solved = {};
}
const distKeyLocalStorage = "wordlereplay-dist";
let dist = getItemLocalStorage(distKeyLocalStorage);
if (!dist) {
  dist = {"total": 0};
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
let guesses = [];
let guessIconsByRound = [];
let remainingValidWordsByRound = [];
let guessResultsByPosition = null;
let customOOO = null;
let customShareLink = null;
let isDarkMode = false;

const defaultNumTries = 6;
const greenRGB = getCSSVariable("green");
const yellowRGB = getCSSVariable("yellow");
const grayRGB = getCSSVariable("gray");
const lightGrayRGB = getCSSVariable("lightgray");
const darkKeyRGB = getCSSVariable("darkkey");
const darkGreenRGB = getCSSVariable("darktrue-green");
const darkYellowRGB = getCSSVariable("darktrue-yellow");
const darkGrayRGB = getCSSVariable("darktrue-gray");
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
buildDateAndPuzzleNumberSelectors();
startGame();
seeIfCustomWordle();
checkForDarkMode();


function getDateToday() {
  const offset = todayRaw.getTimezoneOffset();
  todayOffset = new Date(todayRaw.getTime() - (offset * 60 * 1000));
  return convertDateToString(todayOffset)
}

function convertDateToString(dateObj) {
  dateStr = dateObj.toISOString().split("T")[0];
  return dateStr;
}

function getMaxes() {
  ooo = dateToWord.get(today);
  let dateToCheck = today;
  while (!ooo && dateToCheck >= earliestDate) {
    let priorDate = subtractOneDay(dateToCheck);
    ooo = dateToWord.get(priorDate);
    dateToCheck = priorDate;
  }
  date = dateToCheck;
  maxPuzzleNumber = dateToPuzzleNum.get(date);
}

function isValidDate(newDate) {
  if (!newDate || newDate < earliestDate || newDate > today) {
    return false;
  }
  return true;
}

function isValidNum(newNum) {
  if (newNum == 0) {
    return true;
  }
  if (!newNum || newNum < 0 || newNum > maxPuzzleNumber) {
    return false;
  }
  return true;
}

function convertStringToDate(dateStr) {
  const dt = new Date(dateStr);
  // console.log(date)
  const offset = dt.getTimezoneOffset();
  dt.setTime(dt.getTime() + (offset * 60 * 1000))
  return dt
}

function subtractOneDay(dateStr) {
  const dt = convertStringToDate(dateStr)
  dt.setDate(dt.getDate() - 1);
  // console.log("prior day:", date)
  return convertDateToString(dt);
}

function updateCurrentPuzzleNumber() {
  currentPuzzleNumber = dateToPuzzleNum.get(date);
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

function getItemLocalStorage(key) {
  const valueJsonStr = window.localStorage.getItem(key);
  return JSON.parse(valueJsonStr);
}

function setItemLocalStorage(key, value) {
  const valueJsonStr = JSON.stringify(value);
  return window.localStorage.setItem(key, valueJsonStr);
}

function getOOO() {
  return dateToWord.get(date);
}

function buildDateAndPuzzleNumberSelectors() {
  let dateSelectorHTML = `<label class="date-selector main-input" for="date-selector-button">Wordle date:</label>\n<input type="date" class="date-selector" id="date-selector-button" value="${date}" min="${earliestDate}" max="${today}" onchange="dateChange();">`;
  
  // Puzzle Number Drop Down
  let puzzleNumberLinksHTML = "";
  for (let i = maxPuzzleNumber; i >= 0; i--) {
    puzzleNumberLinksHTML += `<a ${i in solved ? 'class="solved"' : ""} id="puzzle-dropdown-${i}" href="#" onclick="puzzleNumberChange(${i});">${i}</a>`
  }
  let puzzleNumberDropdownHTML = `<div class="dropdown">
    <button class="btn btn-primary btn-lg dropbtn" id="puzzle-selector-button"></button>
    <div class="dropdown-content">${puzzleNumberLinksHTML}</div>
  </div>`

  $("#date-box").append(dateSelectorHTML);
  $("#date-box").append(puzzleNumberDropdownHTML);
  if (dist.total <= maxPuzzleNumber) {
    $("#date-box").append(`<button class="btn btn-primary btn-lg" id="play-earliest-unsolved-button" onClick="playEarliestUnsolved()">Earliest Unsolved</button>`)
  }
  displayOrHideAnswerButton();
}

function displayOrHideAnswerButton() {
  if (currentPuzzleNumber != null && currentPuzzleNumber in solved) {
    const solvedData = solved[currentPuzzleNumber];
    const solvedDate = solvedData.solvedDate;
    const daysAgo = getDaysAgo(solvedDate); 
    $("#view-answer-text").text(`Solved on ${solvedDate} (${daysAgo} ${daysAgo != 1 ? "days" : "day"} ago) in ${solvedData.guesses.length} ${solvedData.guesses.length != 1 ? "guesses" : "guess"}`);
    $("#view-answer").show();
  } else {
    $("#view-answer").hide();
  }
  $("#overwrite-guesses-checkbox").prop("checked", false)  // default: don't overwrite
}


function getDaysAgo(oldDateStr) {
  oldDate = new Date(oldDateStr);
  currentDate = new Date(today);
  const diff = currentDate.getTime() - oldDate.getTime();
  return diff / (1000 * 3600 * 24);
}

function isChecked(id) {
  return $('#' + id).is(":checked");
}


function addEmptyGuessRows() {
  for (let row = 0; row < defaultNumTries; row++) {
    addEmptyTilesRow(row);
  }
}

function checkForDarkMode() {
  const todayHours = todayRaw.getHours();
  const isDayTime = todayHours > 6 && todayHours < 20;
  if (!isDayTime) {
    setToDarkMode();
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
  guesses = [];
  guessIconsByRound = [];
  remainingValidWordsByRound = [];
  guessResultsByPosition = [];
  for (let i = 0; i < numLetters; i++) {
    guessResultsByPosition.push(null);
  }
  if (customOOO) {
    ooo = customOOO;
  } else {
    ooo = getOOO();
    updateCurrentPuzzleNumber();
    $("#puzzle-selector-button").text(`#${currentPuzzleNumber}`);
    if (currentPuzzleNumber in solved) {
      $("#puzzle-selector-button").removeClass("btn-primary").addClass("btn-success");
    } else {
      $("#puzzle-selector-button").removeClass("btn-success").addClass("btn-primary");
    }
    $("#play-earliest-unsolved-button").show();
  }

  validWords = wordleAcceptableWords;
  updateValidWordsText();
  topWords = getNextWordOptions();
  buildTopWordsSelector();
  addEmptyGuessRows();
  displayOrHideAnswerButton();
}

function restartGame() {
  $(".letter-tiles-grid").empty();
  for (const [letter, keyCode] of letterToKeyCode) {
    if (isDarkMode) {
      $(`#${keyCode}`).css("background-color", "var(--darkkey)");
      $(`#${keyCode}`).css("color", "white");
    } else {
      $(`#${keyCode}`).css("background-color", "var(--lightgray)");
      $(`#${keyCode}`).css("color", "initial");
    }
  }
  resume();
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
  if (guessWord.length != numLetters || guessResult.length != numLetters) {
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
  setTileBorder();
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
    $(`#${letterId}`).css("background-color", `var(--dark${isDarkMode}-${color})`);
    $(`#${letterId}`).css("color", "white");
    $(`#${letterId}`).css("border", "none");

    // color keyboard key
    let keyCode = letterToKeyCode.get(letter);
    let key = $(`#${keyCode}`);
    let keyColor = key.css("background-color");
    if (keyColor == lightGrayRGB || keyColor == darkKeyRGB) {
      key.css("background-color", `var(--dark${isDarkMode}-${color})`);
      key.css("color", "white")
    } else if (keyColor == grayRGB || keyColor == darkGrayRGB) {
      if (color == "yellow" || color == "green") {
        key.css("background-color", `var(--dark${isDarkMode}-${color})`);
        key.css("color", "white")
      }
    } else if (keyColor == yellowRGB || keyColor == darkYellowRGB) {
      if (color == "green") {
        key.css("background-color", `var(--dark${isDarkMode}-${color})`);
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

function setOverlayBackgroundColor() {
  $(".overlay").css("background-color", `var(--dark${isDarkMode}-blue)`);
}

function setTileBorder() {
  const border = isDarkMode ? "var(--darktrue-border)" : "var(--border)";
  $(".tile").css("border", border);
}

function keyActions(key, keyCode) {
  if ($(".overlay").length) {  // overlay exists
    if (keyCode == 13 || keyCode == 8) {  // key is enter or delete
      $(".overlay-button").click();
    }
  } else if ($("#custom").is(":visible")) {
    if (keyCode == 13) {
      $("#custom-wordle-submit-button").click();
    }
  } else {  // no overlay or custom pane
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
          let invalidWordOverlay = `<div class="overlay invalid-word"><h2>"${ownWord}" not in Wordle word list</h2><p>Please enter a different word.</p><button class="btn btn-primary overlay-button continue">Continue</button></div>`
          $("#main-content").prepend(invalidWordOverlay);
          setOverlayBackgroundColor();
          disableMainInputs();
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

function processGuess(submitGuess = true) {
  guessResult = getGuessResult(guess);
  colorGuess(guess, guessResult);
  if (submitGuess) {
    submitGuessResult(guessResult);
  }

  // store guesses
  guesses.push(guess)

  // guess icons
  let guessIcons = "";
  for (const letterResult of guessResult) {
    guessIcons += guessResultCharacterToIcon.get(letterResult);
  }
  guessIconsByRound.push(guessIcons);

  // check if found final word
  let resultsSet = new Set(guessResult);
  if (resultsSet.size == 1 & resultsSet.has("+")) {
    remainingValidWordsByRound.push(0);  // no remaining words
    endGame("won");
    return;
  }

  evaluateGuessAndGetNextWordOptions(guess, guessResult);

  // store number of valid words remaining after guess
  remainingValidWordsByRound.push(validWords.size)

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
    if (isDarkMode) {
      $(".tile").css("border", "var(--darktrue-border)")
    }
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
  $("#history").hide();
}

function toggleCustom() {
  $("#custom").toggle();
  $("#custom-button").blur();
  $("#custom-wordle").select();
  $("#about").hide();
  $("#history").hide();
}

function setToDarkMode() {
  $("body").css("background-color", "var(--darkbackground)");
  $("body").css("color", "white");
  $(".button-key").css("background-color", "var(--darkkey)");
  $(".button-key").css("color", "white");
  $("#header").css("border-bottom", "var(--darktrue-border)");
  $(".tile").css("border", "var(--darktrue-border");
  $("#date-selector-button").css("background-color", "var(--darkbackground)");
  $("#date-selector-button").css("color", "white");
  $("#custom-wordle").css("background-color", "var(--darkbackground)");
  $("#custom-wordle").css("color", "white");
  $("pre").css("color", lightGrayRGB);
  isDarkMode = true;
}

function toggleDarkMode() {
  restartGame();
  if (isDarkMode) {
    $("body").css("background-color", "initial");
    $("body").css("color", "initial");
    $(".button-key").css("background-color", "var(--lightgray)");
    $(".button-key").css("color", "initial");
    $("#header").css("border-bottom", "var(--border)")
    $(".tile").css("border", "var(--border");
    $("#date-selector-button").css("background-color", "initial");
    $("#date-selector-button").css("color", "initial");
    $("#custom-wordle").css("background-color", "initial");
    $("#custom-wordle").css("color", "initial");
    $("pre").css("color", "initial");
    isDarkMode = false;
  } else {
    setToDarkMode();
  }
  setOverlayBackgroundColor();
  $("#dark-mode-button").blur();
}

$("#restart-button").click( function() {
  $(this).blur();
  const restartOverlay = `<div class="overlay"><h2>Are you sure you want to restart?</h2><button class="btn btn-primary overlay-button continue">No</button> <button class="btn btn-danger" onClick="restartGame(ooo)">Yes</button></div>`
  $("#main-content").prepend(restartOverlay);
  setOverlayBackgroundColor();
  disableMainInputs();
})

function endGame(verdict) {
  let header = null;
  if (verdict == "won") {
    header = `You found ${ooo.toUpperCase()}!`;
    if (currentPuzzleNumber != null) {
      if (!(currentPuzzleNumber in solved) || isChecked("overwrite-guesses-checkbox")) {
        addGuessesToLocalStorage();
      }
      $(`#puzzle-dropdown-${currentPuzzleNumber}`).addClass("solved");
    }
  } else if (verdict == "lost") {
    header = "No answers remain :("
  } else {
    throw "verdict can only be 'won' or 'lost'";
  }
  let nextDisabled = ""
  if (currentPuzzleNumber >= maxPuzzleNumber) {
    nextDisabled = "disabled"
  }
  let previousDisabled = ""
  if (currentPuzzleNumber <= 0) {
    previousDisabled = "disabled"
  }
  let playPriorUnsolvedButtonHTML = `<button class="btn btn-primary overlay-button" onclick="playPreviousUnsolved();" ${previousDisabled}>⇐ Prior unsolved</button>`;
  let playPreviousButtonHTML = `<button class="btn btn-primary overlay-button" id="play-previous-btn" onclick="playPrevious();" ${previousDisabled}>← Play prior</button>`;
  let playNextButtonHTML = `<button class="btn btn-primary overlay-button" id="play-next-btn" onclick="playNext();" ${nextDisabled}>Play next →</button>`;
  let playNextUnsolvedButtonHTML = `<button class="btn btn-primary overlay-button" onclick="playNextUnsolved();" ${nextDisabled}>Next unsolved ⇒</button>`;
  
  if (customOOO) {
    playPreviousButtonHTML = "";
    playNextButtonHTML = "";
  }
  const shareIconImgTag = '<img src="assets/images/share.svg">'
  
  let endgameOverlay = `
  <div class="overlay">
    <h2>${header}</h2>

    <div class="overlay-subheader">Share Icons</div>
    <div>${guessIconsByRound.join("</div><div>")}</div>
    <p><button class="btn btn-primary" id="copy-to-clipboard-button">Share Standard ${shareIconImgTag}</button> <button class="btn btn-primary" id="reddit-share-button">Share w/ Reddit Spoiler Tags ${shareIconImgTag}</button></p>
    
    <div class="overlay-subheader">Guess Distribution</div>
    <div class="dist">
      ${getProgressBarsHTML().join("<br>")}
    </div>

    <div class="overlay-subheader">Progress</div>
    <p>You have solved ${dist.total} out of ${maxPuzzleNumber + 1} total puzzles</p>
    
    <div class="overlay-subheader">Play more?</div>
    <p>${playPreviousButtonHTML} <button class="btn btn-secondary overlay-button play-again">Restart</button> ${playNextButtonHTML}<p>
    <p>${playPriorUnsolvedButtonHTML} ${playNextUnsolvedButtonHTML}</p>
  </div>
  `;
  $("#date-box").append(endgameOverlay);
  setOverlayBackgroundColor();
  disableMainInputs();
}

function getProgressBarsHTML() {
  // construct dist visual
  const progressBarsHTML = []
  let remainingTotal = dist.total;
  for (let i = 1; i <= 7; i++) {
    let count = i in dist ? dist[i] : 0;
    let label = i;
    if (i == 7) {
      count = remainingTotal;
      label = '7+';
    }
    let pct = Math.round(count / dist.total * 100);
    progressBarsHTML.push(`
    <div style="display: inline-block; width: 5%; text-align: left">${label}</div>
    <div class="progress" style="display: inline-block; width: 90%">
      <div class="progress-bar ${i == guesses.length ? "bg-warning" : "bg-secondary"}" role="progressbar" style="width: ${pct}%" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">${count}</div>
    </div>
    `);
    remainingTotal -= count;
  }
  if (remainingTotal != 0) {
    console.log(`debug: after creating dist visual, remaining total should be 0 but instead ${remainingTotal}`)
  }
  return progressBarsHTML;
}

function addGuessesToLocalStorage() {
  // decrement dist from old guesses IF already solved
  if (currentPuzzleNumber in solved) { 
    dist[solved[currentPuzzleNumber].guesses.length]--;
    dist.total--;
  }

  // update solved data
  solved[currentPuzzleNumber] = {solvedDate: today, guesses: guesses};
  setItemLocalStorage(solvedKeyLocalStorage, solved);
  
  // update dist
  if (guesses.length in dist) {
    dist[guesses.length]++;
  } else {
    dist[guesses.length] = 1;
  }
  dist.total++;
  setItemLocalStorage(distKeyLocalStorage, dist);
}

function disableMainInputs() {
  $(".main-input").prop("disabled", true);
}

function enableMainInputs() {
  $(".main-input").prop("disabled", false);
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

function animateButtonClick(element, newText) {
  const origBackgroundColor = element.css("background-color");
  const origHTML = element.html();
  element.css("background-color", "green");
  element.text(newText);
  setTimeout(function () {
    element.css("background-color", origBackgroundColor);
    element.html(origHTML);
  }, 2000);
  element.blur();
}

function animateCopy(element) {
  animateButtonClick(element, "Copied! ✔");
}

function animateViewAnswer() {
  let element = $("#view-answer-button");
  animateButtonClick(element, ooo.toUpperCase());
  element.blur();
}

function displayOldGuesses() {
  $("#overwrite-guesses-checkbox").prop("checked", false)  // don't allow overwriting
  oldGuesses = solved[currentPuzzleNumber].guesses;
  for (let i = 0; i < oldGuesses.length; i++) {
    guess = oldGuesses[i];
    for (let j = 0; j < numLetters; j++) {
        $(`#row${i}col${j}`).text(guess[j]);
    }
    processGuess(submitGuess=false);
  }
  $("#view-guesses-button").blur();
}

function clickAShareButton(buttonId, guessIconsArr, shareLink = null) {
  if (!shareLink) {
    shareLink = getShareLink();
  }
  let descText = `#${currentPuzzleNumber} ${date}`;
  if (customOOO) {
    descText = "custom"
  }

  let shareText = `Wordle: ${descText}\nGuesses: ${round}\n\n${guessIconsArr.join("\n")}\n\n${shareLink}`;
  shareOrCopyToClipboard(shareText, buttonId);
}

// when copy to clipboard button clicked
$(document).on("click", "#copy-to-clipboard-button", function() {
  clickAShareButton("copy-to-clipboard-button", guessIconsByRound)
})

// when reddit share button clicked
$(document).on("click", "#reddit-share-button", function() {
  const shareLink = "https://www." + getShareLink();
  const iconsAndGuesses = guessIconsByRound.map(function(e, i) {return `${e} >!${guesses[i].toUpperCase()}!< (${remainingValidWordsByRound[i]})`.replace("(0)", "");});
  clickAShareButton("reddit-share-button", iconsAndGuesses, shareLink)
})

function shareOrCopyToClipboard(shareText, elementId) {
  if (navigator.share) {
    navigator.share({
      text: shareText
    }).then(() => {
      console.log('Thanks for sharing!');
    })
    .catch(console.error);
  } else {
    navigator.clipboard.writeText(shareText);
    animateCopy($(`#${elementId}`));
  }
}

// when play again? button is clicked
$(document).on("click", ".play-again", function() {
  restartGame(ooo);
})

// when continue button is clicked
$(document).on("click", ".continue", function() {
  resume();
})

function dateChange() {
  const newDate = $("#date-selector-button").val();
  $("#bad-date-message").remove();  // if present
  $("#date-selector-button").blur();  // remove focus from date selector; prevent keyboard event interference
  if (isValidDate(newDate)) {
    date = newDate;
    restartGame();
  } else {
    $("#date-box").append(`<p id="bad-date-message" class="bad-message">Invalid date; still using ${date}<p>`);
  }
}

// when puzzle number selector clicked
$(document).on("click", "#puzzle-selector-button", function () {
  $(".dropdown-content").toggle();
  $(this).blur();
})

function puzzleNumberChange(puzzleNumber) {
  if (puzzleNumber > maxPuzzleNumber) {
    return
  }
  const newDate = puzzleNumToDate.get(puzzleNumber);
  $("#date-selector-button").val(newDate);
  $(".dropdown-content").hide();
  dateChange();
}

function playNext() {
  puzzleNumberChange(currentPuzzleNumber + 1);
}

function playPrevious() {
  puzzleNumberChange(currentPuzzleNumber - 1);
}

function playNextUnsolved() {
  newPuzzleNumber = currentPuzzleNumber + 1;
  while (newPuzzleNumber <= maxPuzzleNumber) {
    if (newPuzzleNumber in solved) {
      newPuzzleNumber++;
    } else {
      return puzzleNumberChange(newPuzzleNumber);
    }
  }
}

function playPreviousUnsolved() {
  newPuzzleNumber = currentPuzzleNumber - 1;
  while (newPuzzleNumber >= 0) {
    if (newPuzzleNumber in solved) {
      newPuzzleNumber--;
    } else {
      return puzzleNumberChange(newPuzzleNumber);
    }
  }
}

function playEarliestUnsolved() {
  $("#play-earliest-unsolved-button").blur();
  for (let i = 0; i <= maxPuzzleNumber; i++) {
    if (i in solved) {
      continue;
    } else {
      return puzzleNumberChange(i);
    }
  }
}

function resume() {
  $(".overlay").remove();
  enableMainInputs();
}

function clickSubmitCustomWord() {
  let newOoo = $("#custom-wordle").val().toLowerCase();
  if (wordleAcceptableWords.has(newOoo)) {
    customOOO = newOoo;
    currentPuzzleNumber = null;
    restartGame();
    $("#custom-wordle").val("");

    customShareLink = getShareLink();
    const shareLinkHTMLText = `Custom word set! <strong>Press "Close" button</strong> to play your own Wordle!<br><br>Share the following link with family and friends to see if they can guess your word.<br><br><a href="${"https://" + customShareLink}" target="_blank" rel="noopener noreferrer">${customShareLink}</a>`
    $("#custom-wordle-share-text").html(shareLinkHTMLText);
    $("#custom-wordle-copy-clipboard").show();

    // swap which button is primary/secondary
    $("#custom-wordle-submit-button").addClass("btn-secondary").removeClass("btn-primary");
    $("#custom-close-button").addClass("btn-primary").removeClass("btn-secondary");

    // clear and hide date/number selector
    $(".date-selector").hide()
    $(".dropdown").hide()
    $("#play-earliest-unsolved-button").hide();
    $("#wordle-by-date-button").show();

    $("#custom-wordle").blur();
    //$("#custom-close-button").focus();
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
  shareOrCopyToClipboard(customShareLink, "custom-wordle-copy-clipboard");
})

function toggleHistory() {
  if ($("#history").css("display") == 'none') {
    progressBarsHTML = getProgressBarsHTML();
    $("#guess-history-progress-bars").html(progressBarsHTML)
    $(".guess-history-text").text(JSON.stringify(solved, null, 4))
    setOverlayBackgroundColor();
  }
  $("#history").toggle();
  $("#about").hide();
  $("#custom").hide();
}

function downloadJson(obj, filename) {
  const a = document.createElement('a');
  const file = new Blob([JSON.stringify(obj, null, 4)], {type: "application/json"});
  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();
}

function downloadHistory() {
  const dateString = new Date().toLocaleString('sv').replace(' ', '_').replace(':', 'h').replace(':', 'm') + 's';
  const filename = `wordlereplay_history_${dateString}.json`
  const history = {
    "distribution": dist,
    "solvedPuzzles": solved
  }
  downloadJson(history, filename)
}

function downloadHistoryThenClear() {
  downloadHistory();
  window.localStorage.removeItem(solvedKeyLocalStorage);
  window.localStorage.removeItem(distKeyLocalStorage);
  location.reload();
}
