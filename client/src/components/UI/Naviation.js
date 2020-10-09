import React, {useEffect, useState} from 'react';
import {NavLink, useHistory} from 'react-router-dom';
import styles from "../styles/UI/navigation.module.scss";
import axios from "axios"
import notification from '../../images/love-message.png'
import notifyInvite from '../../images/usrInvite.png'

const Navbar = ({token}) => {
    let history = useHistory();
    const [isInvite, setIsInvite] = useState(false) //check if user got new invites
    const [isMsg, setIsMsg] = useState(false)  //check if user got unanswered chats


    useEffect(() => {
        axios({
            method: "GET",
            url: "/api/account/new-com",
            headers:{
                'auth-token': token
            }
        }).then((res) => {
            console.log(res.data)
            setIsInvite(res.data.invites)
            setIsMsg(res.data.noAnswer)
        }).catch(err => {  
            console.log("fuck", err)
        })
    }, [])


    //Implement a check for unanswered messages
    let notify = null
    if(isInvite && !isMsg) {
        notify = <img style={{marginBottom: '1rem', marginLeft: '0.2rem', background: "#76e5fc", borderRadius: '50%', padding: '1px'}} src={notifyInvite} alt="new invite or missed message notification" /> 
    }else if(isMsg && !isInvite) {
        notify = <img style={{marginBottom: '1rem', marginLeft: '0.2rem', background: "#76e5fc", borderRadius: '50%', padding: '1px'}} src={notification} alt="new invite or missed message notification" /> 
    }else if (isInvite && isMsg) {
        notify = <img style={{marginBottom: '1rem', marginLeft: '0.2rem', background: "#76e5fc", borderRadius: '50%', padding: '1px'}} src={notification} alt="new invite or missed message notification" /> 
    }

    return (
            <nav className="navbar navbar-expand-lg">
                    <div className={"navbar-nav "+styles.nav}>
                        <div className={styles.navElement}>
                            <NavLink activeClassName={styles.hoverableActive} className={styles.hoverable} exact to="/">
                                Home
                            </NavLink>
                        </div>
                        <div className={styles.navElement}>
                            <NavLink activeClassName={styles.hoverableActive} className={styles.hoverable} to="/profile">
                                Profile
                            </NavLink>
                        </div>
                        {/* <div className={styles.navElement}><NavLink className={styles.hoverable} to="/messages">Messages</NavLink></div>
                        <div className={styles.navElement}><NavLink className={styles.hoverable} to="/match">MatchUp</NavLink></div> */}
                        <div className={styles.navElement}>
                            <NavLink activeClassName={styles.hoverableActive} className={styles.hoverable} to="/connections">
                                Connections
                            </NavLink>
                            {notify}
                        </div>
                       
                        <div className={styles.navElement}>
                            <NavLink activeClassName={styles.hoverableActive} className={styles.hoverable} to="/user-search">
                                User Search
                            </NavLink>
                        </div>
                        
                    </div>
                   
            </nav>
       
    )
}

export default Navbar;