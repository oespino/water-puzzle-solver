import styles from './colorSelector.module.css'
import colorPalette from '../lib/colors'

export default function ColorSelector({ colorSelected, selectColor, usedColors, canAddNewColor }) {

    const colors = colorPalette.map(color => color.value)
    const isDisabled = color => !canAddNewColor && !usedColors.includes(color)

    return (
        <div className={styles.container}>
            <button className={'black' === colorSelected ? styles.buttonSelected : styles.button} onClick={() => selectColor("black")}>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAZUlEQVRIiWNgGCmggYGB4T8a7iBGIyMWsf8UOgbFTCYKDSMbwIKBYvU09wGxFqC7kGgfDhofjFowasGoBRQAFiLVoRfr2Ip5rGDAgugplEavxXBhZD1EAT8GBoYnJFjwBKpnGAIAUcAmPA1WYN0AAAAASUVORK5CYII=" />
            </button>
            {colors.map((color, index) => {
                return <button key={index} className={color === colorSelected ? styles.buttonSelected : styles.button} style={{ backgroundColor: color }} disabled={isDisabled(color)} onClick={() => selectColor(color)}></button>
            })}
        </div>
    )

}