import styles from './tube.module.css'
import { TUBE_CAPACITY } from '../lib/states'

export default function Tube({ colors, readonly, onClick, highlight }) {

    const cells = Array.from({ length: TUBE_CAPACITY }, (_, index) => colors[index])

    const handleClick = function () {
        if (!readonly) onClick();
    }

    return (
        <div className={highlight ? `${styles.tube} ${styles[highlight]}` : styles.tube}>
            {cells.map((color, index) => {
                return <div key={index} className={index ? styles.middle : styles.bottom} style={{ backgroundColor: color || 'transparent' }} onClick={() => handleClick()}></div>
            })}
            <div className={styles.top}></div>
            {highlight && <span className={styles.badge}>{highlight}</span>}
        </div>
    )
}
