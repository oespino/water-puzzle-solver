import { useState } from 'react';
import styles from './selector.module.css'

export default function Selector({ onClick }) {

    const [totalNumber, setTotalNumber] = useState('')
    const [emptyNumber, setEmptyNumber] = useState('')

    const handleClick = function () {
        onClick(totalNumber, emptyNumber)
    }

    return (
        <div>
            <span>How many tubes do you have in total?</span>
            <input type='text' className={styles.input} onChange={event => setTotalNumber(event.target.value)} ></input>
            <br />
            <span>How many empty tubes do you have?</span>
            <input type='text' className={styles.input} onChange={event => setEmptyNumber(event.target.value)}></input>
            <br />
            <div className={styles.buttonContainer}>
                <button className={styles.button} disabled={!totalNumber || !emptyNumber} onClick={() => handleClick()}>GO</button>
            </div>
        </div>
    )

}