import { useId, useState } from 'react';
import styles from './selector.module.css'
import colorPalette from '../lib/colors'

const MIN_TOTAL = 2
const MIN_EMPTY = 1
const MAX_FILLED = colorPalette.length

const parse = (text) => text === '' ? null : Number(text)

function validate(totalText, emptyText) {
    const total = parse(totalText)
    const empty = parse(emptyText)
    const errors = {}

    if (total !== null) {
        if (!Number.isInteger(total)) errors.total = 'Enter a whole number.'
        else if (total < MIN_TOTAL) errors.total = `You need at least ${MIN_TOTAL} tubes.`
    }

    if (empty !== null) {
        if (!Number.isInteger(empty)) errors.empty = 'Enter a whole number.'
        else if (empty < MIN_EMPTY) errors.empty = `You need at least ${MIN_EMPTY} empty tube.`
        else if (total !== null && !errors.total) {
            if (empty >= total) errors.empty = 'Empty tubes must be fewer than the total number of tubes.'
            else if (total - empty > MAX_FILLED) errors.empty = `This solver supports up to ${MAX_FILLED} colors, so at most ${MAX_FILLED} tubes can hold colors.`
        }
    }

    const isValid = total !== null && empty !== null && !errors.total && !errors.empty
    return { total, empty, errors, isValid }
}

export default function Selector({ onClick, initialTotal = '', initialEmpty = '' }) {

    const [totalText, setTotalText] = useState(String(initialTotal))
    const [emptyText, setEmptyText] = useState(String(initialEmpty))
    const baseId = useId()

    const { total, empty, errors, isValid } = validate(totalText, emptyText)

    const totalId = `${baseId}-total`
    const emptyId = `${baseId}-empty`
    const totalErrorId = `${baseId}-total-error`
    const emptyErrorId = `${baseId}-empty-error`

    const maxTotal = Number.isInteger(empty) && empty >= MIN_EMPTY ? MAX_FILLED + empty : undefined
    const maxEmpty = total !== null && !errors.total ? total - 1 : undefined

    return (
        <div>
            <div className={styles.field}>
                <label htmlFor={totalId}>How many tubes do you have in total?</label>
                <input id={totalId} type='number' min={MIN_TOTAL} max={maxTotal} step={1}
                    className={errors.total ? styles.inputInvalid : styles.input}
                    value={totalText} onChange={event => setTotalText(event.target.value)}
                    aria-invalid={!!errors.total} aria-describedby={errors.total ? totalErrorId : undefined} />
            </div>
            {errors.total && <p id={totalErrorId} className={styles.error}>{errors.total}</p>}

            <div className={styles.field}>
                <label htmlFor={emptyId}>How many empty tubes do you have?</label>
                <input id={emptyId} type='number' min={MIN_EMPTY} max={maxEmpty} step={1}
                    className={errors.empty ? styles.inputInvalid : styles.input}
                    value={emptyText} onChange={event => setEmptyText(event.target.value)}
                    aria-invalid={!!errors.empty} aria-describedby={errors.empty ? emptyErrorId : undefined} />
            </div>
            {errors.empty && <p id={emptyErrorId} className={styles.error}>{errors.empty}</p>}

            <div className={styles.buttonContainer}>
                <button className={styles.button} disabled={!isValid} onClick={() => onClick(total, empty)}>GO</button>
            </div>
        </div>
    )

}
