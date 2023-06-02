function getBoardCells() {
  const board = []
  const rows = document.querySelectorAll('.row')

  for (const row of rows) {
    board.push(Array.from(row.children))
  }

  return board
}

function addListenerToBoardDOM() {
  const boardDOM = document.querySelector('.board')
  boardDOM.addEventListener('click', insertOrDeleteCurrentNumberInCell)
}

function getNumberButtons() {
  return document.querySelector('.numberButtons')
}

function getNumberButtonsWithListener() {
  const numberButtons = getNumberButtons()
  numberButtons.addEventListener('click', changeCurrentNumber)
}

function getSolveButtonWithListener() {
  const solveButton = document.querySelector('.solveButton')
  solveButton.addEventListener('click', solve)
  return solveButton
}


function getCurrentNumber() {
  return currentNumber
}

function setCurrentNumber(newValue) {
  currentNumber = newValue
}

function changeCurrentNumber(event) {
  const numberButton = event.target
  if (!isNumberButton(numberButton)) return

  setActiveClassToNumberButton(numberButton)

  const newValue = numberButton.dataset.value
  setCurrentNumber(newValue)

  colorCellsWithCurrentNumber()
}


function setActiveClassToNumberButton(newNumberButton) {
  const oldNumberButton = document.querySelector('.active')
  if (oldNumberButton === newNumberButton) return

  oldNumberButton.classList.remove('active')
  newNumberButton.classList.add('active')
}

function colorCellsWithCurrentNumber() {
  removeAllNotValidColors()
  removeAllChosenNumberColors()

  const currentNumber = getCurrentNumber()

  for (const row of boardCells) {
    for (const cell of row) {

      if (cell.innerHTML === currentNumber && currentNumber !== '') {

        colorCellWithCurrentNumber(cell)
        colorNotValidCellsForCell(cell)
      }

    }
  }
}

function colorNotValidCellsForCell(cell) {
  colorNotValidCellsInLineForCell(cell)

  colorNotValidCellsInColumnForCell(cell)

  colorNotValidCellsInSquareForCell(cell)
}

function colorAllNotValidCellsForCurrentNumber() {
  removeAllNotValidColors()
  const chosenNumberCells = document.querySelectorAll('.chosen-number')

  for (const cell of chosenNumberCells) {
    colorNotValidCellsForCell(cell)
  }
}

function colorNotValidCellsInLineForCell(cell) {

  const lineIndex = cell.dataset.row
  const line = getLineFromIndex(lineIndex)

  colorNotValidCells(line)
}

function colorNotValidCellsInColumnForCell(cell) {
  
  const columnIndex = cell.dataset.column
  const column = getColumnFromIndex(columnIndex)

  colorNotValidCells(column)
}

function colorNotValidCellsInSquareForCell(cell) {
  
  const squareIndex = cell.dataset.square
  const square = getSquareFromIndex(squareIndex)

  colorNotValidCells(square)
}

function colorNotValidCells(cells) {
  for (const cell of cells) {
    colorOneNotValidCell(cell)
  }
}

function colorOneNotValidCell(cell) {
  cell.classList.add('not-valid')
}

function removeAllNotValidColors() {
  const notValidCells = document.querySelectorAll('.not-valid')

  for (const cell of notValidCells) {
    removeNotValidColorFromCell(cell)
  }
}

function removeAllChosenNumberColors() {
  const chosenNumberCells = document.querySelectorAll('.chosen-number')

  for (const cell of chosenNumberCells) {
    removeChosenColorFromCell(cell)
  }
}

function colorCellWithCurrentNumber(cell) {
  const currentNumber = getCurrentNumber()

  if (currentNumber) cell.classList.add('chosen-number')
}

function removeNotValidColorFromCell(cell) {
  cell.classList.remove('not-valid')
}

function removeChosenColorFromCell(cell) {
  cell.classList.remove('chosen-number')
}

function colorErrorCells(cells) {
  for (const cell of cells) {
    colorOneErrorCell(cell)
  }
}

function colorOneErrorCell(cell) {
  cell.classList.add('validate-error')
  isBoardValid = false
}

function removeColorFromErrorCell(cell) {
  cell.classList.remove('validate-error')
}

function clearAllErrors() {
  for (const line of boardCells) {
    for (const cell of line) {

      removeColorFromErrorCell(cell)

    }
  }

  isBoardValid = true
}


function disableSolveButton() {
  solveButton.disabled = 'disabled'
}

function enableSolveButton() {
  solveButton.disabled = ''
}


function validateBoard() {
  clearAllErrors()

  validateLines()
  validateColumns()
  validateSquares()

  if (isBoardValid && !isBoardEmpty()) {
    enableSolveButton()
  } else {
    disableSolveButton()
  }

}

function validateLines() {
  for (let index = 0; index <= 8; index++) {

    const line = getLineFromIndex(index)

    validateCells(line)

  }
}

function validateColumns() {
  for (let index = 0; index <= 8; index++) {

    const column = getColumnFromIndex(index)

    validateCells(column)

  }
}

