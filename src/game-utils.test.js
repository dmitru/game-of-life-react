import { createInitialGameState } from './game-utils'

describe('createInitialGameState', () => {
  test('Creates game field with given size', () => {
    const fieldSize = 5
    const gameState = createInitialGameState({ fieldHeight: fieldSize, fieldWidth: fieldSize })
    expect(gameState.field.length).toBe(fieldSize)
    expect(gameState.field[0].length).toBe(fieldSize)
  })
})
