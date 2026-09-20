import styles from './spinner.module.css'

export default function Spinner({ label, onCancel }) {
    return (
        <>
            <div className={styles.container} role="status">
                <div className={styles.circle} aria-hidden="true"></div>
                <span>{label}</span>
            </div>
            {onCancel && <button className={styles.cancel} onClick={onCancel}>Cancel</button>}
        </>
    )
}
