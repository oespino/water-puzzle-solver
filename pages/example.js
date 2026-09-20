import Head from 'next/head'
import Tube from '../components/tube'
import State from '../components/state'
import Solution from '../components/solution'
import Selector from '../components/selector'
import styles from '../styles/Home.module.css'
import stateLib from '../lib/states'

export default function Home() {

  var tubes = [
    ["1", "2", "3", "4"],
    ["5", "6", "6", "5"],
    ["7", "3", "8", "9"],
    ["8", "4", "1", "10"],
    ["3", "10", "9", "11"],
    ["12", "12", "2", "9"],
    ["8", "3", "11", "4"],
    ["7", "6", "5", "10"],
    ["9", "12", "4", "1"],
    ["11", "7", "1", "8"],
    ["6", "2", "5", "11"],
    ["12", "10", "2", "7"],
    [],
    []
  ];

  let colors = [
    "red",
    "blue",
    "palegreen",
    "rebeccapurple",
    "grey",
    "orange",
    "salmon",
    "maroon",
    "green",
    "lemonchiffon",
    "lightskyblue",
    "yellowgreen"
  ]

  var tubes2 = tubes.map((tube) => {
    return tube.map((number) => colors[number - 1])
  })

  console.log(tubes2)

  let history = [];
  history.push(tubes2)

  let { stackI, stackJ } = stateLib.resolve(history)

  //console.log(history)
  console.log(stackI)
  console.log(stackJ)

  let tubeExample = ['red', 'blue', 'blue', 'blue']
  let stateExample = [
    ['red', 'blue', 'blue', 'blue'],
    ['red', 'green', 'green', 'green'],
    ['green', 'red', 'blue', 'red'],
    [],
    []
  ]
  let stateExample2 = [
    ['red', 'blue', 'blue', 'blue'],
    ['red', 'green', 'green', 'green'],
    ['green', 'red', 'blue'],
    ['red'],
    []
  ]
  let stateExample3 = [
    ['red', 'blue', 'blue', 'blue'],
    ['red'],
    ['green', 'red', 'blue'],
    ['red'],
    ['green', 'green', 'green']
  ]


  let historyExample = [
    stateExample,
    stateExample2,
    stateExample3
  ]

  return (
    <div className={styles.container}>
      <Head>
        <title>Water Sort Puzzle Solver</title>
        <meta name="description" content="Web app to solve these tricky puzzles and laugh at your friends" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <h1>Tube example</h1>
        <Tube colors={tubeExample} />

        <h1>State example</h1>
        <State tubes={stateExample} />

        <h1>Solution example</h1>
        <Solution history={history} />

      </main>
    </div>
  )
}