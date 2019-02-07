import { createInitialGameField, getNeighborsMap } from './game-utils'

describe('getNeighborsMap', () => {
  test('Works for empty field', () => {
    const fieldSize = 5
    const gameField = createInitialGameField({ rows: fieldSize, cols: fieldSize })
    const neighborsMap = getNeighborsMap(gameField)

    expect(neighborsMap.length).toBe(fieldSize)
    expect(neighborsMap[0].length).toBe(fieldSize)
    neighborsMap.forEach(rowCells => rowCells.forEach(cell => expect(cell).toBe(0)))
  })
})

describe('createInitialGameField', () => {
  test('Creates game field with given size', () => {
    const fieldSize = 5
    const gameField = createInitialGameField({ rows: fieldSize, cols: fieldSize })
    expect(gameField.length).toBe(fieldSize)
    expect(gameField[0].length).toBe(fieldSize)
  })
})
