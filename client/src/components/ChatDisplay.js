import React from 'react'
import styles from './styles/compIndex.module.scss'

const ChatDisplay = ({chatData}) => {
    let messageDisplay = null;
    if(chatData){
        const userA = chatData.users[0].userId
       

        messageDisplay = chatData.messages.map((msg, i) =>{

            if(i < chatData.messages.length - 10){
                return
            }
            if(msg.sentBy === userA){
                return <div className={styles.userAmsg}><p >{" >>> "+msg.body}</p></div>
            }else{
                return <div  className={styles.userBmsg}><p>{" >>> "+msg.body }</p></div>
            }
        })
    }

    return(
        <div className={"row "+styles.chatDisplayRow}>
            <div className={"col-md-8 " + styles.chatDisplayCol}>
                <div className={styles.chatUserImages}>
                    <img src={chatData.users[0].avatar} alt="First user image" className={styles.chatDisplayImg} />
                    <img src={chatData.users[1].avatar} alt="Second user image" className={styles.chatDisplayImg} />
                </div>
                {messageDisplay}
            </div>
            
        </div>
    )
}

export default ChatDisplay