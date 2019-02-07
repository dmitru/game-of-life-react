/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'emotion'
import styled from '@emotion/styled'
import { darken } from 'polished'
import _ from 'lodash'

import './App.css'
import { printExecutionTime } from './perf-utils'
import { createInitialGameField, getNextGameField, getFieldDimensions } from './game-utils'

const GameFieldCell = ({ value, ...props }) => (
  <rect
    {...props}
    fill={value === 1 ? 'black' : 'white'}
    stroke="#ddd"
    className={css(`transition: fill 0.3s;`)}
  />
)

const GameField = ({ field, width, height }) => {
  const { rows, cols } = getFieldDimensions(field)

  const cellWidth = width / rows
  const cellHeight = height / cols

  const cells = []
  _.range(rows).forEach(row => {
    _.range(cols).forEach(col => {
      cells.push(
        GameFieldCell({
          key: (row * 1000000 + col).toString(),
          value: field[row][col],
          x: col * cellWidth,
          y: row * cellHeight,
          width: cellWidth,
          height: cellHeight,
        }),
      )
    })
  })

  return (
    <div className={css(`border: 1px solid #ddd; width: ${width}px; height: ${height}px;`)}>
      <svg height={height} width={width}>
        {cells}
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

const DEFAULT_FIELD_SIZE = 40

const getNextFieldAndPrintExecutionTime = printExecutionTime(getNextGameField)

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

    lastUpdateTimestamp: window.performance.now(),
    fpsMovingAverage: 0,

    field: createInitialGameField({
      rows: DEFAULT_FIELD_SIZE,
      cols: DEFAULT_FIELD_SIZE,
      getCellValue: () => (Math.random() > 0.8 ? 1 : 0),
    }),
  }

  updateLoop = _.throttle(() => {
    if (this.state.isPlaying) {
      const updateTimestamp = window.performance.now()
      const currentFps = 1000.0 / (updateTimestamp - this.state.lastUpdateTimestamp)

      this.setState(
        {
          field: getNextFieldAndPrintExecutionTime(this.state.field),
          stepsCount: this.state.stepsCount + 1,
          lastUpdateTimestamp: updateTimestamp,
          fpsMovingAverage:
            this.state.fpsMovingAverage + (currentFps - this.state.fpsMovingAverage) / 10,
        },
        () => {
          requestAnimationFrame(this.updateLoop)
        },
      )
    }
  }, 1000 / 60)

  handleStartAgainClick = () => {
    this.setState({
      field: createInitialGameField({
        rows: this.state.rows,
        cols: this.state.cols,
        getCellValue: () => (Math.random() > 0.8 ? 1 : 0),
        stepsCount: 0,
      }),
    })
  }

  handleNextStateClick = () => {
    this.setState({
      field: getNextFieldAndPrintExecutionTime(this.state.field),
      stepsCount: this.state.stepsCount + 1,
    })
  }

  handleTogglePlayback = () => {
    const isStarting = !this.state.isPlaying
    this.setState({ isPlaying: !this.state.isPlaying, stepsCount: 0 }, () => {
      if (isStarting) {
        this.updateLoop()
      }
    })
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

          <span className={css(`margin-left: 10px; width: 100px; display: inline-block;`)}>
            {`Step: ${this.state.stepsCount}`}
          </span>

          <span className={css(`margin-left: 10px;`)}>
            {`FPS: ${this.state.fpsMovingAverage.toFixed(2)}`}
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
