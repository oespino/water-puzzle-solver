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
    }
}
