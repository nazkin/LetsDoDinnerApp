import React, {useState} from 'react';
import styles from './styles/accountStart.module.scss';
import FormB from '../components/AccountFormB';
import FormA from '../components/AccountFormA';
import axios from 'axios';

const StartAccount = props => {
    const [isFormB, setIsFormB] = useState(false);

    const nextForm = () => {
        setIsFormB(true);
    }

    return(
        <div className={"container-fluid "+ styles.startContainer}>
            <div className={"row "+styles.titleBox}>
                <p>Lets get you started with an account</p>
            </div>
            <FormB />

        </div>
    )
}
export default StartAccount