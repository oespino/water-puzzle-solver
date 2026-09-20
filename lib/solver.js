import { TUBE_CAPACITY } from './states'

const MAX_NODES = 100000

// Tubes are handled as strings (one character per unit, bottom to top) so states are cheap to copy and compare.

function topRunLength(tube) {
    const color = tube[tube.length - 1]
    let length = 1
    while (length < tube.length && tube[tube.length - 1 - length] === color) length++
    return length
}

function countRuns(state) {
    let runs = 0
    for (const tube of state) {
        let previous = ''
        for (const unit of tube) {
            if (unit !== previous) {
                runs++
                previous = unit
            }
        }
    }
    return runs
}

function isSolved(state) {
    return state.every(tube => !tube.length || (tube.length === TUBE_CAPACITY && topRunLength(tube) === TUBE_CAPACITY))
}

// Tube order does not matter for solvability, so equivalent states share a key
function stateKey(state) {
    return state.slice().sort().join('|')
}

// Legal moves, best first: fewer color runs means closer to solved, and merging onto a filled tube beats using an empty one
function nextMoves(state) {
    const moves = []
    for (let from = 0; from < state.length; from++) {
        const source = state[from]
        if (!source.length) continue
        const run = topRunLength(source)
        const color = source[source.length - 1]
        for (let to = 0; to < state.length; to++) {
            const target = state[to]
            if (to === from || target.length + run > TUBE_CAPACITY) continue
            if (target.length && target[target.length - 1] !== color) continue
            // Moving a whole tube onto an empty one changes nothing
            if (!target.length && run === source.length) continue
            const next = state.slice()
            next[from] = source.slice(0, source.length - run)
            next[to] = target + color.repeat(run)
            moves.push({ state: next, from, to, runs: countRuns(next), toEmpty: !target.length })
        }
    }
    // The search takes moves from the end of the list, so the best move goes last
    return moves.sort((a, b) => (b.runs - a.runs) || (b.toEmpty - a.toEmpty))
}

// Depth-first search that never visits the same state twice.
// Returns { status: 'solved' | 'not-found' | 'gave-up', history }, where history holds every state from the start to the solved one.
export function solve(tubes, maxNodes = MAX_NODES) {
    const colors = [...new Set(tubes.flat())]
    const symbolOf = new Map(colors.map((color, index) => [color, String.fromCharCode(48 + index)]))
    const start = tubes.map(tube => tube.map(color => symbolOf.get(color)).join(''))

    const toHistory = (states) => states.map(state => state.map(tube => [...tube].map(symbol => colors[symbol.charCodeAt(0) - 48])))

    if (isSolved(start)) return { status: 'solved', history: toHistory([start]) }

    const visited = new Set([stateKey(start)])
    const path = [start]
    const frames = [nextMoves(start)]
    let nodes = 0

    while (frames.length) {
        const move = frames[frames.length - 1].pop()
        if (!move) {
            frames.pop()
            path.pop()
            continue
        }
        const key = stateKey(move.state)
        if (visited.has(key)) continue
        visited.add(key)
        if (++nodes > maxNodes) return { status: 'gave-up', history: [] }
        path.push(move.state)
        if (isSolved(move.state)) return { status: 'solved', history: toHistory(path) }
        frames.push(nextMoves(move.state))
    }

    return { status: 'not-found', history: [] }
}
