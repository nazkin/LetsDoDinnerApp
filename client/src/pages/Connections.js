import React, {useEffect, useState} from 'react'
import Template from '../components/Template'
import axios from 'axios'
import styles from './styles/connections.module.scss'
import Invitations from '../components/Invitations'
const Connections = () => {
    const [info, setInfo] = useState({})
    const token = sessionStorage.getItem('auth-token')

    useEffect(()=> {
        axios({
            method: 'GET',
            url: 'http://localhost:8080/api/account/info',
            headers: {
                "auth-token": token
            }
        }).then(res => {
            console.log(res)
            setInfo(res.data)
        }).catch(err => console.log(err))
    }, [])

    return(
        <Template>
            <div className="row p-5">
                <div className={styles.titleSecondary}>
                    <p>Likes</p>
                </div>
                <div className="col-12">
                    <Invitations />
                </div>
            </div>
            <div className="row p-5">
                <div className={styles.titleSecondary}>
                    <p>Connections</p>
                </div>
                <div className="col-12">
                    
                </div>
            </div>
            <div className="row p-5">
                <div className={styles.titleSecondary}>
                    <p>Conversations</p>
                </div>
                <div className="col-md-12">
                    
                </div>
            </div>
         
        </Template>
    )
}

export default Connections;