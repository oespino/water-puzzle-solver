import styles from './configIssues.module.css'
import colorPalette from '../lib/colors'
import { TUBE_CAPACITY } from '../lib/states'

const TUBE_LIST_LIMIT = 4

const paletteIndex = (color) => colorPalette.findIndex(entry => entry.value === color)

export default function ConfigIssues({ id, wrongColors, incompleteTubes }) {

    const sortedColors = [...wrongColors].sort((a, b) => paletteIndex(a.color) - paletteIndex(b.color))

    const tubesMessage = incompleteTubes.length <= TUBE_LIST_LIMIT
        ? `Not full yet: ${incompleteTubes.length === 1 ? 'tube' : 'tubes'} ${incompleteTubes.map(index => index + 1).join(', ')}`
        : `${incompleteTubes.length} tubes are not full yet`

    return (
        <div id={id} className={styles.container}>
            {sortedColors.length > 0 && (
                <>
                    <p className={styles.text}>Each color needs exactly {TUBE_CAPACITY} units. Check these colors:</p>
                    <ul className={styles.chips}>
                        {sortedColors.map(({ color, count }) => (
                            <li key={color} className={styles.chip}>
                                <span className={styles.swatch} style={{ backgroundColor: color }}></span>
                                {colorPalette[paletteIndex(color)]?.name ?? color}: {count} of {TUBE_CAPACITY}
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {incompleteTubes.length > 0 && <p className={styles.text}>{tubesMessage}</p>}
        </div>
    )

}
