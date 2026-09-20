import { solve } from './solver'

self.onmessage = (event) => {
    self.postMessage(solve(event.data))
}
