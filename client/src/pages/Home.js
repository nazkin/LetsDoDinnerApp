import React, {useState, useEffect} from 'react'
import styles from './styles/index.module.scss'
import Template from '../components/Template'
import ActiveUsers from '../components/UI/UserImgList'
import Title from '../components/UI/Title'
import axios from 'axios'
import loveBirdsImg from '../images/lovebirds.png'
import { PushSpinner } from "react-spinners-kit";

const Home = (props)=> {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [activeAccounts, setActiveAccounts] = useState([])

    const token = sessionStorage.getItem('auth-token')
    
    useEffect(()=> {
        setLoading(true)
        axios({
            method: "GET",
            url: "/api/account/recent-users",
            headers: {
                'auth-token': token
            }
        }).then(res => {
            console.log(res.data.accounts)
            setActiveAccounts(res.data.accounts)
            setLoading(false)
        }).catch(err=> {
            console.log(err)
            setLoading(false)
        })
    },[]);

    if(loading){
        return(
            <Template>
                <div className={"container "} style={{minHeight: "50em", paddingTop: "24em", paddingLeft: "25%"}}>
                    <PushSpinner size={80} color="#bc4e4e" loading={loading} />
                </div> 
            </Template>
        )
    }

    return(
        <Template>
            <div className={"row m-5 p-5 "+ styles.heroContainer}>
               <div className={"col-md-7 text-center "+ styles.heroText}>
                    <h1>A <span>simple</span> app for those who <span>simply</span> want to find a match</h1>
                    <h3>Start matching now</h3>
               </div>
               <div className="col-md-5">
                   <img className={styles.loveImg} src={loveBirdsImg} alt="lovebirds home image" />
               </div>
            </div>
            <Title title="Recently Active Users" />
            <hr />
            <ActiveUsers users={activeAccounts} />
        </Template>
           
     
    )
}

export default Home