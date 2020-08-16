import React, {useState, useEffect} from 'react'
import styles from './styles/home.module.scss'
import Template from '../components/Template'
import ActiveUsers from '../components/UI/UserImgList'
import axios from 'axios'

const Home = (props)=> {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [activeAccounts, setActiveAccounts] = useState([])

    const token = sessionStorage.getItem('auth-token')
    
    useEffect(()=> {
        axios({
            method: "GET",
            url: "http://localhost:8080/api/account/recent-users",
            headers: {
                'auth-token': token
            }
        }).then(res => {
            console.log(res.data.accounts)
            setActiveAccounts(res.data.accounts)
        }).catch(err=> console.log(err))
    },[]);

    return(
        <Template>
            <div className="jumbotron m-5 p-5">
               <h1>Start Matching with New People Right Away !!!</h1>
            </div>
            <h1 className={styles.activeUsersTitle}>Recently Active Users</h1>
            <hr />
            <ActiveUsers users={activeAccounts} />
        </Template>
           
     
    )
}

export default Home