import React, {useState, useEffect} from 'react'
import Template from '../components/Template'
import ActiveUsers from '../components/UI/UserImgList'
import Title from '../components/UI/Title'
import axios from 'axios'

const Home = (props)=> {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [activeAccounts, setActiveAccounts] = useState([])

    const token = sessionStorage.getItem('auth-token')
    
    useEffect(()=> {
        setLoading(true)
        axios({
            method: "GET",
            url: "http://localhost:8080/api/account/recent-users",
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
                <h1>Loading...</h1>
            </Template>
        )
    }

    return(
        <Template>
            <div className="jumbotron m-5 p-5">
               <h1>Start Matching with New People Right Away !!!</h1>
            </div>
            <Title title="Recently Active Users" />
            <hr />
            <ActiveUsers users={activeAccounts} />
        </Template>
           
     
    )
}

export default Home