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
    <div className={css(`border: 1px solid #ddd; width: ${width}px; height: ${height}px;`)}>
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
                stroke="#ddd"
                className={css(`transition: fill 0.4s;`)}
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
  margin: 5px;
  background: turquoise;
  border: 1px solid ${darken(0.2, 'turquoise')};

  &:hover,
  &:focus {
    background: ${darken(0.1, 'turquoise')};
  }
`

const DEFAULT_FIELD_SIZE = 70

class App extends Component {
  state = {
    fieldSize: {
      width: 800,
      height: 600,
    },

    stepsCount: 0,
    rows: DEFAULT_FIELD_SIZE,
    cols: DEFAULT_FIELD_SIZE,

    isPlaying: false,

    field: createInitialGameField({
      rows: DEFAULT_FIELD_SIZE,
      cols: DEFAULT_FIELD_SIZE,
      getCellValue: () => (Math.random() > 0.9 ? 1 : 0),
    }),
  }

  handleStartAgainClick = () => {
    this.setState({
      field: createInitialGameField({
        rows: this.state.rows,
        cols: this.state.cols,
        getCellValue: () => (Math.random() > 0.9 ? 1 : 0),
        stepsCount: 0,
      }),
    })
  }

  handleNextStateClick = () => {
    this.nextState()
  }

  nextState = () => {
    this.setState({
      field: getNextGameField(this.state.field),
      stepsCount: this.state.stepsCount + 1,
    })
  }

  handleTogglePlayback = () => {
    const isStarting = !this.state.isPlaying
    if (isStarting) {
      this.updateIntervalHandle = setInterval(this.nextState, 100)
    } else {
      clearInterval(this.updateIntervalHandle)
    }

    this.setState({ isPlaying: !this.state.isPlaying, stepsCount: 0 })
  }

  render() {
    return (
      <div className={css(`display: flex; flex-direction: column;`)}>
        <div className={css(`padding: 10px;`)}>
          <Button onClick={this.handleStartAgainClick}>Start again</Button>
          <Button onClick={this.handleNextStateClick}>Next</Button>
          <Button onClick={this.handleTogglePlayback} className={css(`width: 80px;`)}>
            {this.state.isPlaying ? 'Pause' : 'Play'}
          </Button>

          <span>
            Step:
            {this.state.stepsCount}
          </span>
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
