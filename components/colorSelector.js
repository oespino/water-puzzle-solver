import styles from './colorSelector.module.css'
import colorPalette from '../lib/colors'
import { TOOLS } from '../lib/tools'
import { UndoIcon, DropperIcon, EmptyTubeIcon } from './icons'

const TOOL_BUTTONS = [
    { tool: TOOLS.REMOVE, label: 'Remove one color from a tube', Icon: DropperIcon },
    { tool: TOOLS.EMPTY, label: 'Empty a tube', Icon: EmptyTubeIcon }
]

export default function ColorSelector({ colorSelected, selectColor, usedColors, canAddNewColor, canUndo, onUndo }) {

    const colors = colorPalette.map(color => color.value)
    const isDisabled = color => !canAddNewColor && !usedColors.includes(color)

    return (
        <div className={styles.container}>
            <div className={styles.tools}>
                <button className={`${styles.button} ${styles.undo}`} disabled={!canUndo} onClick={onUndo} aria-label="Undo last change" title="Undo last change">
                    <UndoIcon />
                </button>
                {TOOL_BUTTONS.map(({ tool, label, Icon }) => (
                    <button key={tool} className={tool === colorSelected ? styles.buttonSelected : styles.button} aria-label={label} title={label} aria-pressed={tool === colorSelected} onClick={() => selectColor(tool)}>
                        <Icon />
                    </button>
                ))}
            </div>
            {colors.map((color, index) => {
                return <button key={index} className={color === colorSelected ? styles.buttonSelected : styles.button} style={{ backgroundColor: color }} disabled={isDisabled(color)} onClick={() => selectColor(color)}></button>
            })}
        </div>
    )

}
