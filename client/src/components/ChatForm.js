import React, {useState} from 'react'
import styles from './styles/compIndex.module.scss'
import axios from 'axios'

const ChatForm = ({chatId, token, sentUpdate})=> {
    const [message, setMessage] = useState('')

    const messageChangeHandler = (e) => {
        setMessage(e.target.value)
    }

    const submitMessageHandler = (e,id = chatId) => {
        e.preventDefault()
        axios({
            method:"POST",
            url:`http://localhost:8080/api/send/message/${id}`,
            data:{
                body: message
            },
            headers:{
                "auth-token": token
            }
        }).then(res => {
            console.log(res)
            sentUpdate()
            setMessage("")
        })
          .catch(err => console.log(err))
    }
    return(
        <div className={"row "+ styles.chatFormRow}>
            <div className="col-md-8">
                <form onSubmit={submitMessageHandler}>
                    <div className="form-group">
                        <input value={message} onChange={messageChangeHandler} type="text" className={"form-control "+styles.chatInput} aria-describedby="message input"/>
                    </div>
                    <button onClick={submitMessageHandler} type="submit" className="btn btn-info">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default ChatForm