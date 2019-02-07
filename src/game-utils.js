import _ from 'lodash'

const create2dArray = (rows, cols, getValue) =>
  new Array(rows)
    .fill(null)
    .map((rowValue, rowIndex) =>
      new Array(cols).fill(undefined).map((colValue, colIndex) => getValue(rowIndex, colIndex)),
    )

export const getFieldDimensions = field => ({
  rows: field.length,
  cols: field.length > 0 ? field[0].length : 0,
})

export const createInitialGameField = ({ rows = 10, cols = 10, getCellValue = () => 0 } = {}) => {
  const field = create2dArray(rows, cols, getCellValue)
  return field
}

const DIRECTIONS = ['u', 'd', 'l', 'r', 'ur', 'ul', 'dr', 'dl']

export const getNeighborCellIndex = (rows, cols, direction, { row, col }) => {
  if (col >= cols || col < 0) {
    throw Error(`Column index out of bounds: got ${col}, expected an integer between 0 and ${cols}`)
  }
  if (row >= rows || row < 0) {
    throw Error(`Row index out of bounds: got ${col}, expected an integer between 0 and ${rows}`)
  }

  switch (direction) {
    case 'u':
      return { row: (row - 1 + rows) % rows, col }
    case 'd':
      return { row: (row + 1 + rows) % rows, col }
    case 'r':
      return { row, col: (col + 1 + cols) % cols }
    case 'l':
      return { row, col: (col - 1 + cols) % cols }
    case 'ur':
      return getNeighborCellIndex(
        rows,
        cols,
        'r',
        getNeighborCellIndex(rows, cols, 'u', { row, col }),
      )
    case 'ul':
      return getNeighborCellIndex(
        rows,
        cols,
        'l',
        getNeighborCellIndex(rows, cols, 'u', { row, col }),
      )
    case 'dr':
      return getNeighborCellIndex(
        rows,
        cols,
        'r',
        getNeighborCellIndex(rows, cols, 'd', { row, col }),
      )
    case 'dl':
      return getNeighborCellIndex(
        rows,
        cols,
        'l',
        getNeighborCellIndex(rows, cols, 'd', { row, col }),
      )
    default:
      throw new Error(`Unexpected direction: "${direction}", valid values are ${DIRECTIONS}`)
  }
}

export const getNeighborsMap = _.memoize(field => {
  const { rows, cols } = getFieldDimensions(field)
  const neighborsMap = create2dArray(rows, cols, () => 0)

  field.forEach((rowCells, row) => {
    rowCells.forEach((cell, col) => {
      DIRECTIONS.forEach(direction => {
        const { row: neighborRow, col: neighborCol } = getNeighborCellIndex(rows, cols, direction, {
          row,
          col,
        })

        if (field[row][col] === 1) {
          neighborsMap[neighborRow][neighborCol] += 1
        }
      })
    })
  })

  return neighborsMap
})

const getNextGameFieldOneStep = field => {
  const neighborsMap = getNeighborsMap(field)
  const newField = _.cloneDeep(field)

  field.forEach((rowCells, row) => {
    rowCells.forEach((cell, col) => {
      const neighborsCount = neighborsMap[row][col]
      let newCellValue = cell

      if (cell === 1 && (neighborsCount < 2 || neighborsCount > 3)) {
        newCellValue = 0
      } else if (cell === 0 && neighborsCount === 3) {
        newCellValue = 1
      }

      newField[row][col] = newCellValue
    })
  })

  return newField
}

export const getNextGameField = (field, steps = 1) => {
  let resultField = field
  for (let i = 0; i < steps; i += 1) {
    resultField = getNextGameFieldOneStep(resultField)
  }

  return resultField
}
