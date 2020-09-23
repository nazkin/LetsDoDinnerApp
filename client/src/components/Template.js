import React from 'react'
import Navigation from './UI/Naviation';
import styles from './styles/core/compIndex.module.scss';

const Template = (props) => {

    return (
        <div className={"container-fluid "+styles.main}>
            <header role="banner">
                <img id={styles.logoMain} src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/32877/logo-thing.png" width="200" alt="company Logo" />
            </header>
            <Navigation />
           
            {props.children}
        </div>
    )
}
export default Template