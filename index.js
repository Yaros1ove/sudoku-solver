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


function isNumberButton(element) {
  return element.classList.contains('numberButton')
}

function isCell(element) {
  return element.classList.contains('cell')
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

function setCurrentNumber(newValue) {
  currentNumber = newValue
}

function getCurrentNumber() {
  return currentNumber
}


function colorCellsWithCurrentNumber() {
  const currentNumber = getCurrentNumber()

  for (const row of boardCells) {
    for (const cell of row) {

      if (cell.innerHTML === currentNumber) {
        colorCellWithCurrentNumber(cell)
      } else {
        removeChosenColorFromCell(cell)
      }

    }
  }
}

function colorCellWithCurrentNumber(cell) {
  const currentNumber = getCurrentNumber()

  if (currentNumber) cell.classList.add('chosen-number')
}

function removeChosenColorFromCell(cell) {
  cell.classList.remove('chosen-number')
}

function colorCellWithError(cell) {
  cell.classList.add('validate-error')
  isBoardValid = false
}

function removeErrorColorFromCell(cell) {
  cell.classList.remove('validate-error')
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

function clearAllErrors() {
  for (const line of boardCells) {
    for (const cell of line) {

      removeErrorColorFromCell(cell)

    }
  }

  isBoardValid = true
}

function validateLines() {
  for (const line of boardCells) {
    validateCells(line)
  }
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

function colorCellWithErrorFromCells(cells) {
  for (const cell of cells) {
    colorCellWithError(cell)
  }
}

function getErrorCellsFromIndexesAndCells(indexes, cells) {
  const errorCells = []

  for (const index of indexes) {
    errorCells.push(cells[index])
  }

  return errorCells
}

function validateCells(cells) {
  if (!cells.find(cell => cell.innerHTML)) return

  const insertedValuesWithIndexes = createInsertedValuesWithIndexesMapFromCells(cells)
  const errorIndexes = getValidateErrorIndexesFromMap(insertedValuesWithIndexes)
  const errorCells = getErrorCellsFromIndexesAndCells(errorIndexes, cells)

  colorCellWithErrorFromCells(errorCells)
}

function validateColumns() {
  const columns = createColumnsFromLines(boardCells)

  for (const column of columns) {
    validateCells(column)
  }

}

function initializeArrayWithNineEmptyArrays() {
  const array = []

  for (let index = 0; index < 9; index++) {
    array.push([])
  }

  return array
}

function createColumnsFromLines(lines) {
  const columns = initializeArrayWithNineEmptyArrays()

  for (const line of lines) {
    line.forEach((cell, index) => {

      columns[index].push(cell)

    })
  }

  return columns
}

function validateSquares() {
  const squares = createSquaresFromLines(boardCells)

  for (const square of squares) {
    validateCells(square)
  }
}

function getSquareIndexFromLineAndColumnIndexes(lineIndex, columnIndex) {
  return 3 * Math.floor(lineIndex / 3) + Math.floor(columnIndex / 3)
}

function createSquaresFromLines(lines) {
  const squares = initializeArrayWithNineEmptyArrays()

  lines.forEach((line, lineIndex) => {
    line.forEach((cell, columnIndex) => {

      squares[getSquareIndexFromLineAndColumnIndexes(lineIndex, columnIndex)].push(cell)

    })
  })

  return squares
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

function isBoardEmpty() {
  for (const line of boardCells) {
    if (!isLineEmpty(line)) return false
  }

  return true
}
function isLineEmpty(line) {
  if (line.find(cell => cell.innerHTML)) return false

  return true
}


let currentNumber = ''


const numberButtons = getNumberButtonsWithListener()
addListenerToBoardDOM()
const boardCells = getBoardCells()
const solveButton = getSolveButtonWithListener()

const test1 = [
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
fillBoardWithNumbersFromArray(test1)


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