function validateSquares() {
  for (let index = 0; index <= 8; index++) {

    const square = getSquareFromIndex(index)

    validateCells(square)

  }
}

function validateCells(cells) {
  if (isCellsEmpty(cells)) return

  for (let i = 1; i <= 9; i++) {
    const entries = cells.filter(cell => cell.innerHTML === i.toString())

    if (entries.length > 1) {
      colorErrorCells(entries)
    }
  }

}


function insertOrDeleteCurrentNumberInCell(event) {
  const cell = event.target
  if (!isCell(cell)) return
  const currentNumber = getCurrentNumber()

  if (cell.innerHTML === currentNumber) {
    cell.innerHTML = ''
    removeChosenColorFromCell(cell)
  } else {
    cell.innerHTML = currentNumber
    colorCellWithCurrentNumber(cell)
  }

  validateBoard()
  colorAllNotValidCellsForCurrentNumber()
}

function createInsertedValuesWithIndexesMapFromCells(cells) {
  const insertedValuesWithIndexes = new Map()

  cells.forEach((cell, index) => {
    const value = cell.innerHTML
    if (value) {

      if (!insertedValuesWithIndexes.has(value)) {
        insertedValuesWithIndexes.set(value, [])
      }

      const indexes = insertedValuesWithIndexes.get(value)
      indexes.push(index)
      insertedValuesWithIndexes.set(value, indexes)

    }
  })

  return insertedValuesWithIndexes
}

function getValidateErrorIndexesFromMap(map) {
  const errorIndexes = []

  for (const indexes of map.values()) {
    if (indexes.length > 1) {
      for (const index of indexes) {
        errorIndexes.push(index)
      }

    }
  }

  return errorIndexes
}

function getErrorCellsFromIndexesAndCells(indexes, cells) {
  const errorCells = []

  for (const index of indexes) {
    errorCells.push(cells[index])
  }

  return errorCells
}


function initializeEmptyBoard() {
  const array = []

  for (let index = 0; index < 9; index++) {
    array.push([])
  }

  return array
}

function getLineFromIndex(index) {
  return Array.from(document.querySelectorAll(`[data-row="${index}"]`))
}

function getColumnFromIndex(index) {
  return Array.from(document.querySelectorAll(`[data-column="${index}"]`))
}

function getSquareFromIndex(index) {
  return Array.from(document.querySelectorAll(`[data-square="${index}"]`))
}

function fillBoardWithNumbersFromArray(array) {
  array.forEach((line, lineIndex) => {
    line.forEach((value, columnIndex) => {

      if (value !== '.') {
        boardCells[lineIndex][columnIndex].innerHTML = value
      }

    })
  })

  colorCellsWithCurrentNumber()
}

function getBoardReadyForSolvingFromCells(cells) {
  const boardReadyForSolving = []

  for (const line of cells) {
    boardReadyForSolving.push(line.map(cell => cell.innerHTML || '.'))
  }

  return boardReadyForSolving
}


function isNumberButton(element) {
  return element.classList.contains('numberButton')
}

function isCell(element) {
  return element.classList.contains('cell')
}

function isBoardEmpty() {
  for (const line of boardCells) {
    if (!isCellsEmpty(line)) return false
  }

  return true
}

function isCellsEmpty(cells) {
  if (cells.find(cell => cell.innerHTML)) return false

  return true
}


let currentNumber = ''


const numberButtons = getNumberButtonsWithListener()
addListenerToBoardDOM()
const boardCells = getBoardCells()
const solveButton = getSolveButtonWithListener()

const testBoard1 = [
  ["5", "3", ".", ".", "7", ".", ".", ".", "."],
  ["6", ".", ".", "1", "9", "5", ".", ".", "."],
  [".", "9", "8", ".", ".", ".", ".", "6", "."],
  ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
  ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
  ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
  [".", "6", ".", ".", ".", ".", "2", "8", "."],
  [".", ".", ".", "4", "1", "9", ".", ".", "5"],
  [".", ".", ".", ".", "8", ".", ".", "7", "9"]
]
const testBoard2 = [
  ["2", "4", ".", ".", ".", "5", "7", ".", "."],
  [".", "9", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", "7", ".", ".", ".", "1", ".", "."],
  [".", ".", ".", "7", "8", ".", "9", ".", "5"],
  [".", ".", ".", "6", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", "3", "4", ".", "1", "."],
  [".", ".", ".", "4", ".", ".", ".", "7", "."],
  [".", ".", ".", "8", ".", "1", ".", "9", "."],
  ["9", "2", ".", ".", ".", ".", ".", ".", "6"],
]


fillBoardWithNumbersFromArray(testBoard2)


let isBoardValid = !isBoardEmpty()

if (!isBoardValid) {
  disableSolveButton()
}


function solve() {

  const boardReadyForSolving = getBoardReadyForSolvingFromCells(boardCells)
  const solved = solveSudoku(boardReadyForSolving)

  if (solved) {

    fillBoardWithNumbersFromArray(solved)

  } else {

    alert("Can't solve that sudoku")

  }
}