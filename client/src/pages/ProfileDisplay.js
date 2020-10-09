import React, { useState, useEffect } from 'react'
import Template from '../components/Template'
import styles from './styles/index.module.scss'
import { useParams, useHistory } from 'react-router-dom'
import UsersImages from '../components/UI/ImageRow'
import Title from '../components/UI/Title'
import axios from 'axios'
import yesImg from '../images/yes.png'
import noImg from '../images/no.png'
import { PushSpinner } from "react-spinners-kit";


const ProfileDisplay = () =>{
    let history = useHistory()
    const [account, setAccount] = useState(null)
    const [loading, setLoading] = useState(false)
    const [hasConnection, setHasConnection] = useState(false) //Checks if connection has been established between users
    const [hasInvite, setHasInvite] = useState(false) //Check if either users sent each other an invite
    const [gotInvited, setGotInvited] = useState(false) //Checks who sent the invite
    const [refresh, setRefresh] = useState(false)
    const [ifChat, setIfChat] = useState("") // if a chat exists between users this will be the id

    let { id } = useParams();
    const token = sessionStorage.getItem('auth-token');
    const accountId = id

    useEffect(()=> {
        setLoading(true);
        console.log(id);
       axios({
           method: "GET",
           url: `/api/account/info/${accountId}`,
           headers: {
               "auth-token": token
           }
       }).then(res=>{
           setLoading(false);
           console.log(res);
           setAccount(res.data.account);
           setHasConnection(res.data.hasConnect);
           setHasInvite(res.data.hasInvite);
           setGotInvited(res.data.gotInvited);
           setIfChat(res.data.chat)
       }).catch(err=> {
           setLoading(false);
           console.log(err);
       })
    }, [setAccount,refresh]);

    //Send invite handler

    const inviteConnectionHandler = async () => {
        try {
            const result = await axios({
                method: "POST", 
                url: `/api/send/invitation/${accountId}`,
                headers:{
                    'auth-token': token
                } 
            });
            console.log(result)
           setRefresh(!refresh)
        } catch (error) {
            console.log(error)
        }
        return true;
    }
    let inviteMsg = 'Invitation Sent';
   
    if(gotInvited === 'no'){
        inviteMsg = <h5 >Invitation Sent</h5>
    }else if(gotInvited === 'yes'){
        inviteMsg = <h5 >Invitation Received</h5>
    }

    //When data is being retrieved dont load anything
    if(loading || !account){
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
            <div className="container-fluid">
                <div className={"row " +styles.pdMain}>
                    <div className={"col-lg-5 py-5 px-3  "+ styles.descCol}>
                        <Title title={account.nickname} />
                        <div className={"row py-2 "+ styles.connectionStatus}>
                            <div className={styles.eachStat}>
                                {inviteMsg}
                                {hasInvite || hasConnection ? <img src={yesImg} alt="invitation status between two users" /> : <img src={noImg} alt="invitation status between two users" /> }
                                
                            </div>
                            <div className={styles.eachStat}>
                                <h5>Current Connection</h5>
                                {hasConnection ? <img src={yesImg} alt="Connection status between two users" /> : <img src={noImg} alt="Connection status between two users" /> }
                            </div>
                        </div>
                        <div className={"row py-2 d-flex flex-row justify-content-center "} style={{background: "steelblue"}}>
                            <div>
                                {hasInvite && !hasConnection && gotInvited === 'yes' ? <button onClick={() => history.push("/connections")} className="btn btn-link btn-light">View Invite</button> : null}
                                {hasInvite && !hasConnection && gotInvited === 'no' ? <p style={{color: "linen"}}>Waiting on {account.nickname} to accept your invitation</p> : null}
                            </div>
                            <div>
                                {!hasInvite && !hasConnection ? <button onClick={inviteConnectionHandler} className="btn btn-link btn-light">Invite Connection</button> : null}
                            </div>
                            <div>
                                {hasConnection ? <button onClick={() => history.push(`/message/${ifChat}`)} className="btn btn-light btn-sm">Message</button> : null}
                            </div>
                        </div>
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
                            <p>{account.age}</p>
                        </div>
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