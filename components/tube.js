import styles from './tube.module.css'

export default function Tube({ colors, readonly, onClick, highlight }) {

    const emptyTube = [null, null, null, null]
    const filledTube = emptyTube.map((el, index) => colors[index])

    const handleCick = function () {
        if (!readonly) onClick();
    }

    return (
        <div className={highlight ? `${styles.tube} ${styles[highlight]}` : styles.tube}>
            {filledTube.map((el, index) => {
                return <div key={index} className={index ? styles.middle : styles.bottom} style={{ backgroundColor: el || 'transparent' }} onClick={() => handleCick()}></div>
            })}
            <div className={styles.top}></div>
            {highlight && <span className={styles.badge}>{highlight}</span>}
        </div>
    )
}
