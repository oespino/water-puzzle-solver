import stateLib from './states'

self.onmessage = (event) => {
    const history = [event.data]
    stateLib.resolve(history)
    self.postMessage(history)
}
