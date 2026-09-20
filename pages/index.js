import Image from 'next/image'
import { useEffect, useRef, useState } from 'react';
import State from '../components/state'
import Solution from '../components/solution'
import Selector from '../components/selector'
import ColorSelector from '../components/colorSelector'
import ConfigIssues from '../components/configIssues'
import Spinner from '../components/spinner'
import Seo from '../components/seo'
import styles from '../styles/Home.module.css'
import stateLib from '../lib/states'
import colorPalette from '../lib/colors'
import { TOOLS } from '../lib/tools'
import { loadPuzzle, savePuzzle, clearPuzzle } from '../lib/storage'

const CANCEL_DELAY_MS = 5000
const UNDO_LIMIT = 20

export default function Home() {
  const PAGE_STATUSES = {
    NUMBER_INPUT: 0,
    COLOR_INPUT: 1,
    SOLUTION_OUTPUT: 2,
    SOLUTION_NOT_FOUND: 3,
    SOLUTION_GAVE_UP: 4
  }
  const [totalNumber, setTotalNumber] = useState('')
  const [emptyNumber, setEmptyNumber] = useState('')
  const [color, setColor] = useState(TOOLS.REMOVE)
  const [tubes, setTubes] = useState([])
  const [undoStack, setUndoStack] = useState([])
  const [history, setHistory] = useState([])
  const [pageStatus, setPageStatus] = useState(PAGE_STATUSES.NUMBER_INPUT)
  const [isSolving, setIsSolving] = useState(false)
  const [canCancel, setCanCancel] = useState(false)
  const [hasRestored, setHasRestored] = useState(false)
  const workerRef = useRef(null)
  const cancelTimerRef = useRef(null)

  useEffect(() => () => {
    workerRef.current?.terminate()
    clearTimeout(cancelTimerRef.current)
  }, [])

  // The page is prerendered, so the saved puzzle can only be read after mounting
  useEffect(() => {
    const saved = loadPuzzle()
    if (saved) {
      setTotalNumber(saved.total)
      setEmptyNumber(saved.empty)
      setTubes(saved.tubes)
      setColor(saved.selection)
      setPageStatus(saved.screen === 'colors' ? PAGE_STATUSES.COLOR_INPUT : PAGE_STATUSES.NUMBER_INPUT)
    }
    setHasRestored(true)
  }, [])

  // Solution screens are not saved: after a reload the user lands on the fill-tubes screen
  useEffect(() => {
    if (!hasRestored) return
    if (totalNumber === '') {
      clearPuzzle()
      return
    }
    savePuzzle({
      screen: pageStatus === PAGE_STATUSES.NUMBER_INPUT ? 'config' : 'colors',
      total: totalNumber,
      empty: emptyNumber,
      tubes,
      selection: color
    })
  }, [hasRestored, pageStatus, totalNumber, emptyNumber, tubes, color])


  const setNumberOfTubes = function (total, empty) {
    const isUnchanged = total === totalNumber && empty === emptyNumber && tubes.length === total
    setTotalNumber(total)
    setEmptyNumber(empty)
    if (!isUnchanged) {
      setTubes(Array.from({ length: total }, () => []))
      setUndoStack([])
    }
    setPageStatus(PAGE_STATUSES.COLOR_INPUT)
  }

  const handleClick = function (index, selection) {
    const tubesCopy = stateLib.deepCopy(tubes)
    const tube = tubesCopy[index]
    if (selection === TOOLS.REMOVE) {
      if (!tube.length) return
      tube.pop()
    } else if (selection === TOOLS.EMPTY) {
      if (!tube.length) return
      tube.length = 0
    } else {
      const isColorAllowed = validation.canAddNewColor || validation.usedColors.includes(selection)
      if (tube.length >= 4 || !isColorAllowed) return
      tube.push(selection)
    }
    setUndoStack([...undoStack, tubes].slice(-UNDO_LIMIT))
    setTubes(tubesCopy)
  }

  const undo = function () {
    setTubes(undoStack[undoStack.length - 1])
    setUndoStack(undoStack.slice(0, -1))
  }

  const stopSolving = function () {
    workerRef.current?.terminate()
    workerRef.current = null
    clearTimeout(cancelTimerRef.current)
    setIsSolving(false)
    setCanCancel(false)
  }

  const solvePuzzle = function () {
    setIsSolving(true)
    cancelTimerRef.current = setTimeout(() => setCanCancel(true), CANCEL_DELAY_MS)
    const worker = new Worker(new URL('../lib/solver.worker.js', import.meta.url))
    workerRef.current = worker
    worker.onmessage = (event) => {
      const { status, history: solution } = event.data
      if (status === 'solved') {
        setHistory(solution)
        setPageStatus(PAGE_STATUSES.SOLUTION_OUTPUT)
      } else {
        setPageStatus(status === 'gave-up' ? PAGE_STATUSES.SOLUTION_GAVE_UP : PAGE_STATUSES.SOLUTION_NOT_FOUND)
      }
      stopSolving()
    }
    worker.onerror = stopSolving
    worker.postMessage(tubes)
  }

  const backToColors = function () {
    setPageStatus(PAGE_STATUSES.COLOR_INPUT)
  }

  const backToConfig = function () {
    setPageStatus(PAGE_STATUSES.NUMBER_INPUT)
  }

  const newLevel = function () {
    setTubes([])
    setUndoStack([])
    setColor(TOOLS.REMOVE)
    setPageStatus(PAGE_STATUSES.NUMBER_INPUT)
  }

  const validation = stateLib.validateConfiguration(tubes, emptyNumber)

  const endButtons = (
    <div className={styles.navButtons}>
      <button className={styles.secondaryButton} onClick={backToColors}>BACK</button>
      <button className={styles.button} onClick={newLevel}>NEW LEVEL</button>
    </div>
  )

  function PageComponent() {
    switch (pageStatus) {
      case PAGE_STATUSES.NUMBER_INPUT:
        return (
          <>
            <Image src="/logo.webp"
              alt="Water Sort Puzzle Logo"
              width={100}
              height={100}
            ></Image>
            <h1>Configure game settings</h1>
            <Selector key={`${totalNumber}-${emptyNumber}`} onClick={setNumberOfTubes} initialTotal={totalNumber} initialEmpty={emptyNumber} />
          </>
        )
      case PAGE_STATUSES.COLOR_INPUT:
        return (
          <>
            <div className={styles.colorSelectionContainer} >
              <h1>Use the colors to fill the tubes until they look like your puzzle</h1>
            </div>
            <State tubes={tubes} numberOfReadOnly={emptyNumber} colorSelected={color} onClick={handleClick} />
            <ColorSelector colorSelected={color} selectColor={setColor} usedColors={validation.usedColors} canAddNewColor={validation.canAddNewColor} canUndo={undoStack.length > 0} onUndo={undo} />
            {!validation.canAddNewColor && validation.usedColors.length < colorPalette.length && <p className={styles.centeredText}>All {validation.numberOfColors} colors are in use. The other colors are disabled.</p>}
            {!validation.isValid && <ConfigIssues id="config-issues" wrongColors={validation.wrongColors} incompleteTubes={validation.incompleteTubes} />}
            {isSolving
              ? <Spinner label="Solving..." onCancel={canCancel ? stopSolving : undefined} />
              : (
                <div className={styles.navButtons}>
                  <button className={styles.secondaryButton} onClick={backToConfig}>BACK</button>
                  <button className={styles.button} disabled={!validation.isValid} aria-describedby={validation.isValid ? undefined : "config-issues"} onClick={solvePuzzle}>SOLVE</button>
                </div>
              )}
          </>
        )
      case PAGE_STATUSES.SOLUTION_OUTPUT:
        return (
          <>
            <Solution history={history} />
            {endButtons}
          </>
        )
      case PAGE_STATUSES.SOLUTION_NOT_FOUND:
        return (
          <>
            <h2 className={styles.centeredText}>Solution not found. Check your colors.</h2>
            {endButtons}
          </>
        )
      case PAGE_STATUSES.SOLUTION_GAVE_UP:
        return (
          <>
            <h2 className={styles.centeredText}>The solver could not finish this puzzle. Check your colors and try again.</h2>
            {endButtons}
          </>
        )
    }
  }
  return (
    <div className={styles.container}>
      <Seo
        title="Water Sort Puzzle Solver - Solve any level step by step"
        description="Free online Water Sort Puzzle solver. Enter your tubes and colors and get the step-by-step solution instantly."
      />

      <main className={styles.main}>
        <PageComponent />
      </main>
    </div>
  )
}
