/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'emotion'
import styled from '@emotion/styled'
import { darken } from 'polished'
import _ from 'lodash'

import './App.css'
import { createInitialGameField, getNextGameField, getFieldDimensions } from './game-utils'

const GameField = ({ field, width, height }) => {
  const { rows, cols } = getFieldDimensions(field)

  const cellWidth = width / rows
  const cellHeight = height / cols

  return (
    <div className={css(`border: 1px solid black; width: ${width}px; height: ${height}px;`)}>
      <svg height={height} width={width}>
        {_.flatten(
          field.map((rowCells, rowIndex) =>
            rowCells.map((cellValue, colIndex) => (
              <rect
                // eslint-disable-next-line react/no-array-index-key
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * cellWidth}
                y={rowIndex * cellHeight}
                width={cellWidth}
                height={cellHeight}
                fill={cellValue === 1 ? 'black' : 'white'}
                stroke="#999"
              />
            )),
          ),
        )}
      </svg>
    </div>
  )
}

GameField.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  field: PropTypes.array.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
}

GameField.defaultProps = {
  width: 200,
  height: 200,
}

const Button = styled.button`
  padding: 10px 15px;
  background: turquoise;
  border: 1px solid ${darken(0.2, 'turquoise')};

  &:hover,
  &:focus {
    background: ${darken(0.1, 'turquoise')};
  }
`

class App extends Component {
  state = {
    fieldSize: {
      width: 500,
      height: 500,
    },
    field: createInitialGameField({ getCellValue: () => (Math.random() > 0.9 ? 1 : 0) }),
  }

  handleRandomGameClick = () => {
    this.setState({
      field: createInitialGameField({ getCellValue: () => (Math.random() > 0.9 ? 1 : 0) }),
    })
  }

  handleNextStateClick = () => {
    this.setState({
      field: getNextGameField(this.state.field),
    })
  }

  render() {
    return (
      <div className={css(`display: flex;`)}>
        <div className={css(`padding: 10px;`)}>
          <Button onClick={this.handleRandomGameClick}>Random game</Button>
          <Button onClick={this.handleNextStateClick}>Next</Button>
        </div>

        <div className={css(`padding: 10px; flex: 1;`)}>
          <GameField
            field={this.state.field}
            width={this.state.fieldSize.width}
            height={this.state.fieldSize.height}
          />
        </div>
      </div>
    )
  }
}

export default App
