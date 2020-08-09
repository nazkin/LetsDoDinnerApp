import React from 'react';
import {NavLink} from 'react-router-dom';
import styles from "../styles/navigation.module.scss";

const Navbar = () => {

    return (
            <nav className="navbar navbar-expand-lg">
                    <div className={"navbar-nav "+styles.nav}>
                        <div className={styles.navElement}><NavLink className={styles.hoverable} to="/profile">Profile</NavLink></div>
                        <div className={styles.navElement}><NavLink className={styles.hoverable} to="/messages">Messages</NavLink></div>
                        <div className={styles.navElement}><NavLink className={styles.hoverable} to="/match">MatchUp</NavLink></div>
                        <div className={styles.navElement}><NavLink className={styles.hoverable} to="/user-search">User Search</NavLink></div>
                    </div>
            </nav>
       
    )
}

export default Navbar;