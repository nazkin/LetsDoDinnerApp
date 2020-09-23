import React, {useState, useEffect} from 'react'
import Template from '../components/Template'
import styles from './styles/index.module.scss'
import {useParams} from 'react-router-dom'
import UsersImages from '../components/UI/ImageRow'
import Title from '../components/UI/Title'
import axios from 'axios'

const calcBirthday = (dateString) => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

const ProfileDisplay = () =>{
    const [account, setAccount] = useState(null)
    const [loading, setLoading] = useState(false)
    const [hasConnection, setHasConnection] = useState(false) //Checks if the user already sent an invite or established a connection with the user

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
           setHasConnection(res.data.hasConnect);
       }).catch(err=> {
           setLoading(false);
           console.log(err);
       })
    }, [setAccount]);

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
            setHasConnection(true)
        } catch (error) {
            console.log(error)
        }
        return true;
    }

    //When data is being retrieved dont load anything
    if(loading || !account){
        return(
            <Template>
                <h1>Loading...</h1>
            </Template>
        )
    }

    return(
        <Template>
            <div className="container-fluid">
                <div className={"row p-3 " +styles.pdMain}>
                    <div className={"col-lg-5 "+ styles.descCol}>
                        <Title title={account.nickname} />
                        <div className={""+styles.descriptor}>
                            <h4>Description</h4>
                            <p>{account.description}</p>
                        </div>
                        <div className={""+styles.descriptor}>
                            <h4>Gender</h4>
                            <p>{account.gender}</p>
                        </div>
                        <div className={""+styles.descriptor}>
                            <h4>Location</h4>
                            <p>{account.city} {account.region}, {account.country}</p>
                        </div>
                        <div className={""+styles.descriptor}>
                            <h4>Age</h4>
                            <p>{calcBirthday(account.dob)}</p>
                        </div>
                        {!hasConnection ? <button onClick={inviteConnectionHandler} className="btn btn-danger mx-5 my-5">Invite Connection</button> : null}
                    </div>
                    <div className="col-lg-7">
                        <UsersImages images={account.images}/>
                    </div>
                </div>
            </div>     
        </Template>
    )
}

export default ProfileDisplay