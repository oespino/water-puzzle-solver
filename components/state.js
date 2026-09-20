import styles from './state.module.css'
import Tube from './tube'

const MAX_TUBES_PER_ROW = 7

function splitIntoRows(count) {
    const rowCount = Math.ceil(count / MAX_TUBES_PER_ROW)
    const rows = []
    let start = 0
    for (let row = 0; row < rowCount; row++) {
        const size = Math.floor(count / rowCount) + (row < count % rowCount ? 1 : 0)
        rows.push({ start, size })
        start += size
    }
    return rows
}

export default function State({ tubes, numberOfReadOnly, colorSelected, onClick, highlights }) {

    const handleClick = function (index) {
        if (onClick) onClick(index, colorSelected)
    }

    const rows = splitIntoRows(tubes.length)
    const columns = rows.length ? rows[0].size : 1

    return (
        <div className={styles.container} style={{ '--columns': columns }}>
            {rows.map(({ start, size }) => (
                <div key={start} className={styles.row}>
                    {tubes.slice(start, start + size).map((el, offset) => {
                        const index = start + offset
                        return (
                            <div key={index} className={styles.tube}>
                                <Tube colors={el} readonly={index >= tubes.length - numberOfReadOnly} onClick={() => handleClick(index)} highlight={highlights && highlights[index]} />
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
    )

}
