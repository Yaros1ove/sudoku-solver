function solveSudoku(board) {
  const allExpectedValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

  function isCellEmpty(cell) {
    return Array.isArray(cell)
  }

  function isSudokuSolved() {

    for (const line of board) {
      for (const cell of line) {

        if (isCellEmpty(cell)) {
          return false
        }

      }
    }

    return true
  }

  function getLineArrayByIndex(lineIndex) {
    return board[lineIndex]
  }

  function getColumnArrayByIndex(columnIndex) {
    const columnArray = []

    for (const line of board) {
      columnArray.push(line[columnIndex])
    }

    return columnArray
  }

  function getSquareArrayByIndex(squareIndex) {
    const squareArray = []

    const startLine = 3 * Math.floor(squareIndex / 3)
    const startColumn = 3 * (squareIndex % 3)

    for (let line = startLine; line < startLine + 3; line++) {
      for (let column = startColumn; column < startColumn + 3; column++) {

        const cell = board[line][column]
        squareArray.push(cell)

      }
    }

    return squareArray
  }

  function getSquareIndexFromLineAndColumnIndexes(lineIndex, columnIndex) {
    return 3 * Math.floor(lineIndex / 3) + Math.floor(columnIndex / 3)
  }

  function setExpectedValuesInCells() {

    for (const line of board) {
      line.forEach((cell, index, line) => {

        if (cell === '.') {
          line[index] = [...allExpectedValues]
        }

      })
    }

  }

  function isOnlyOneExpectedValueLeftInCell(cell) {
    return cell.length === 1
  }

  function removeExpectedValueOfCellAndSetValueIfNeeded(line, column, value) {
    if (!isValueInExpected(line, column, value)) return

    const expectedValues = board[line][column]
    const valueIndex = expectedValues.indexOf(value)
    expectedValues.splice(valueIndex, 1)

    if (isOnlyOneExpectedValueLeftInCell(line, column)) {
      const expectedValueLeft = board[line][column][0]

      setValueInCell(line, column, expectedValueLeft)
    }
  }

  function setValueInCell(line, column, value) {
    board[line][column] = value

    const key = getKeyFromLineAndColumn(line, column)
    expectedMap.delete(key)

    removeExpectedValuesInLineAndColumnAndSquareForCell(line, column, [value])
  }

  function removeExpectedValuesInLineAndColumnAndSquareForCell(line, column, values) {

    const lineArray = getLineArrayByIndex(line)
    const columnArray = getColumnArrayByIndex(column)
    const squareArray = getSquareArrayByIndex(getSquareIndexFromLineAndColumnIndexes(line, column))

    removeExpectedValuesFromArray(lineArray, values)
    removeExpectedValuesFromArray(columnArray, values)
    removeExpectedValuesFromArray(squareArray, values)

  }

  function removeAlreadySetValuesFromExpected() {

    for (let line = 0; line < 9; line++) {
      for (let column = 0; column < 9; column++) {

        const cell = board[line][column]
        if (!isCellEmpty(cell)) {

          removeExpectedValuesInLineAndColumnAndSquareForCell(line, column, [cell])

        }

      }
    }

  }

  function removeExpectedValuesFromArray(array, values) {

    array.forEach((cell, index, array) => {
      for (const value of values) {

        if (isValueInExpected(cell, value)) {

          const indexOfValue = cell.indexOf(value)
          cell.splice(indexOfValue, 1)
          if (isOnlyOneExpectedValueLeftInCell(cell)) {
            array[index] = cell[0]
          }

        }

      }
    })

  }

  function isValueInExpected(cell, value) {
    if (!isCellEmpty(cell)) return false

    return cell.includes(value)
  }

  function setLonelyCellsWithExpectedValueInLinesAndColumnsAndSquares() {
    for (let index = 0; index < 9; index++) {

      const lineArray = getLineArrayByIndex(index)
      const lineArrayValues = findLonelyCellsWithExpectedValueInArray(lineArray)
      setValuesInLonelyCellsInArrayIfNeeded(lineArray, lineArrayValues)

      const columnArray = getColumnArrayByIndex(index)
      const columnArrayValues = findLonelyCellsWithExpectedValueInArray(columnArray)
      setValuesInLonelyCellsInArrayIfNeeded(columnArray, columnArrayValues)

      const squareArray = getSquareArrayByIndex(index)
      const squareArrayValues = findLonelyCellsWithExpectedValueInArray(squareArray)
      setValuesInLonelyCellsInArrayIfNeeded(squareArray, squareArrayValues)

    }
  }

  function findLonelyCellsWithExpectedValueInArray(array) {
    const lonelyValues = []

    for (const value of allExpectedValues) {
      let valueCounter = 0

      for (const cell of array) {

        if (isValueInExpected(cell, value)) {
          valueCounter++
        }

      }

      if (valueCounter === 1) {
        lonelyValues.push(value)
      }

    }

    return lonelyValues
  }

  function setValuesInLonelyCellsInArrayIfNeeded(array, values) {
    if (!values.length) return

    for (const value of values) {

      const cellIndex = array.findIndex(cell => isValueInExpected(cell, value))
      array[cellIndex] = value

    }
  }

  //check all squares for if we can only set a value in line or column in square; then we know that this line or column can't exist same value in other squares
  function checkAllSquaresForExpectedLinesAndColumns() {
    for (let line = 0; line < 9; line += 3) {
      for (let column = 0; column < 9; column += 3) {
        checkSquareForExpectedLinesAndColumns(line, column)
      }
    }
  }
  //check current square for expected line or column
  function checkSquareForExpectedLinesAndColumns(startLine, startColumn) {
    for (let line = startLine; line < startLine + 3; line++) {
      for (let column = startColumn; column < startColumn + 3; column++) {
        if (isCellEmpty(board[line][column])) {
          let expectedArray = board[line][column]
          for (let expectedValue of expectedArray) {
            //check for line
            if (checkSquareForExpectedLines(startLine, startColumn, expectedValue)) {
              let indexesNotToTouch = [startColumn, startColumn + 1, startColumn + 2]
              removeExpectedValuesInCellLine(line, [expectedValue], indexesNotToTouch)
            }
            //check for columns
            if (checkSquareForExpectedColumns(startLine, startColumn, expectedValue)) {
              let indexesNotToTouch = [startLine, startLine + 1, startLine + 2]
              removeExpectedValuesInCellColumn(column, [expectedValue], indexesNotToTouch)
            }
          }
        }
      }
    }
  }
  //check for presence of line of expected value
  function checkSquareForExpectedLines(startLine, startColumn, value) {
    let presenceCounter = 0
    for (let line = startLine; line < startLine + 3; line++) {
      for (let column = startColumn; column < startColumn + 3; column++) {
        if (isCellEmpty(board[line][column])) {
          let expectedArray = board[line][column]
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
  //check for presence of column of expected value
  function checkSquareForExpectedColumns(startLine, startColumn, value) {
    let presenceCounter = 0
    for (let column = startColumn; column < startColumn + 3; column++) {
      for (let line = startLine; line < startLine + 3; line++) {
        if (isCellEmpty(board[line][column])) {
          let expectedArray = board[line][column]
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
  //check for presence of two cells with two equal expected values
  function checkForPairedCells() {
    for (let line = 0; line < 9; line++) {
      for (let column = 0; column < 9; column++) {
        if (isCellEmpty(board[line][column])) {
          let expectedArray = board[line][column]
          if (expectedArray.length === 2) {
            //check for pair in line
            let pairColumnIndex = checkForPairInLine(line, column, expectedArray)
            if (pairColumnIndex !== -1) {
              let indexesNotToTouch = [column, pairColumnIndex]
              removeExpectedValuesInCellLine(line, expectedArray, indexesNotToTouch)
            }
            //check for pair in column
            let pairLineIndex = checkForPairInColumn(line, column, expectedArray)
            if (pairLineIndex !== -1) {
              let indexesNotToTouch = [line, pairLineIndex]
              removeExpectedValuesInCellColumn(column, expectedArray, indexesNotToTouch)
            }
            //check for pair in square
            let pairKey = checkForPairInSquare(line, column, expectedArray)
            if (pairKey !== -1) {
              let key = getKeyFromLineAndColumn(line, column)
              let indexesNotToTouch = [key, pairKey]
              removeExpectedValuesInCellSquare(line, column, expectedArray, indexesNotToTouch)
            }
          }
        }
      }
    }
  }
  //check for presence of pair in line
  function checkForPairInLine(line, columnIndex, expectedArray) {
    for (let column = 0; column < 9; column++) {
      if (column !== columnIndex && isCellEmpty(board[line][column])) {
        let curExpectedArray = board[line][column]
        if (curExpectedArray.toString() === expectedArray.toString()) return column
      }
    }
    return -1
  }
  //check for presence of pair in column
  function checkForPairInColumn(lineIndex, column, expectedArray) {
    for (let line = 0; line < 9; line++) {
      if (line !== lineIndex && isCellEmpty(board[line][column])) {
        let curExpectedArray = board[line][column]
        if (curExpectedArray.toString() === expectedArray.toString()) return line
      }
    }
    return -1
  }
  //check for presence of pair in square
  function checkForPairInSquare(cellLine, cellColumn, expectedArray) {
    let startLine = cellLine - cellLine % 3
    let startColumn = cellColumn - cellColumn % 3
    for (let line = startLine; line < startLine + 3; line++) {
      for (let column = startColumn; column < startColumn + 3; column++) {
        if (!(line === cellLine && column === cellColumn) && isCellEmpty(board[line][column])) {
          let curExpectedArray = board[line][column]
          if (curExpectedArray.toString() === expectedArray.toString()) return getKeyFromLineAndColumn(line, column)
        }
      }
    }
    return -1
  }
  //naked pair is a pair that has more then two expected in common, but there are no more places for two expected values to be set
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
        if (isValueInExpected(line, column, expectedValue)) {
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
            removeExpectedValueOfCellAndSetValueIfNeeded(line, index1, value)
            removeExpectedValueOfCellAndSetValueIfNeeded(line, index2, value)
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
        if (isValueInExpected(line, column, expectedValue)) {
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
            removeExpectedValueOfCellAndSetValueIfNeeded(index1, column, value)
            removeExpectedValueOfCellAndSetValueIfNeeded(index2, column, value)
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
          if (isValueInExpected(line, column, expectedValue)) {
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
            removeExpectedValueOfCellAndSetValueIfNeeded(line1, column1, value)
            removeExpectedValueOfCellAndSetValueIfNeeded(line2, column2, value)
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
  //naked triplet is a triplet that have only three values to set in common (in line, column or square)
  function checkForNakedTriplets() {

    for (let index = 0; index < 9; index++) {
      let lineCheckResult = checkForNakedTripletInLine(index)
      if (lineCheckResult) {
        let values = lineCheckResult[0]
        let indexesNotToTouch = lineCheckResult[1]
        removeExpectedValuesInCellLine(index, values, indexesNotToTouch)
      }
      let columnCheckResult = checkForNakedTripletInColumn(index)
      if (columnCheckResult) {
        let values = columnCheckResult[0]
        let indexesNotToTouch = columnCheckResult[1]
        removeExpectedValuesInCellColumn(index, values, indexesNotToTouch)
      }
    }

    for (let line = 0; line < 9; line += 3) {
      for (let column = 0; column < 9; column += 3) {
        let squareCheckResult = checkForNakedTripletInSquare(line, column)
        if (squareCheckResult) {
          let values = squareCheckResult[0]
          let keysNotToTouch = squareCheckResult[1]
          removeExpectedValuesInCellSquare(line, column, values, keysNotToTouch)
        }
      }
    }
  }
  function checkForNakedTripletInLine(line) {
    F1: for (let column1 = 0; column1 < 7; column1++) {
      F2: for (let column2 = column1 + 1; column2 < 8; column2++) {
        F3: for (let column3 = column2 + 1; column3 < 9; column3++) {
          if (!isCellEmpty(board[line][column1])) continue F1
          if (!isCellEmpty(board[line][column2])) continue F2
          if (!isCellEmpty(board[line][column3])) continue F3

          let expectedArray1 = board[line][column1]
          let expectedArray2 = board[line][column2]
          let expectedArray3 = board[line][column3]

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
          if (!isCellEmpty(board[line1][column])) continue F1
          if (!isCellEmpty(board[line2][column])) continue F2
          if (!isCellEmpty(board[line3][column])) continue F3

          let expectedArray1 = board[line1][column]
          let expectedArray2 = board[line2][column]
          let expectedArray3 = board[line3][column]

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
          if (!isCellEmpty(board[startLine + Math.floor(index1 / 3)][startColumn + index1 % 3])) continue F1
          if (!isCellEmpty(board[startLine + Math.floor(index2 / 3)][startColumn + index2 % 3])) continue F2
          if (!isCellEmpty(board[startLine + Math.floor(index3 / 3)][startColumn + index3 % 3])) continue F3

          let expectedArray1 = board[startLine + Math.floor(index1 / 3)][startColumn + index1 % 3]
          let expectedArray2 = board[startLine + Math.floor(index2 / 3)][startColumn + index2 % 3]
          let expectedArray3 = board[startLine + Math.floor(index3 / 3)][startColumn + index3 % 3]

          let checkResult = checkThreeExpectedArraysForTriplet(expectedArray1, expectedArray2, expectedArray3)
          if (checkResult) {
            let keysNotToTouch = []
            keysNotToTouch.push(getKeyFromLineAndColumn(startLine + Math.floor(index1 / 3), startColumn + index1 % 3))
            keysNotToTouch.push(getKeyFromLineAndColumn(startLine + Math.floor(index2 / 3), startColumn + index2 % 3))
            keysNotToTouch.push(getKeyFromLineAndColumn(startLine + Math.floor(index3 / 3), startColumn + index3 % 3))
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
          if (isValueInExpected(line, column, expectedValue)) {
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
              removeExpectedValueOfCellAndSetValueIfNeeded(line, column, expectedValue)
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
          if (isValueInExpected(line, column, expectedValue)) {
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
              removeExpectedValueOfCellAndSetValueIfNeeded(line, column, expectedValue)
            }
          }
        }
      }
    }
  }
  function checkForXYZWing() {
    for (let line = 0; line < 9; line++) {
      for (let column = 0; column < 9; column++) {
        if (isCellEmpty(board[line][column])) {
          let expectedArray = board[line][column]
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
    let cellExpectedArray = board[cellLine][cellColumn]
    let startLine = cellLine - cellLine % 3
    let startColumn = cellColumn - cellColumn % 3
    for (let column = 0; column < 9; column++) {
      if (isCellEmpty(board[cellLine][column]) && column !== cellColumn) {
        let lineCellExpectedArray = board[cellLine][column]
        for (let squareLine = startLine; squareLine < startLine + 3; squareLine++) {
          for (let squareColumn = startColumn; squareColumn < startColumn + 3; squareColumn++) {
            if (isCellEmpty(board[squareLine][squareColumn]) && squareLine !== cellLine) {
              let squareCellExpectedArray = board[squareLine][squareColumn]
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
                  if (isCellEmpty(board[cellLine][index]) && index !== cellColumn) {
                    removeExpectedValueOfCellAndSetValueIfNeeded(cellLine, index, removalValue)
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
    let cellExpectedArray = board[cellLine][cellColumn]
    let startLine = cellLine - cellLine % 3
    let startColumn = cellColumn - cellColumn % 3
    for (let line = 0; line < 9; line++) {
      if (isCellEmpty(board[line][cellColumn]) && line !== cellLine) {
        let columnCellExpectedArray = board[line][cellColumn]
        for (let squareLine = startLine; squareLine < startLine + 3; squareLine++) {
          for (let squareColumn = startColumn; squareColumn < startColumn + 3; squareColumn++) {
            if (isCellEmpty(board[squareLine][squareColumn]) && squareColumn !== cellColumn) {
              let squareCellExpectedArray = board[squareLine][squareColumn]
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
                  if (isCellEmpty(board[index][cellColumn]) && index !== cellLine) {
                    removeExpectedValueOfCellAndSetValueIfNeeded(index, cellColumn, removalValue)
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
    let cellExpectedArray = board[cellLine][cellColumn]
    let startLine = cellLine - cellLine % 3
    let startColumn = cellColumn - cellColumn % 3
    for (let column = 0; column < 9; column++) {
      if (isCellEmpty(board[cellLine][column]) && (column < startColumn || column >= startColumn + 3)) {
        let lineCellExpectedArray = board[cellLine][column]
        for (let squareLine = startLine; squareLine < startLine + 3; squareLine++) {
          for (let squareColumn = startColumn; squareColumn < startColumn + 3; squareColumn++) {
            if (isCellEmpty(board[squareLine][squareColumn]) && squareLine !== cellLine) {
              let squareCellExpectedArray = board[squareLine][squareColumn]
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
                  if (isCellEmpty(board[cellLine][index]) && index !== cellColumn) {
                    removeExpectedValueOfCellAndSetValueIfNeeded(cellLine, index, removalValue)
                  }
                  if (isCellEmpty(board[squareLine][index]) && index !== squareColumn) {
                    removeExpectedValueOfCellAndSetValueIfNeeded(squareLine, index, removalValue)
                  }
                }
                for (let index = lineStartColumn; index < lineStartColumn + 3; index++) {
                  if (isCellEmpty(board[cellLine][index]) && index !== column) {
                    removeExpectedValueOfCellAndSetValueIfNeeded(cellLine, index, removalValue)
                  }
                  if (isCellEmpty(board[squareLine][index])) {
                    removeExpectedValueOfCellAndSetValueIfNeeded(squareLine, index, removalValue)
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
    let cellExpectedArray = board[cellLine][cellColumn]
    let startLine = cellLine - cellLine % 3
    let startColumn = cellColumn - cellColumn % 3
    for (let line = 0; line < 9; line++) {
      if (isCellEmpty(board[line][cellColumn]) && (line < startLine || line >= startLine + 3)) {
        let columnCellExpectedArray = board[line][cellColumn]
        for (let squareLine = startLine; squareLine < startLine + 3; squareLine++) {
          for (let squareColumn = startColumn; squareColumn < startColumn + 3; squareColumn++) {
            if (isCellEmpty(board[squareLine][squareColumn]) && squareColumn !== cellColumn) {
              let squareCellExpectedArray = board[squareLine][squareColumn]
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
                  if (isCellEmpty(board[index][cellColumn]) && index !== cellLine) {
                    removeExpectedValueOfCellAndSetValueIfNeeded(index, cellColumn, removalValue)
                  }
                  if (isCellEmpty(board[index][squareColumn]) && index !== squareLine) {
                    removeExpectedValueOfCellAndSetValueIfNeeded(index, squareColumn, removalValue)
                  }
                }
                for (let index = columnCellStartLine; index < columnCellStartLine + 3; index++) {
                  if (isCellEmpty(board[index][cellColumn]) && index !== line) {
                    removeExpectedValueOfCellAndSetValueIfNeeded(index, cellColumn, removalValue)
                  }
                  if (isCellEmpty(board[index][squareColumn])) {
                    removeExpectedValueOfCellAndSetValueIfNeeded(index, squareColumn, removalValue)
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  setExpectedValuesInCells()
  removeAlreadySetValuesFromExpected()

  const start = Date.now()

  while (!isSudokuSolved()) {

    setLonelyCellsWithExpectedValueInLinesAndColumnsAndSquares()
    checkAllSquaresForExpectedLinesAndColumns()
    checkForPairedCells()
    checkForNakedPairs()
    checkForNakedTriplets()
    checkForSwordFish()
    checkForXYZWing()

    const workingTime = Date.now() - start
    if (workingTime > 1500) return null

  }

  return board
}