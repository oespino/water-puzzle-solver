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

const CANCEL_DELAY_MS = 5000

export default function Home() {
  const PAGE_STATUSES = {
    NUMBER_INPUT: 0,
    COLOR_INPUT: 1,
    SOLUTION_OUTPUT: 2,
    SOLUTION_NOT_FOUND: 3
  }
  const [totalNumber, setTotalNumber] = useState('')
  const [emptyNumber, setEmptyNumber] = useState('')
  const [color, setColor] = useState(TOOLS.REMOVE)
  const [tubes, setTubes] = useState([])
  const [undoSnapshot, setUndoSnapshot] = useState(null)
  const [history, setHistory] = useState([])
  const [pageStatus, setPageStatus] = useState(PAGE_STATUSES.NUMBER_INPUT)
  const [isSolving, setIsSolving] = useState(false)
  const [canCancel, setCanCancel] = useState(false)
  const workerRef = useRef(null)
  const cancelTimerRef = useRef(null)

  useEffect(() => () => {
    workerRef.current?.terminate()
    clearTimeout(cancelTimerRef.current)
  }, [])


  const setNumberOfTubes = function (totalNumber, emptyNumber) {
    setTotalNumber(totalNumber)
    setEmptyNumber(emptyNumber)
    const localTubes = []
    for (let i = 0; i < totalNumber; i++) {
      localTubes.push([])
    }
    setTubes(localTubes)
    setUndoSnapshot(null)
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
    setUndoSnapshot(tubes)
    setTubes(tubesCopy)
  }

  const undo = function () {
    setTubes(undoSnapshot)
    setUndoSnapshot(null)
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
      const historyLocal = event.data
      if (!historyLocal.length) {
        setPageStatus(PAGE_STATUSES.SOLUTION_NOT_FOUND)
      } else {
        setHistory(historyLocal)
        setPageStatus(PAGE_STATUSES.SOLUTION_OUTPUT)
      }
      stopSolving()
    }
    worker.onerror = stopSolving
    worker.postMessage(tubes)
  }

  const backToStart = function () {
    setPageStatus(PAGE_STATUSES.COLOR_INPUT)
  }

  const validation = stateLib.validateConfiguration(tubes, emptyNumber)

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
            <Selector onClick={setNumberOfTubes} />
          </>
        )
      case PAGE_STATUSES.COLOR_INPUT:
        return (
          <>
            <div className={styles.colorSelectionContainer} >
              <h1>Use the colors to fill the tubes until they look like your puzzle</h1>
            </div>
            <State tubes={tubes} numberOfReadOnly={emptyNumber} colorSelected={color} onClick={handleClick} />
            <ColorSelector colorSelected={color} selectColor={setColor} usedColors={validation.usedColors} canAddNewColor={validation.canAddNewColor} canUndo={!!undoSnapshot} onUndo={undo} />
            {!validation.canAddNewColor && validation.usedColors.length < colorPalette.length && <p className={styles.centeredText}>All {validation.numberOfColors} colors are in use. The other colors are disabled.</p>}
            {!validation.isValid && <ConfigIssues id="config-issues" wrongColors={validation.wrongColors} incompleteTubes={validation.incompleteTubes} />}
            {isSolving
              ? <Spinner label="Solving..." onCancel={canCancel ? stopSolving : undefined} />
              : <button className={styles.button} disabled={!validation.isValid} aria-describedby={validation.isValid ? undefined : "config-issues"} onClick={solvePuzzle}>SOLVE</button>}
          </>
        )
      case PAGE_STATUSES.SOLUTION_OUTPUT:
        return (
          <>
            <Solution history={history} />
            <button className={styles.button} onClick={() => backToStart()}>CLOSE</button>
          </>
        )
      case PAGE_STATUSES.SOLUTION_NOT_FOUND:
        return (
          <>
            <h2 className={styles.centeredText}>Solution not found. Check your colors.</h2>
            <button className={styles.button} onClick={() => backToStart()}>BACK</button>
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
