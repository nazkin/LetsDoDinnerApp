import React from 'react'
import Navigation from './UI/Naviation';
import { Link, useHistory } from 'react-router-dom';
import styles from './styles/core/compIndex.module.scss';

const Template = (props) => {
    let history = useHistory()
    const token = sessionStorage.getItem('auth-token')
    const logOutHandler = () => {
        sessionStorage.removeItem('auth-token')
        history.push('/')
    }
    return (
        <div className={"container-fluid "+styles.main}>
            <header role="banner">
                <p onClick={logOutHandler} className={styles.logout}>Logout</p>
                <img id={styles.logoMain} src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/32877/logo-thing.png" width="200" alt="company Logo" />
                
            </header>
            <Navigation token={token}/>
           
            {props.children}
            <footer className={styles.footer}>
                <header role="banner">
                    <img id={styles.logoMain} src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/32877/logo-thing.png" width="200" alt="company Logo" />
                </header>
                <div className={"row py-2"}>
                    <div className="col-md-3 text-center">
                        <Link><h5>Home</h5></Link>
                        <section className={"d-flex flex-column align-items-center "}>
                            <Link><h5>Profile</h5></Link>
                            <Link><h5>Your Connections</h5></Link>
                            <Link><h5>User Search</h5></Link>
                        </section>
                    </div>
                    <div className="col-md-3 text-center">
                        <Link><h5>About Us</h5></Link>
                    </div>
                    <div className="col-md-3 text-center">
                        <Link><h5>FAQ</h5></Link>
                    </div>
                    <div className="col-md-3 text-center">
                        <Link><h5>Contact</h5></Link>
                        <section className={"d-flex flex-column align-items-end px-4 "}>
                            <h5><span>Phone: </span>234-992-1010</h5>
                            <h5><span>Fax: </span>234-99-1010</h5>
                            <h5><span>Email: </span>info@dinnerDates.com</h5>
                        </section>
                    </div>
                </div>
            </footer>
        </div>
    )
}
export default Template