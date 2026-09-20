import styles from './state.module.css'
import Tube from './tube'

export default function State({ tubes, numberOfReadOnly, colorSelected, onClick, highlights }) {

    const handleClick = function (index) {
        if (onClick) onClick(index, colorSelected)
    }

    return (
        <div className={styles.container}>
            {tubes.map((el, index) => {
                return (
                    <div key={index} className={styles.tube}>
                        <Tube colors={el} readonly={index >= tubes.length - numberOfReadOnly} onClick={() => handleClick(index)} highlight={highlights && highlights[index]} />
                    </div>
                )
            })}
        </div>
    )

}
