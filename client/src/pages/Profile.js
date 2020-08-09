import React, {useState, useEffect} from 'react'
import axios from 'axios'
import EditAccountForm from '../components/Forms/AccountEditForm'

import Template from '../components/Template'

const Profile = (props) => {
    const [accountInfo, setAccountInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = sessionStorage.getItem('auth-token');


    useEffect(()=>{
        setLoading(true);
        axios({
            method: 'GET',
            url: 'http://localhost:8080/api/account/info',
            headers: {
                'auth-token': token
            }
        }).then(res=> {
            console.log(res.data.account);
            setAccountInfo(res.data.account);
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
        })
        
    },[])


    return(
        <Template>
            <div className={"row"}>
                <div className={"col-lg-6 d-flex justify-content-center align-items-center"}>
                    {/* display the form */}
                   {!accountInfo ? null : <EditAccountForm id={accountInfo._id} nickname={accountInfo.nickname} desc={accountInfo.description} interest={accountInfo.interestedIn} minAge={accountInfo.matchAgeMin} maxAge={accountInfo.matchAgeMax} />}
                </div>
                <div className={"col-lg-6 "}>
                    {/* display the images */}
                </div>
            </div>
        </Template>
    )
}

export default Profile;