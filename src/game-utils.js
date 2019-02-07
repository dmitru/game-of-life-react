export const createInitialGameField = ({
  fieldWidth = 10,
  fieldHeight = 10,
  getCellValue = () => 0,
} = {}) => {
  const field = new Array(fieldHeight)
    .fill(null)
    .map((rowValue, rowIndex) =>
      new Array(fieldWidth)
        .fill(undefined)
        .map((colValue, colIndex) => getCellValue(rowIndex, colIndex)),
    )
  return field
}
