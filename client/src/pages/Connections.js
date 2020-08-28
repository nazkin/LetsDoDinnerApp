import React, {useEffect, useState} from 'react'
import Template from '../components/Template'
import axios from 'axios'
import styles from './styles/connections.module.scss'
import Invitations from '../components/Invitations'
import ConnectList from '../components/ConnectionList'

const Connections = () => {
    const [info, setInfo] = useState({})
    const [loading, setLoading] = useState(false)
    const token = sessionStorage.getItem('auth-token')

    useEffect(()=> {
        setLoading(true)
        axios({
            method: 'GET',
            url: 'http://localhost:8080/api/account/info',
            headers: {
                "auth-token": token
            }
        }).then(res => {
            console.log(res.data);
            setInfo(res.data.account);
            setLoading(false)

        }).catch(err => {
            console.log(err)
            setLoading(false)

        })
    }, [])

    if(loading || !info){
        return(
            <Template>
                <h1>Loading</h1>
            </Template>
        )
    }

    return(
        <Template>
            <div className="row px-5 py-3">
                <div className={styles.titleSecondary}>
                    <p>Likes</p>
                </div>
                    <Invitations type="invitation" likes={info ? info.invitations: null} token={token}/>
            </div>
            <div className="row px-5 py-3">
                <div className={styles.titleSecondary}>
                    <p>Connections</p>
                </div>
                {/* HAS TO BE CHANGED TO REAL CONNECTIONS FROM THE ACCOUNT OBJECTS RIGHT NOW COPY OF LIKES */}
                {/* <ConnectList connects={info.invitations}/> */}
            </div>
            <div className="row px-5 py-3">
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