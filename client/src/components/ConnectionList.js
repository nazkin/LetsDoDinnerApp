import React from 'react'
import styles from './styles/core/compIndex.module.scss'
import {useHistory} from 'react-router-dom'
import connectIcon from '../images/connection.png'

const ConnectionList = ({connects, chats, viewAccount}) => {
    let history = useHistory();

    const goToChatHandler = (id) => {
        history.push(`/message/${id}`)
    }

    let connectList = (
            <div className={"row d-flex justify-content-evenly align-items-center py-1 px-1 " +styles.placeholderBox}>
                <img src={connectIcon} alt="no invitations placeholder icon" className={styles.placeholderIcon}/>
                <h1>No connections available</h1>
            </div>
    );
    if(connects && connects.length > 0){
        connectList = connects.map(con => {
            let hasChat = null;
            chats.forEach(chat => {
                if(chat.users.includes(con._id)){
                    hasChat = chat._id
                }
            })
            return(
                <div key={hasChat} className={styles.connectImgDiv}>
                    <img onClick={()=> goToChatHandler(hasChat)} src={con.avatar} className={styles.connectAvatar} alt="avatar of connection" />
                    <p>{con.nickname}</p>
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