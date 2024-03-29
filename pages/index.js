import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react';
import State from '../components/state'
import Solution from '../components/solution'
import Selector from '../components/selector'
import ColorSelector from '../components/colorSelector'
import styles from '../styles/Home.module.css'
import stateLib from '../lib/states'

export default function Home() {
  const PAGE_STATUSES = {
    NUMBER_INPUT: 0,
    COLOR_INPUT: 1,
    SOLUTION_OUTPUT: 2,
    SOLUTION_NOT_FOUND: 3
  }
  const [totalNumber, setTotalNumber] = useState('')
  const [emptyNumber, setEmptyNumber] = useState('')
  const [color, setColor] = useState("black")
  const [tubes, setTubes] = useState([])
  const [history, setHistory] = useState([])
  const [pageStatus, setPageStatus] = useState(PAGE_STATUSES.NUMBER_INPUT)


  const setNumberOfTubes = function (totalNumber, emptyNumber) {
    setTotalNumber(totalNumber)
    setEmptyNumber(emptyNumber)
    const localTubes = []
    for (let i = 0; i < totalNumber; i++) {
      localTubes.push([])
    }
    setTubes(localTubes)
    setPageStatus(PAGE_STATUSES.COLOR_INPUT)
  }

  const handleClick = function (index, color) {
    let tubesCopy = tubes.slice()
    if (color !== "black") {
      if (tubesCopy[index].length < 4) tubesCopy[index].push(color)
    } else {
      tubesCopy[index].pop()
    }
    setTubes(tubesCopy)
  }

  const solvePuzzle = function () {
    let historyLocal = []
    historyLocal.push(tubes)
    stateLib.resolve(historyLocal)
    if (!historyLocal.length) {
      setPageStatus(PAGE_STATUSES.SOLUTION_NOT_FOUND)
    } else {
      setHistory(historyLocal)
      setPageStatus(PAGE_STATUSES.SOLUTION_OUTPUT)
    }
  }

  const backToStart = function () {
    setPageStatus(PAGE_STATUSES.COLOR_INPUT)
  }

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
              <h1>Use colors to fill tubes until they looks like in your puzzle</h1>
            </div>
            <State tubes={tubes} numberOfReadOnly={emptyNumber} colorSelected={color} onClick={handleClick} />
            <ColorSelector colorSelected={color} selectColor={setColor} />
            < button className={styles.button} onClick={solvePuzzle}>SOLVE</button>
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
            <h2 className={styles.centeredText}>Solusion's not found. Check your colors</h2>
            <button className={styles.button} onClick={() => backToStart()}>VOLVER</button>
          </>
        )
    }
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Water Sort Puzzle Solver</title>
        <meta name="description" content="Webapp to solve these tricky puzzles and laught at your friends" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
        <link rel="icon" href="/logo.webp" />
      </Head>

      <main className={styles.main}>
        <PageComponent />
      </main>
    </div>
  )
}
