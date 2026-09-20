import styles from './spinner.module.css'

export default function Spinner({ label }) {
    return (
        <div className={styles.container} role="status">
            <div className={styles.circle} aria-hidden="true"></div>
            <span>{label}</span>
        </div>
    )
}
