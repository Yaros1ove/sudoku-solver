//array of available numbers
const allNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
//array of number buttons
const numbers = document.querySelectorAll('.number')
//array of squares with cells for easy access
const board = []
const squares = document.querySelectorAll('.square')
//filling board array
for (let square of squares) {
  let cells = square.querySelectorAll('.cell')
  board.push(cells)
}
//solve button
const button = document.querySelector('.button')
button.addEventListener('click', solve)

//current shosen number
let curNumber = ''

let test1 = [
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
// fillBoard(test1)

//array of binded functions for numbers
const bindedChooseNumber = []
for (let i = 0; i < 10; i++) {
  bindedChooseNumber.push(chooseNumber.bind(null, i))
}
for (let i = 0; i < 10; i++) {
  numbers[i].addEventListener('click', bindedChooseNumber[i])
}
//setting curNumber
function chooseNumber(index) {
  for (let number of numbers) {
    number.classList.remove('active')
  }
  curNumber = numbers[index].textContent
  numbers[index].classList.add('active')
  curNumber = curNumber === 'X' ? '' : curNumber
  colorChosen()
}
function colorChosen() {
  for (let square of board) {
    for (let cell of square) {
      cell.classList.remove('chosen-number')
      if (cell.textContent === curNumber && cell.textContent !== '') {
        cell.classList.add('chosen-number')
      }
    }
  }
}

//array of binded functions for cells
const bindedInsertNumber = []
for (let square = 0; square < 9; square++) {
  let tmpArray = []
  for (let cell = 0; cell < 9; cell++) {
    tmpArray.push(insertNumber.bind(null, square, cell))
  }
  bindedInsertNumber.push(tmpArray)
}
for (let square = 0; square < 9; square++) {
  for (let cell = 0; cell < 9; cell++) {
    board[square][cell].addEventListener('click', bindedInsertNumber[square][cell])
  }
}
//inserting curNumber into cell
function insertNumber(square, cell) {
  if (board[square][cell].textContent === curNumber || curNumber === '') {
    prevNumber = board[square][cell].textContent
    board[square][cell].textContent = ''
    board[square][cell].classList.remove('validate-error')
  } else {
    board[square][cell].textContent = curNumber
  }
  validate()
  colorChosen()
}

//paint cells in red in case of more then one cell has the same number (in line, column and square)
function validate() {
  //
  let isNeededToEnableButton = true
  //clear all cells from red
  for (let square of board) {
    for (let cell of square) {
      cell.classList.remove('validate-error')
    }
  }
  //validation of square
  for (let square of board) {
    isNeededToEnableButton = !validateArray(square) ? false : isNeededToEnableButton
  }
  //validation of lines
  for (let squareLine = 0; squareLine < 9; squareLine += 3) {
    let line1 = []
    let line2 = []
    let line3 = []
    for (let square = squareLine; square < squareLine + 3; square++) {
      for (let cell = 0; cell < 9; cell++) {
        if (cell < 3) line1.push(board[square][cell])
        if (cell >= 3 && cell < 6) line2.push(board[square][cell])
        if (cell >= 6) line3.push(board[square][cell])
      }
    }
    isNeededToEnableButton = !validateArray(line1) ? false : isNeededToEnableButton
    isNeededToEnableButton = !validateArray(line2) ? false : isNeededToEnableButton
    isNeededToEnableButton = !validateArray(line3) ? false : isNeededToEnableButton
  }
  //validation of columns
  for (let squareColumn = 0; squareColumn < 3; squareColumn++) {
    let column1 = []
    let column2 = []
    let column3 = []
    for (let square = squareColumn; square < 9; square += 3) {
      for (let cell = 0; cell < 9; cell++) {
        if (cell % 3 === 0) column1.push(board[square][cell])
        if (cell % 3 === 1) column2.push(board[square][cell])
        if (cell % 3 === 2) column3.push(board[square][cell])
      }
    }
    isNeededToEnableButton = !validateArray(column1) ? false : isNeededToEnableButton
    isNeededToEnableButton = !validateArray(column2) ? false : isNeededToEnableButton
    isNeededToEnableButton = !validateArray(column3) ? false : isNeededToEnableButton
  }
  //activation of button
  if (isNeededToEnableButton) {
    button.disabled = ''
  }
}
function validateArray(array) {
  for (let number of allNumbers) {
    let counter = 0
    for (let cell of array) {
      if (cell.textContent === number) counter++
    }
    if (counter > 1) {
      button.disabled = 'disabled'
      for (let cell of array) {
        if (cell.textContent === number) {
          cell.classList.add('validate-error')
        }
      }
      return false
    }
  }
  return true
}

//solving the sudoku
function solve() {
  let sudokuArray = createSudokuArray()
  let solved = solveSudoku(sudokuArray)
  if (solved) {
    fillBoard(solved)
  } else {
    alert("Can't solve that sudoku")
  }
}

//creating the sudoky array
function createSudokuArray() {
  let sudokuArray = []
  for (let squareLine = 0; squareLine < 9; squareLine += 3) {
    let line1 = []
    let line2 = []
    let line3 = []
    for (let square = squareLine; square < squareLine + 3; square++) {
      for (let cell = 0; cell < 9; cell++) {
        let value = board[square][cell].textContent
        value = value === '' ? '.' : value
        if (cell < 3) line1.push(value)
        if (cell >= 3 && cell < 6) line2.push(value)
        if (cell >= 6) line3.push(value)
      }
    }
    sudokuArray.push(line1)
    sudokuArray.push(line2)
    sudokuArray.push(line3)
  }
  return sudokuArray
}

//filling the board with values from array
function fillBoard(array) {
  let rearrangedArray = []
  for (let squareLine = 0; squareLine < 9; squareLine += 3) {
    let square1 = []
    let square2 = []
    let square3 = []
    for (let arrayLine = squareLine; arrayLine < squareLine + 3; arrayLine++) {
      for (let cell = 0; cell < 9; cell++) {
        let value = array[arrayLine][cell]
        value = value === '.' ? '' : value
        if (Math.floor(cell / 3) === 0) square1.push(value)
        if (Math.floor(cell / 3) === 1) square2.push(value)
        if (Math.floor(cell / 3) === 2) square3.push(value)
      }
    }
    rearrangedArray.push(square1)
    rearrangedArray.push(square2)
    rearrangedArray.push(square3)
  }
  for (let square = 0; square < 9; square++) {
    for (let cell = 0; cell < 9; cell++) {
      board[square][cell].textContent = rearrangedArray[square][cell]
    }
  }
  colorChosen()
}