import React from 'react'
import styles from './styles/compIndex.module.scss'
import {useHistory} from 'react-router-dom'

const ConnectionList = ({connects, chats}) => {
    let history = useHistory();

    const goToChatHandler = (id) => {
        history.push(`/message/${id}`)
    }

    let connectList = (
            <div className="row px-5">
                <h1>No connections. Start searching</h1>
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
                    <img src={con.avatar} className={styles.connectAvatar} alt="avatar of connection" />
                    {hasChat ? <button onClick={()=> goToChatHandler(hasChat)} className="btn btn-link">Message</button> : null}       
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