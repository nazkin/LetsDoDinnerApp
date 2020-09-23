import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import Template from '../components/Template'
import Display from '../components/ChatDisplay'
import MessageInput from '../components/ChatForm'
import Title from '../components/UI/Title'
import { PushSpinner } from "react-spinners-kit";   

const Messages = () => {
    const [loading, setLoading] = useState(false)
    const [chatData, setChatData] = useState(null)
    const [sent, setSent] = useState(false)
    const token = sessionStorage.getItem('auth-token');

    let {id} = useParams();
    const chatId = id;

    const getChat = () => {
        
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
    }
    useEffect(()=> {
        const interval = setInterval(()=> {
           getChat()
        }, 1000);
        return () => clearInterval(interval)
    }, [sent])

    const messageSentUpdate = () => {
        setSent(prev => !prev)
    }

    if(!chatData){
        return(
            <Template>
                <div className={"container "} style={{minHeight: "50em", paddingTop: "24em", paddingLeft: "25%"}}>
                    <PushSpinner size={80} color="#bc4e4e" loading={true} />
                </div>   
            </Template>
        )
    }

    const title = `${chatData.users[0].nickname} <3 <3 <3 ${chatData.users[1].nickname}`
    return(
        <Template>
            <div className={"row p-5"}>
                <Title title={title} />
            </div>
            <Display chatData={chatData} />
            <MessageInput sentUpdate={messageSentUpdate} chatId={chatId} token={token} />
        </Template>
    )
}

export default Messages;