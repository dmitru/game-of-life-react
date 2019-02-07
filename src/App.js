import React, { Component } from 'react'
import { css } from 'emotion'
import _ from 'lodash'

import './App.css'
import { createInitialGameField } from './game-utils'

const GameField = ({ field, width, height }) => {
  const fieldRows = field.length
  const fieldCols = field[0].length

  const cellWidth = width / fieldRows
  const cellHeight = height / fieldCols

  return (
    <div className={css(`border: 1px solid black; width: ${width}px; height: ${height}px;`)}>
      <svg height={height} width={width}>
        {_.flatten(
          field.map((rows, rowIndex) =>
            rows.map((cellValue, colIndex) => (
              <rect
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * cellWidth}
                y={rowIndex * cellHeight}
                width={cellWidth}
                height={cellHeight}
                fill={cellValue === 1 ? 'white' : 'black'}
                stroke="#999"
              />
            )),
          ),
        )}
      </svg>
    </div>
  )
}

GameField.defaultProps = {
  width: 200,
  height: 200,
}

class App extends Component {
  state = {
    fieldSize: {
      width: 500,
      height: 500,
    },
    field: createInitialGameField({ getCellValue: () => (Math.random() > 0.7 ? 1 : 0) }),
  }

  render() {
    return (
      <GameField
        field={this.state.field}
        width={this.state.fieldSize.width}
        height={this.state.fieldSize.height}
      />
    )
  }
}

export default App
