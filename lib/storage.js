import colorPalette from './colors'
import { TOOLS } from './tools'
import { TUBE_CAPACITY } from './states'

// Persistence is best effort: storage can be unavailable or full (private mode, blocked cookies)
const STORAGE_KEY = 'water-puzzle-solver:puzzle'
const VERSION = 1
const PALETTE_COLORS = colorPalette.map(color => color.value)
const TOOL_IDS = Object.values(TOOLS)

function isValidPuzzle(data) {
    if (!data || data.version !== VERSION) return false
    const { screen, total, empty, tubes, selection } = data
    if (screen !== 'config' && screen !== 'colors') return false
    if (!Number.isInteger(total) || !Number.isInteger(empty)) return false
    if (total < 2 || empty < 1 || empty >= total || total - empty > PALETTE_COLORS.length) return false
    if (!TOOL_IDS.includes(selection) && !PALETTE_COLORS.includes(selection)) return false
    if (!Array.isArray(tubes) || (tubes.length !== 0 && tubes.length !== total)) return false
    if (screen === 'colors' && tubes.length !== total) return false
    const areTubesValid = tubes.every(tube => Array.isArray(tube) && tube.length <= TUBE_CAPACITY && tube.every(color => PALETTE_COLORS.includes(color)))
    return areTubesValid && tubes.slice(total - empty).every(tube => !tube.length)
}

export function loadPuzzle() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (!raw) return null
        const data = JSON.parse(raw)
        return isValidPuzzle(data) ? data : null
    } catch {
        return null
    }
}

export function savePuzzle(puzzle) {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, ...puzzle }))
    } catch { }
}

export function clearPuzzle() {
    try {
        window.localStorage.removeItem(STORAGE_KEY)
    } catch { }
}
