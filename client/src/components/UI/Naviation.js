import React from 'react';
import {NavLink, useHistory} from 'react-router-dom';
import styles from "../styles/navigation.module.scss";

const Navbar = () => {
    let history = useHistory();

    const logOutHandler = () => {
        sessionStorage.removeItem('auth-token')
        history.push('/')
    }

    return (
            <nav className="navbar navbar-expand-lg">
                    <div className={"navbar-nav "+styles.nav}>
                        <div className={styles.navElement}><NavLink className={styles.hoverable} to="/">Home</NavLink></div>
                        <div className={styles.navElement}><NavLink className={styles.hoverable} to="/profile">Profile</NavLink></div>
                        {/* <div className={styles.navElement}><NavLink className={styles.hoverable} to="/messages">Messages</NavLink></div>
                        <div className={styles.navElement}><NavLink className={styles.hoverable} to="/match">MatchUp</NavLink></div> */}
                        <div className={styles.navElement}><NavLink className={styles.hoverable} to="/connections">Connections</NavLink></div>
                        <div className={styles.navElement}><NavLink className={styles.hoverable} to="/user-search">User Search</NavLink></div>
                        <a onClick={logOutHandler} className={"btn btn-link "+ styles.hoverable}>Logout</a>
                    </div>
                   
            </nav>
       
    )
}

export default Navbar;