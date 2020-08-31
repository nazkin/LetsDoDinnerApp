import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import Template from '../components/Template'
import Display from '../components/ChatDisplay'
import MessageInput from '../components/ChatForm'

const Messages = () => {
    const [loading, setLoading] = useState(false)
    const [chatData, setChatData] = useState(null)
    const [sent, setSent] = useState(false)
    const token = sessionStorage.getItem('auth-token');

    let {id} = useParams();
    const chatId = id;
    useEffect(()=> {
        axios({
            method:'GET',
            url: `http://localhost:8080/api/send/chatdata/${chatId}`,
            headers: {
                'auth-token': token
            }
        }).then(res => {
            console.log(res)
            setChatData(res.data.info);
        }).catch(err => {
            console.log(err)
        })
    }, [sent])

    const messageSentUpdate = () => {
        setSent(prev => !prev)
    }
    if(!chatData){
        return(
            <Template>

            </Template>
        )
    }

    return(
        <Template>
            <Display chatData={chatData} />
            <MessageInput sentUpdate={messageSentUpdate} chatId={chatId} token={token} />
        </Template>
    )
}

export default Messages;