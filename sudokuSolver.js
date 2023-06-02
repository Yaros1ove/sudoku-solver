function solveSudoku(board) {

  let allExpectedValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
  let expectedMap = new Map()

  function initializeMap() {
    for (let line = 0; line < 9; line++) {
      for (let column = 0; column < 9; column++) {

        if (board[line][column] === '.') {
          const key = getKey(line, column)
          expectedMap.set(key, [...allExpectedValues])
        }

      }
    }
  }

  function checkForLonelyExpectedValueAndSet(line, column) {
    const expectedArray = getExpectedArray(line, column)
    if (expectedArray.length === 1) {
      const value = expectedArray[0]
      setValue(line, column, value)
    }
  }

  function getKey(line, column) {
    return line.toString() + column.toString()
  }

  function getExpectedArray(line, column) {
    const key = getKey(line, column)
    return expectedMap.get(key)
  }

  function removeExpectedValueInCell(line, column, value) {
    if (!isInExpected(line, column, value)) return
    let expectedArray = getExpectedArray(line, column)
    let index = expectedArray.indexOf(value)
    expectedArray.splice(index, 1)
    checkForLonelyExpectedValueAndSet(line, column)
  }
  
  function setValue(line, column, value) {
    board[line][column] = value
    let key = getKey(line, column)
    expectedMap.delete(key)
    removeExpectedInLine(line, [value])
    removeExpectedInColumn(column, [value])
    removeExpectedInSquare(line, column, [value])
  }
  function removeAlreadyExistsFromExpected() {
    for (let line = 0; line < 9; line++) {
      for (let column = 0; column < 9; column++) {
        if (board[line][column] !== '.') {
          let value = board[line][column]
          removeExpectedInLine(line, [value])
          removeExpectedInColumn(column, [value])
          removeExpectedInSquare(line, column, [value])
        }
      }
    }
  }
  function removeExpectedInLine(line, values, indexesNotToTouch = []) {
    for (let column = 0; column < 9; column++) {
      if (board[line][column] === '.' && !indexesNotToTouch.includes(column)) {
        for (let value of values) {
          removeExpectedValueInCell(line, column, value)
        }
      }
    }
  }
  function removeExpectedInColumn(column, values, indexesNotToTouch = []) {
    for (let line = 0; line < 9; line++) {
      if (board[line][column] === '.' && !indexesNotToTouch.includes(line)) {
        for (let value of values) {
          removeExpectedValueInCell(line, column, value)
        }
      }

    }
  }
  function removeExpectedInSquare(cellLine, cellColumn, values, keysNotToTouch = []) {
    let startLine = cellLine - cellLine % 3
    let startColumn = cellColumn - cellColumn % 3
    for (let line = startLine; line < startLine + 3; line++) {
      for (let column = startColumn; column < startColumn + 3; column++) {
        let key = getKey(line, column)
        if (board[line][column] === '.' && !keysNotToTouch.includes(key)) {
          for (let value of values) {
            removeExpectedValueInCell(line, column, value)
          }
        }
      }
    }
  }
  function isInExpected(line, column, value) {
    if (board[line][column] !== '.') return false
    let expectedArray = getExpectedArray(line, column)
    return expectedArray.includes(value)
  }
  function checkForLonelyCellWithExpectedValue() {
    for (let line = 0; line < 9; line++) {
      for (let column = 0; column < 9; column++) {
        if (board[line][column] === '.') {
          checkForLonelyCellLinear(line, column)    //in line and column
          checkForLonelyCellSquare(line, column)    //in square
        }
      }
    }
  }
  function checkForLonelyCellLinear(line, column) {
    let expectedArray = getExpectedArray(line, column)
    let linearCounter = 0
    let columnCounter = 0
    for (let expectedValue of expectedArray) {
      for (let helpIndex = 0; helpIndex < 9; helpIndex++) {
        //in line
        if (board[line][helpIndex] === '.') {
          if (isInExpected(line, helpIndex, expectedValue)) {
            linearCounter++
          }
        }
        //in column
        if (board[helpIndex][column] === '.') {
          if (isInExpected(helpIndex, column, expectedValue)) {
            columnCounter++
          }
        }
      }
      if (linearCounter === 1 || columnCounter === 1) {
        setValue(line, column, expectedValue)
        return
      }
    }
  }
  function checkForLonelyCellSquare(cellLine, cellColumn) {
    if (board[cellLine][cellColumn] !== '.') return
    let startLine = cellLine - cellLine % 3
    let startColumn = cellColumn - cellColumn % 3
    let expectedArray = getExpectedArray(cellLine, cellColumn)
    for (let expectedValue of expectedArray) {
      let squareCounter = 0
      for (let line = startLine; line < startLine + 3; line++) {
        for (let column = startColumn; column < startColumn + 3; column++) {
          if (board[line][column] === '.') {
            if (isInExpected(line, column, expectedValue)) {
              squareCounter++
            }
          }
        }
      }
      if (squareCounter === 1) {
        setValue(cellLine, cellColumn, expectedValue)
        return
      }
    }
  }
  function checkAllSquaresForExpectedLinesAndColumns() {
    for (let line = 0; line < 9; line += 3) {
      for (let column = 0; column < 9; column += 3) {
        checkSquareForExpectedLinesAndColumns(line, column)
      }
    }
  }
  function checkSquareForExpectedLinesAndColumns(startLine, startColumn) {
    for (let line = startLine; line < startLine + 3; line++) {
      for (let column = startColumn; column < startColumn + 3; column++) {
        if (board[line][column] === '.') {
          let expectedArray = getExpectedArray(line, column)
          for (let expectedValue of expectedArray) {
            //check for line
            if (checkSquareForExpectedLines(startLine, startColumn, expectedValue)) {
              let indexesNotToTouch = [startColumn, startColumn + 1, startColumn + 2]
              removeExpectedInLine(line, [expectedValue], indexesNotToTouch)
            }
            //check for columns
            if (checkSquareForExpectedColumns(startLine, startColumn, expectedValue)) {
              let indexesNotToTouch = [startLine, startLine + 1, startLine + 2]
              removeExpectedInColumn(column, [expectedValue], indexesNotToTouch)
            }
          }
        }
      }
    }
  }
  function checkSquareForExpectedLines(startLine, startColumn, value) {
    let presenceCounter = 0
    for (let line = startLine; line < startLine + 3; line++) {
      for (let column = startColumn; column < startColumn + 3; column++) {
        if (board[line][column] === '.') {
          let expectedArray = getExpectedArray(line, column)
          if (expectedArray.includes(value)) {
            presenceCounter++
            break
          }
        }
      }
    }
    if (presenceCounter === 1) return true
    return false
  }
  function checkSquareForExpectedColumns(startLine, startColumn, value) {
    let presenceCounter = 0
    for (let column = startColumn; column < startColumn + 3; column++) {
      for (let line = startLine; line < startLine + 3; line++) {
        if (board[line][column] === '.') {
          let expectedArray = getExpectedArray(line, column)
          if (expectedArray.includes(value)) {
            presenceCounter++
            break
          }
        }
      }
    }
    if (presenceCounter === 1) return true
    return false
  }
  function checkForPairedCells() {
    for (let line = 0; line < 9; line++) {
      for (let column = 0; column < 9; column++) {
        if (board[line][column] === '.') {
          let expectedArray = getExpectedArray(line, column)
          if (expectedArray.length === 2) {
            //check for pair in line
            let pairColumnIndex = checkForPairInLine(line, column, expectedArray)
            if (pairColumnIndex !== -1) {
              let indexesNotToTouch = [column, pairColumnIndex]
              removeExpectedInLine(line, expectedArray, indexesNotToTouch)
            }
            //check for pair in column
            let pairLineIndex = checkForPairInColumn(line, column, expectedArray)
            if (pairLineIndex !== -1) {
              let indexesNotToTouch = [line, pairLineIndex]
              removeExpectedInColumn(column, expectedArray, indexesNotToTouch)
            }
            //check for pair in square
            let pairKey = checkForPairInSquare(line, column, expectedArray)
            if (pairKey !== -1) {
              let key = getKey(line, column)
              let indexesNotToTouch = [key, pairKey]
              removeExpectedInSquare(line, column, expectedArray, indexesNotToTouch)
            }
          }
        }
      }
    }
  }
  function checkForPairInLine(line, columnIndex, expectedArray) {
    for (let column = 0; column < 9; column++) {
      if (column !== columnIndex && board[line][column] === '.') {
        let curExpectedArray = getExpectedArray(line, column)
        if (curExpectedArray.toString() === expectedArray.toString()) return column
      }
    }
    return -1
  }
  function checkForPairInColumn(lineIndex, column, expectedArray) {
    for (let line = 0; line < 9; line++) {
      if (line !== lineIndex && board[line][column] === '.') {
        let curExpectedArray = getExpectedArray(line, column)
        if (curExpectedArray.toString() === expectedArray.toString()) return line
      }
    }
    return -1
  }
  function checkForPairInSquare(cellLine, cellColumn, expectedArray) {
    let startLine = cellLine - cellLine % 3
    let startColumn = cellColumn - cellColumn % 3
    for (let line = startLine; line < startLine + 3; line++) {
      for (let column = startColumn; column < startColumn + 3; column++) {
        if (!(line === cellLine && column === cellColumn) && board[line][column] === '.') {
          let curExpectedArray = getExpectedArray(line, column)
          if (curExpectedArray.toString() === expectedArray.toString()) return getKey(line, column)
        }
      }
    }
    return -1
  }
  function checkForNakedPairs() {
    for (let index = 0; index < 9; index++) {
      checkForNakedPairInLine(index)
      checkForNakedPairInColumn(index)
    }

    for (let line = 0; line < 9; line += 3) {
      for (let column = 0; column < 9; column += 3) {
        checkForNakedPairInSquare(line, column)
      }
    }
  }
  function checkForNakedPairInLine(line) {
    let map = new Map()
    for (let expectedValue of allExpectedValues) {
      let indexes = []
      for (let column = 0; column < 9; column++) {
        if (isInExpected(line, column, expectedValue)) {
          indexes.push(column)
        }
      }
      if (indexes.length === 2) {
        map.set(expectedValue, indexes)
      }
    }
    if (map.size === 2) {
      let indexes = []
      let values = []
      map.forEach((mapIndexes, mapValue) => {
        indexes.push(mapIndexes)
        values.push(mapValue)
      })
      if (indexes[0].toString() === indexes[1].toString()) {
        for (let value of allExpectedValues) {
          if (!values.includes(value)) {
            let index1 = indexes[0][0]
            let index2 = indexes[0][1]
            removeExpectedValueInCell(line, index1, value)
            removeExpectedValueInCell(line, index2, value)
          }
        }
      }
    }
  }
  function checkForNakedPairInColumn(column) {
    let map = new Map()
    for (let expectedValue of allExpectedValues) {
      let indexes = []
      for (let line = 0; line < 9; line++) {
        if (isInExpected(line, column, expectedValue)) {
          indexes.push(line)
        }
      }
      if (indexes.length === 2) {
        map.set(expectedValue, indexes)
      }
    }
    if (map.size === 2) {
      let indexes = []
      let values = []
      map.forEach((mapIndexes, mapValue) => {
        indexes.push(mapIndexes)
        values.push(mapValue)
      })
      if (indexes[0].toString() === indexes[1].toString()) {
        for (let value of allExpectedValues) {
          if (!values.includes(value)) {
            let index1 = indexes[0][0]
            let index2 = indexes[0][1]
            removeExpectedValueInCell(index1, column, value)
            removeExpectedValueInCell(index2, column, value)
          }
        }
      }
    }
  }
  function checkForNakedPairInSquare(startLine, startColumn) {
    let map = new Map()
    for (let expectedValue of allExpectedValues) {
      let indexes = []
      for (let line = startLine; line < startLine + 3; line++) {
        for (let column = startColumn; column < startColumn + 3; column++) {
          if (isInExpected(line, column, expectedValue)) {
            indexes.push([line, column])
          }
        }
      }
      if (indexes.length === 2) {
        map.set(expectedValue, indexes)
      }
    }
    if (map.size === 2) {
      let indexes = []
      let values = []
      map.forEach((mapIndexes, mapValue) => {
        indexes.push(mapIndexes)
        values.push(mapValue)
      })
      if (indexes[0].toString() === indexes[1].toString()) {
        indexes = indexes[0]
        for (let value of allExpectedValues) {
          if (!values.includes(value)) {
            let line1 = indexes[0][0]
            let column1 = indexes[0][1]
            let line2 = indexes[1][0]
            let column2 = indexes[1][1]
            removeExpectedValueInCell(line1, column1, value)
            removeExpectedValueInCell(line2, column2, value)
          }
        }
      }
    }
  }

  function checkThreeExpectedArraysForTriplet(expectedArray1, expectedArray2, expectedArray3) {
    let expectedSet = new Set()
    for (let expectedValue of expectedArray1) {
      expectedSet.add(expectedValue)
    }
    for (let expectedValue of expectedArray2) {
      expectedSet.add(expectedValue)
    }
    for (let expectedValue of expectedArray3) {
      expectedSet.add(expectedValue)
    }

    if (expectedSet.size === 3) {
      let values = []
      for (let setValue of expectedSet.values()) {
        values.push(setValue)
      }
      return values
    }
    return false
  }
  function checkForNakedTriplets() {

    for (let index = 0; index < 9; index++) {
      let lineCheckResult = checkForNakedTripletInLine(index)
      if (lineCheckResult) {
        let values = lineCheckResult[0]
        let indexesNotToTouch = lineCheckResult[1]
        removeExpectedInLine(index, values, indexesNotToTouch)
      }
      let columnCheckResult = checkForNakedTripletInColumn(index)
      if (columnCheckResult) {
        let values = columnCheckResult[0]
        let indexesNotToTouch = columnCheckResult[1]
        removeExpectedInColumn(index, values, indexesNotToTouch)
      }
    }

    for (let line = 0; line < 9; line += 3) {
      for (let column = 0; column < 9; column += 3) {
        let squareCheckResult = checkForNakedTripletInSquare(line, column)
        if (squareCheckResult) {
          let values = squareCheckResult[0]
          let keysNotToTouch = squareCheckResult[1]
          removeExpectedInSquare(line, column, values, keysNotToTouch)
        }
      }
    }
  }
  function checkForNakedTripletInLine(line) {
    F1: for (let column1 = 0; column1 < 7; column1++) {
      F2: for (let column2 = column1 + 1; column2 < 8; column2++) {
        F3: for (let column3 = column2 + 1; column3 < 9; column3++) {
          if (board[line][column1] !== '.') continue F1
          if (board[line][column2] !== '.') continue F2
          if (board[line][column3] !== '.') continue F3

          let expectedArray1 = getExpectedArray(line, column1)
          let expectedArray2 = getExpectedArray(line, column2)
          let expectedArray3 = getExpectedArray(line, column3)

          let checkResult = checkThreeExpectedArraysForTriplet(expectedArray1, expectedArray2, expectedArray3)
          if (checkResult) {
            let indexesNotToTouch = [column1, column2, column3]
            return [checkResult, indexesNotToTouch]
          }
        }
      }
    }
    return false
  }
  function checkForNakedTripletInColumn(column) {
    F1: for (let line1 = 0; line1 < 7; line1++) {
      F2: for (let line2 = line1 + 1; line2 < 8; line2++) {
        F3: for (let line3 = line2 + 1; line3 < 9; line3++) {
          if (board[line1][column] !== '.') continue F1
          if (board[line2][column] !== '.') continue F2
          if (board[line3][column] !== '.') continue F3

          let expectedArray1 = getExpectedArray(line1, column)
          let expectedArray2 = getExpectedArray(line2, column)
          let expectedArray3 = getExpectedArray(line3, column)

          let checkResult = checkThreeExpectedArraysForTriplet(expectedArray1, expectedArray2, expectedArray3)
          if (checkResult) {
            let indexesNotToTouch = [line1, line2, line3]
            return [checkResult, indexesNotToTouch]
          }
        }
      }
    }
    return false
  }
  function checkForNakedTripletInSquare(startLine, startColumn) {
    F1: for (let index1 = 0; index1 < 7; index1++) {
      F2: for (let index2 = index1 + 1; index2 < 8; index2++) {
        F3: for (let index3 = index2 + 1; index3 < 9; index3++) {
          if (board[startLine + Math.floor(index1 / 3)][startColumn + index1 % 3] !== '.') continue F1
          if (board[startLine + Math.floor(index2 / 3)][startColumn + index2 % 3] !== '.') continue F2
          if (board[startLine + Math.floor(index3 / 3)][startColumn + index3 % 3] !== '.') continue F3

          let expectedArray1 = getExpectedArray(startLine + Math.floor(index1 / 3), startColumn + index1 % 3)
          let expectedArray2 = getExpectedArray(startLine + Math.floor(index2 / 3), startColumn + index2 % 3)
          let expectedArray3 = getExpectedArray(startLine + Math.floor(index3 / 3), startColumn + index3 % 3)

          let checkResult = checkThreeExpectedArraysForTriplet(expectedArray1, expectedArray2, expectedArray3)
          if (checkResult) {
            let keysNotToTouch = []
            keysNotToTouch.push(getKey(startLine + Math.floor(index1 / 3), startColumn + index1 % 3))
            keysNotToTouch.push(getKey(startLine + Math.floor(index2 / 3), startColumn + index2 % 3))
            keysNotToTouch.push(getKey(startLine + Math.floor(index3 / 3), startColumn + index3 % 3))
            return [checkResult, keysNotToTouch]
          }
        }
      }
    }
    return false
  }
  function checkForSwordFish() {
    checkLinesForSwordFish()
    checkColumnsForSwordFish()
  }
  function checkMapForSwordFish(map) {
    let elementIndexes = []
    let lineIndexes = []
    map.forEach((mapElementIndexes, mapLineIndexes) => {
      elementIndexes.push(mapElementIndexes)
      lineIndexes.push(mapLineIndexes)
    })
    for (let index1 = 0; index1 < elementIndexes.length - 2; index1++) {
      for (let index2 = index1 + 1; index2 < elementIndexes.length - 1; index2++) {
        for (let index3 = index2 + 1; index3 < elementIndexes.length; index3++) {
          let set = new Set()
          elementIndexes[index1].forEach(index => set.add(index))
          elementIndexes[index2].forEach(index => set.add(index))
          elementIndexes[index3].forEach(index => set.add(index))
          if (set.size === 3) {
            let elements = []
            set.forEach(index => elements.push(index))
            let goodLineIndexes = [lineIndexes[index1], lineIndexes[index2], lineIndexes[index3]]
            return [goodLineIndexes, elements]
          }
        }
      }
    }
    return false
  }
  function checkLinesForSwordFish() {
    for (let expectedValue of allExpectedValues) {
      let map = new Map()
      for (let line = 0; line < 9; line++) {
        let indexes = []
        for (let column = 0; column < 9; column++) {
          if (isInExpected(line, column, expectedValue)) {
            indexes.push(column)
          }
        }
        if (indexes.length <= 3 && indexes.length > 0) {
          map.set(line, indexes)
        }
      }
      if (map.size < 3) continue
      let checkResult = checkMapForSwordFish(map)
      if (checkResult) {
        let lines = checkResult[0]
        let columns = checkResult[1]
        for (let line = 0; line < 9; line++) {
          for (let column of columns) {
            if (!lines.includes(line)) {
              removeExpectedValueInCell(line, column, expectedValue)
            }
          }
        }
      }
    }
  }
  function checkColumnsForSwordFish() {
    for (let expectedValue of allExpectedValues) {
      let map = new Map()
      for (let column = 0; column < 9; column++) {
        let indexes = []
        for (let line = 0; line < 9; line++) {
          if (isInExpected(line, column, expectedValue)) {
            indexes.push(line)
          }
        }
        if (indexes.length <= 3 && indexes.length > 0) {
          map.set(column, indexes)
        }
      }
      if (map.size < 3) continue
      let checkResult = checkMapForSwordFish(map)
      if (checkResult) {
        let columns = checkResult[0]
        let lines = checkResult[1]
        for (let column = 0; column < 9; column++) {
          for (let line of lines) {
            if (!columns.includes(column)) {
              removeExpectedValueInCell(line, column, expectedValue)
            }
          }
        }
      }
    }
  }
  function checkForXYZWing() {
    for (let line = 0; line < 9; line++) {
      for (let column = 0; column < 9; column++) {
        if (board[line][column] === '.') {
          let expectedArray = getExpectedArray(line, column)
          if (expectedArray.length === 3) {
            checkForXYZWingInCellInLine(line, column)
            checkForXYZWingInCellInColumn(line, column)
          }
          if (expectedArray.length === 2) {
            checkForXYWingInLine(line, column)
            checkForXYWingInColumn(line, column)
          }
        }
      }
    }
  }
  function checkForXYZWingInCellInLine(cellLine, cellColumn) {
    let cellExpectedArray = getExpectedArray(cellLine, cellColumn)
    let startLine = cellLine - cellLine % 3
    let startColumn = cellColumn - cellColumn % 3
    for (let column = 0; column < 9; column++) {
      if (board[cellLine][column] === '.' && column !== cellColumn) {
        let lineCellExpectedArray = getExpectedArray(cellLine, column)
        for (let squareLine = startLine; squareLine < startLine + 3; squareLine++) {
          for (let squareColumn = startColumn; squareColumn < startColumn + 3; squareColumn++) {
            if (board[squareLine][squareColumn] === '.' && squareLine !== cellLine) {
              let squareCellExpectedArray = getExpectedArray(squareLine, squareColumn)
              let checkResult = checkThreeExpectedArraysForTriplet(cellExpectedArray, lineCellExpectedArray, squareCellExpectedArray)
              if (checkResult) {
                let removalValue
                for (let expectedValue of cellExpectedArray) {
                  if (lineCellExpectedArray.includes(expectedValue) && squareCellExpectedArray.includes(expectedValue)) {
                    removalValue = expectedValue
                    break
                  }
                }
                for (let index = startColumn; index < startColumn + 3; index++) {
                  if (board[cellLine][index] === '.' && index !== cellColumn) {
                    removeExpectedValueInCell(cellLine, index, removalValue)
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  function checkForXYZWingInCellInColumn(cellLine, cellColumn) {
    let cellExpectedArray = getExpectedArray(cellLine, cellColumn)
    let startLine = cellLine - cellLine % 3
    let startColumn = cellColumn - cellColumn % 3
    for (let line = 0; line < 9; line++) {
      if (board[line][cellColumn] === '.' && line !== cellLine) {
        let columnCellExpectedArray = getExpectedArray(line, cellColumn)
        for (let squareLine = startLine; squareLine < startLine + 3; squareLine++) {
          for (let squareColumn = startColumn; squareColumn < startColumn + 3; squareColumn++) {
            if (board[squareLine][squareColumn] === '.' && squareColumn !== cellColumn) {
              let squareCellExpectedArray = getExpectedArray(squareLine, squareColumn)
              let checkResult = checkThreeExpectedArraysForTriplet(cellExpectedArray, columnCellExpectedArray, squareCellExpectedArray)
              if (checkResult) {
                let removalValue
                for (let expectedValue of cellExpectedArray) {
                  if (columnCellExpectedArray.includes(expectedValue) && squareCellExpectedArray.includes(expectedValue)) {
                    removalValue = expectedValue
                    break
                  }
                }
                for (let index = startLine; index < startLine + 3; index++) {
                  if (board[index][cellColumn] === '.' && index !== cellLine) {
                    removeExpectedValueInCell(index, cellColumn, removalValue)
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  function checkForXYWingInLine(cellLine, cellColumn) {
    let cellExpectedArray = getExpectedArray(cellLine, cellColumn)
    let startLine = cellLine - cellLine % 3
    let startColumn = cellColumn - cellColumn % 3
    for (let column = 0; column < 9; column++) {
      if (board[cellLine][column] === '.' && (column < startColumn || column >= startColumn + 3)) {
        let lineCellExpectedArray = getExpectedArray(cellLine, column)
        for (let squareLine = startLine; squareLine < startLine + 3; squareLine++) {
          for (let squareColumn = startColumn; squareColumn < startColumn + 3; squareColumn++) {
            if (board[squareLine][squareColumn] === '.' && squareLine !== cellLine) {
              let squareCellExpectedArray = getExpectedArray(squareLine, squareColumn)
              if (squareCellExpectedArray.toString() === cellExpectedArray.toString() || lineCellExpectedArray.toString() === cellExpectedArray.toString() || squareCellExpectedArray.toString() === lineCellExpectedArray.toString()) continue
              let checkResult = checkThreeExpectedArraysForTriplet(cellExpectedArray, lineCellExpectedArray, squareCellExpectedArray)
              if (checkResult) {
                let removalValue
                for (let expectedValue of checkResult) {
                  if (!cellExpectedArray.includes(expectedValue)) {
                    removalValue = expectedValue
                    break
                  }
                }
                let lineStartColumn = column - column % 3
                for (let index = startColumn; index < startColumn + 3; index++) {
                  if (board[cellLine][index] === '.' && index !== cellColumn) {
                    removeExpectedValueInCell(cellLine, index, removalValue)
                  }
                  if (board[squareLine][index] === '.' && index !== squareColumn) {
                    removeExpectedValueInCell(squareLine, index, removalValue)
                  }
                }
                for (let index = lineStartColumn; index < lineStartColumn + 3; index++) {
                  if (board[cellLine][index] === '.' && index !== column) {
                    removeExpectedValueInCell(cellLine, index, removalValue)
                  }
                  if (board[squareLine][index] === '.') {
                    removeExpectedValueInCell(squareLine, index, removalValue)
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  function checkForXYWingInColumn(cellLine, cellColumn) {
    let cellExpectedArray = getExpectedArray(cellLine, cellColumn)
    let startLine = cellLine - cellLine % 3
    let startColumn = cellColumn - cellColumn % 3
    for (let line = 0; line < 9; line++) {
      if (board[line][cellColumn] === '.' && (line < startLine || line >= startLine + 3)) {
        let columnCellExpectedArray = getExpectedArray(line, cellColumn)
        for (let squareLine = startLine; squareLine < startLine + 3; squareLine++) {
          for (let squareColumn = startColumn; squareColumn < startColumn + 3; squareColumn++) {
            if (board[squareLine][squareColumn] === '.' && squareColumn !== cellColumn) {
              let squareCellExpectedArray = getExpectedArray(squareLine, squareColumn)
              if (squareCellExpectedArray.toString() === cellExpectedArray.toString() || columnCellExpectedArray.toString() === cellExpectedArray.toString() || squareCellExpectedArray.toString() === columnCellExpectedArray.toString()) continue
              let checkResult = checkThreeExpectedArraysForTriplet(cellExpectedArray, columnCellExpectedArray, squareCellExpectedArray)
              if (checkResult) {
                let removalValue
                for (let expectedValue of checkResult) {
                  if (!cellExpectedArray.includes(expectedValue)) {
                    removalValue = expectedValue
                    break
                  }
                }
                let columnCellStartLine = line - line % 3
                for (let index = startLine; index < startLine + 3; index++) {
                  if (board[index][cellColumn] === '.' && index !== cellLine) {
                    removeExpectedValueInCell(index, cellColumn, removalValue)
                  }
                  if (board[index][squareColumn] === '.' && index !== squareLine) {
                    removeExpectedValueInCell(index, squareColumn, removalValue)
                  }
                }
                for (let index = columnCellStartLine; index < columnCellStartLine + 3; index++) {
                  if (board[index][cellColumn] === '.' && index !== line) {
                    removeExpectedValueInCell(index, cellColumn, removalValue)
                  }
                  if (board[index][squareColumn] === '.') {
                    removeExpectedValueInCell(index, squareColumn, removalValue)
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  initializeMap()
  removeAlreadyExistsFromExpected()

  let start = Date.now()
  while (expectedMap.size !== 0) {
    checkForLonelyCellWithExpectedValue()
    checkAllSquaresForExpectedLinesAndColumns()
    checkForPairedCells()
    checkForNakedPairs()
    checkForNakedTriplets()
    checkForSwordFish()
    checkForXYZWing()
    let workingTime = Date.now() - start
    if (workingTime > 1500) return false
  }

  return board
}