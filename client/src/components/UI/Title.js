import React from 'react'
import styles from '../styles/UI/index.module.scss'

const Title = ({title}) => {


    return(
        <div className={styles.title}>
            <p>{title}</p>
        </div>
    )
}
export default Title;