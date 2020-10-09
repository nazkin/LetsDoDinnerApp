import React from 'react'
import styles from './styles/core/compIndex.module.scss'
import ScrollToBottom from 'react-scroll-to-bottom'
import { useHistory } from 'react-router-dom'
 
const ChatDisplay = ({ chatData, currentUser }) => {
    let history = useHistory()

    let messageDisplay = null;
    if(chatData){
        let userA = chatData.users[0].userId
        if(chatData.users[1].userId.toString() === currentUser.toString()){
            userA= chatData.users[1].userId
        }
       

        messageDisplay = chatData.messages.map((msg, i) =>{
            const dat = msg.date.toString().substring(0,10)
            const time = msg.date.toString().substring(11,16)

            if(i < chatData.messages.length - 20){
                return
            }
            if(msg.sentBy === userA){
                return (<div className={styles.userAmsg}>
                            <p>{msg.body}</p>
                        <h6>{dat} @ {time}</h6>
                        </div>
                        )
            }else{
                return (<div  className={styles.userBmsg}>
                            <p>{msg.body }</p>
                            <h6>{dat} @ {time}</h6>
                        </div>)
            }
        })
    }
    const viewUserHandler = (id) => {
        history.push(`/account/${id}`)
    }
    
    let avatars = (
        <div className={styles.chatUserImages}>
            <div onClick={() => history.push('/profile')}>
                <img src={chatData.users[0].avatar} alt="First user image" className={styles.chatDisplayImg} />
            </div>
            <div onClick={() => viewUserHandler(chatData.users[1]._id)}>
                <img src={chatData.users[1].avatar} alt="Second user image" className={styles.chatDisplayImg} />
            </div>
        </div>
    )
    if(chatData.users[1].userId.toString() === currentUser.toString()){
        avatars = (
            <div className={styles.chatUserImages}>
                <div onClick={() => history.push('/profile')}>
                    <img src={chatData.users[1].avatar} alt="Second user image" className={styles.chatDisplayImg} />
                </div>
                <div onClick={() => viewUserHandler(chatData.users[0]._id)}>
                    <img src={chatData.users[0].avatar} alt="First user image" className={styles.chatDisplayImg} />
                </div>
            </div> 
        )
    }

    return(
        <div className={"row "+styles.chatDisplayRow}>
            <div className={"col-md-8 p-0 " + styles.chatDisplayCol}>
                {avatars}
                <ScrollToBottom  className={styles.chatBox}>
                    {messageDisplay}
                </ScrollToBottom>      
            </div>
            
        </div>
    )
}

export default ChatDisplay