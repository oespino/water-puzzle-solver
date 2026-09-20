import tubeLib from './tubes'

export const TUBE_CAPACITY = 4

export default {
    validateConfiguration(tubes, numberOfEmpty) {
        const colorCounts = {}
        tubes.forEach((tube) => {
            tube.forEach((color) => {
                colorCounts[color] = (colorCounts[color] || 0) + 1
            })
        })
        const wrongColors = Object.entries(colorCounts)
            .filter(([, count]) => count !== TUBE_CAPACITY)
            .map(([color, count]) => ({ color, count }))

        const numberOfFilled = tubes.length - Number(numberOfEmpty)
        const incompleteTubes = []
        tubes.forEach((tube, index) => {
            if (index < numberOfFilled && tube.length !== TUBE_CAPACITY) incompleteTubes.push(index)
        })

        const usedColors = Object.keys(colorCounts)

        return {
            isValid: !wrongColors.length && !incompleteTubes.length,
            wrongColors,
            incompleteTubes,
            usedColors,
            numberOfColors: numberOfFilled,
            canAddNewColor: usedColors.length < numberOfFilled
        }
    },
    deepCopy(state) {
        let copy = []
        state.forEach((el) => {
            let tube = [...el];
            copy.push(tube);
        });
        return copy
    },
    isFinalState(state) {
        if (!state) return false
        for (let el of state) {
            if (!tubeLib.isFinalStateTube(el)) return false
        }
        return true
    },
    isStateRepeated(history, state) {
        for (let stateInHistory of history) {
            let statesAreEqual = true
            for (let i = 0; i < stateInHistory.length; i++) {
                if (stateInHistory[i].length === state[i].length) {
                    for (let j = 0; j < stateInHistory[i].length; j++) {
                        if (stateInHistory[i][j] !== state[i][j]) {
                            statesAreEqual = false
                            break
                        }
                    }
                } else {
                    statesAreEqual = false
                    break
                }
            }
            if (statesAreEqual) return true
        }
        return false
    },
    resolve(history) {
        let counterOfSteps = 0;
        let stackI = []
        let stackJ = []
        let startI = 0
        let startJ = 0
        while (!this.isFinalState(history[history.length - 1])) {
            if (history.length === 0) break
            counterOfSteps++
            if (counterOfSteps > 100000) break
            let goNextStep = false
            if (!history.length) {
                break
            }
            let state = history[history.length - 1]

            for (let i = startI; i < state.length; i++) {
                for (let j = startJ; j < state.length; j++) {
                    let currentState = this.deepCopy(state)
                    let elOri = currentState[i]
                    let elTarg = currentState[j]
                    if (tubeLib.moveTube(elOri, elTarg)) {
                        if (!this.isStateRepeated(history, currentState)) {
                            history.push(currentState);
                            stackI.push(i)
                            stackJ.push(j)
                            goNextStep = true;
                            break
                        }
                    }
                };
                startJ = 0
                if (goNextStep) break
            };
            if (!goNextStep) {
                history.pop()
                startI = stackI.pop()
                startJ = stackJ.pop() + 1
            } else {
                startI = 0
                startJ = 0
            }
        }
        return { stackI, stackJ }
    }
}