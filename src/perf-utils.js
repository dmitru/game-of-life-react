/* eslint-disable import/prefer-default-export */

export const printExecutionTime = (fn, prefix = '') => {
  return function wrappedFunction(...args) {
    const t1 = window.performance.now()

    const result = fn(...args)

    const t2 = window.performance.now()
    const msPassed = t2 - t1

    // eslint-disable-next-line no-console
    console.log(`${['PERF', prefix].filter(x => x).join('/')}: ${msPassed} ms`)

    return result
  }
}
