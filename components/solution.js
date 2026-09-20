import styles from './solution.module.css'
import State from './state'
import { useEffect, useMemo, useState } from 'react';

const AUTOPLAY_INTERVAL_MS = 1500

function findMove(before, after) {
    let from = -1
    let to = -1
    for (let i = 0; i < before.length; i++) {
        if (after[i].length < before[i].length) from = i
        else if (after[i].length > before[i].length) to = i
    }
    return { from, to }
}

export default function Solution({ history }) {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [playing, setPlaying] = useState(false);

    const lastIndex = history.length - 1
    const isPlaying = playing && currentIndex < lastIndex

    const moves = useMemo(
        () => history.slice(1).map((state, i) => findMove(history[i], state)),
        [history]
    )
    const nextMove = moves[currentIndex]
    const highlights = nextMove ? { [nextMove.from]: 'from', [nextMove.to]: 'to' } : undefined

    useEffect(() => {
        if (!isPlaying) return
        const timer = setTimeout(() => setCurrentIndex(index => index + 1), AUTOPLAY_INTERVAL_MS)
        return () => clearTimeout(timer)
    }, [isPlaying, currentIndex])

    const step = function (increment) {
        setPlaying(false)
        setCurrentIndex(currentIndex + increment)
    }

    const togglePlay = function () {
        if (isPlaying) {
            setPlaying(false)
            return
        }
        if (currentIndex >= lastIndex) setCurrentIndex(0)
        setPlaying(true)
    }

    let caption
    if (lastIndex === 0) caption = 'Already solved'
    else if (nextMove) caption = `Move ${currentIndex + 1} of ${lastIndex}: pour tube ${nextMove.from + 1} into tube ${nextMove.to + 1}`
    else caption = `Solved in ${lastIndex} moves`

    return (
        <div className={styles.container}>
            <p className={styles.caption} aria-live="polite">{caption}</p>
            <State tubes={history[currentIndex]} highlights={highlights} />
            <div className={styles.buttonsContainer}>
                <button className={styles.button} aria-label="Previous move" disabled={currentIndex === 0} onClick={() => step(-1)}>{'<'}</button>
                <button className={styles.button} aria-label={isPlaying ? 'Pause' : 'Play'} disabled={lastIndex === 0} onClick={togglePlay}>{isPlaying ? '❚❚' : '▶︎'}</button>
                <button className={styles.button} aria-label="Next move" disabled={currentIndex === lastIndex} onClick={() => step(1)}>{'>'}</button>
            </div>
        </div>
    )

}
