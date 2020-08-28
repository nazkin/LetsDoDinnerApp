import React, {useEffect, useState} from 'react'
import styles from './styles/compIndex.module.scss'

const ConnectionList = ({connects}) => {


    let connectList = null;
    if(connects){
        connectList = connects.map(con => {
            return(
                <div>
                    <img src={con.avatar} className={styles.connectAvatar} alt="avatar of connection" />        
                </div>
                 
                 )
        })
    }
    return(
        <div className={"col-12 "+ styles.connectBox}>
           {connectList}
        </div>
    )
}

export default ConnectionList