import React, {useState, useEffect} from 'react'
import Template from '../components/Template'
import {useParams} from 'react-router-dom'
import UsersImages from '../components/UI/ImageRow'
import Title from '../components/UI/Title'
import axios from 'axios'

const ProfileDisplay = () =>{
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(false);

    let { id } = useParams();
    const token = sessionStorage.getItem('auth-token');
    const accountId = id
    useEffect(()=> {
        setLoading(true);
        console.log(id);
       axios({
           method: "GET",
           url: `http://localhost:8080/api/account/info/${accountId}`,
           headers: {
               "auth-token": token
           }
       }).then(res=>{
           setLoading(false);
           console.log(res);
           setAccount(res.data.account);
       }).catch(err=> {
           setLoading(false);
           console.log(err);
       })
    }, []);

    //Send invite handler

    const inviteConnectionHandler = async () => {
        try {
            const result = await axios({
                method: "POST", 
                url: `http://localhost:8080/api/send/invitation/${accountId}`,
                headers:{
                    'auth-token': token
                } 
            });
            console.log(result)
        } catch (error) {
            console.log(error)
        }
        return true;
    }

    //When data is being retrieved dont load anything
    if(loading || !account){
        return(
            <Template />
        )
    }

    return(
        <Template>
            <div className="container-fluid">
                <div className="row p-5">
                    <div className="col-md-4">
                        <Title title={account.nickname} />
                        <button onClick={inviteConnectionHandler} className="btn btn-danger mx-5 my-5">Invite Connection</button>
                    </div>
                    <div className="col-md-8">
                        <UsersImages images={account.images}/>
                    </div>
                </div>
            </div>     
        </Template>
    )
}

export default ProfileDisplay